import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AppContext = createContext()

const ContextProvider = ({ children }) => {

    const[books, setBooks] = useState([])
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    })
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem("isAuthenticated") === "true";
    });

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/members/auth/login", {
                email,
                password
            });
            
            if (response.data === true) {
                // Create user object with email
                const userData = { email };
                
                // Update state
                setUser(userData);
                setIsAuthenticated(true);
                
                // Store in localStorage
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('isAuthenticated', 'true');
                
                return { success: true, message: "Login successful" };
            } else {
                return { success: false, message: "Invalid credentials" };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { 
                success: false, 
                message: error.response?.data?.message || "Login failed" 
            };
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
    };

     const editMember  = async (memberId, updatedData) => {
            try {
                const url = `http://localhost:8080/api/v1/members/${memberId}`;
                const response = await axios.put(url, updatedData);
                console.log("Member updated successfully:", response.data);
                return response.data;
            } catch (error) {
                console.error("Error updating member:", error);
                throw error;
            }
        }

    const getRelatedMember = async (email) => {
        try {
            const allMembers = await axios.get(`http://localhost:8080/api/v1/members`);
            const memberData = allMembers.data.find(member => member.email === email);
            if (memberData) {
                return {
                    id: memberData.memberId,
                    email: memberData.email,
                    name: memberData.name,
                    phone: memberData.phoneNumber,
                    address: memberData.address,
                };
                
            }
        } catch (error) {
            console.error("Error fetching member data:", error);
            return null;
        }
    }


    useEffect(() => {
    // Only fetch by genre if selectedType is not set and genre is set and not "All Genres"
    if ((!selectedType || selectedType === "All Types") && selectedGenre && selectedGenre !== "All Genres") {
        const fetchBooksByGenre = async () => {
            try {
                const url = "http://localhost:8080/api/v1/books";
                const params = { genre: selectedGenre };
                const response = await axios.get(url, { params });
                setBooks(response.data);
                console.log(response.data)
            } catch (error) {
                setBooks([]);
                console.error("Error fetching books by genre:", error);
            }
        };
        fetchBooksByGenre();
    }
    // If neither type nor genre is selected, fetch all books
    if ((!selectedType || selectedType === "All Types") && (!selectedGenre || selectedGenre === "All Genres")) {
        const fetchAllBooks = async () => {
            try {
                const url = "http://localhost:8080/api/v1/books";
                const response = await axios.get(url);
                setBooks(response.data);
                console.log(response.data)
            } catch (error) {
                setBooks([]);
                console.error("Error fetching all books:", error);
            }
        };
        fetchAllBooks();
    }
}, [selectedGenre, selectedType]);

useEffect(() => {
    // Only fetch by type if selectedType is set and not "All Types"
    if (selectedType && selectedType !== "All Genres") {
        const fetchBooksByType = async () => {
            try {
                const url = `http://localhost:8080/api/v1/books/${encodeURIComponent(selectedType.toLowerCase().replace(/\s+/g, "-"))}`;
                const response = await axios.get(url);
                setBooks(response.data);
                console.log(response.data)
            } catch (error) {
                setBooks([]);
                console.error("Error fetching books by type:", error);
            }
        };
        fetchBooksByType();
    }
}, [selectedType]);


const fetchPopularBooks = async () => {
        try {
            const url = "http://localhost:8080/api/v1/books/popular";
            const response = await axios.get(url);
             return response.data;
        } catch (error) {
            console.error("Error fetching popular books:", error);
            return [];
        }
    }

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
        try {
            const url = "http://localhost:8080/api/v1/borrowings";
            const response = await axios.get(url);
            setBorrowedBooks(response.data);
            console.log(response.data)
        } catch (error) {
            setBorrowedBooks([]);
            console.error("Error fetching borrowed books:", error);
        }
        fetchBorrowedBooks()
    }
    }, [borrowedBooks])

    const getBorrowing = async (memberId) => {
        try {
            console.log(`Fetching borrowings for member ID: ${memberId}`);
            const url = `http://localhost:8080/api/v1/borrowings`;
            const response = await axios.get(url);
            
            // Filter borrowings by member ID if memberId is provided
            let borrowings = memberId 
                ? response.data.filter(borrowing => 
                    borrowing.memberId === memberId || borrowing.member_id === memberId
                )
                : response.data;
            
            console.log("Filtered Borrowings:", borrowings);
            
            // Fetch book details for each borrowing
            if (borrowings && borrowings.length > 0) {
                console.log(`Processing ${borrowings.length} borrowings to fetch book details...`);
                const borrowingsWithBookDetails = await Promise.all(
                    borrowings.map(async (borrowing) => {
                        try {
                            // Fetch book details using bookId from borrowing
                            const bookId = borrowing.bookId || borrowing.book_id;
                            if (bookId) {
                                console.log(`Fetching book details for bookId: ${bookId}`);
                                const bookResponse = await axios.get(`http://localhost:8080/api/v1/books/${bookId}`);
                                const bookData = bookResponse.data;
                                
                                // Combine borrowing data with book details
                                return {
                                    ...borrowing,
                                    // Book details
                                    bookTitle: bookData.bookName || bookData.title || 'Unknown Title',
                                    bookAuthor: bookData.author || 'Unknown Author',
                                    bookCover: bookData.imageUrl || bookData.cover || null,
                                    bookCategory: bookData.category || 'Uncategorized',
                                    // Keep original book reference
                                    book: bookData
                                };
                            }
                            // Return original borrowing with default values if no bookId
                            return {
                                ...borrowing,
                                bookTitle: 'Unknown Title',
                                bookAuthor: 'Unknown Author',
                                bookCover: null,
                                bookCategory: 'Uncategorized'
                            };
                        } catch (bookError) {
                            console.error(`Error fetching book details for bookId ${borrowing.bookId || borrowing.book_id}:`, bookError);
                            
                            // Return borrowing with fallback book details if book fetch fails
                            return {
                                ...borrowing,
                                bookTitle: `Book ID: ${borrowing.bookId || borrowing.book_id}`,
                                bookAuthor: 'Unknown Author',
                                bookCover: null,
                                bookCategory: 'Uncategorized',
                                bookFetchError: true
                            };
                        }
                    })
                );
                
                console.log("Borrowings with Book Details:", borrowingsWithBookDetails);
                return borrowingsWithBookDetails;
            }
            
            return borrowings;
            
        } catch (error) {
            console.error("Error fetching borrowing data:", error);
            
            // Return empty array instead of null to prevent component errors
            return [];
        }

    }

    const sendResetEmail = async (email) => {
        try {
            const response = await axios.post(`http://localhost:8080/api/v1/members/send-reset-password-link?email=${email}`);
            return response.data;
        } catch (error) {
            console.error("Error sending reset email:", error);
            throw error;
        }
    }


    return (
        <AppContext.Provider value={{books, setSelectedGenre, setSelectedType, fetchPopularBooks, borrowedBooks, user, isAuthenticated, login, logout, getRelatedMember, editMember, getBorrowing, sendResetEmail}}>
            {children}
        </AppContext.Provider>
    );
}

export default ContextProvider;