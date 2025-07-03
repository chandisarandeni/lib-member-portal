import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AppContext = createContext()

const ContextProvider = ({ children }) => {

    const[books, setBooks] = useState([])
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedType, setSelectedType] = useState("");


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


    return (
        <AppContext.Provider value={{books, setSelectedGenre, setSelectedType, fetchPopularBooks}}>
            {children}
        </AppContext.Provider>
    );
}

export default ContextProvider;