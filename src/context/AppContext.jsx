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


    return (
        <AppContext.Provider value={{books, setSelectedGenre, setSelectedType, fetchPopularBooks, borrowedBooks, user, isAuthenticated, login, logout, getRelatedMember, editMember}}>
            {children}
        </AppContext.Provider>
    );
}

export default ContextProvider;