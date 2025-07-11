import React, { useContext, useState } from 'react'
import BookCard from '../components/BookCard'
import { AppContext } from '../context/AppContext'
import { Navigate, useNavigate } from 'react-router-dom'


const categories = [
  "All Genres",
    "Drama",
    "Science",
    "Fiction",
    "Philosophy",
    "Biography"
  
]

const AllBooks = () => {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Genres')
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 8
  const {books, setSelectedGenre, setSelectedType, user} = useContext(AppContext)
  const navigate = useNavigate()

  const filteredBooks = books.filter(book => {
    const matchesCategory =
      selectedCategory === 'All Genres' || book.category === selectedCategory
    const matchesSearch =
      book.bookName.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const startIndex = (currentPage - 1) * booksPerPage
  const endIndex = startIndex + booksPerPage
  const currentBooks = filteredBooks.slice(startIndex, endIndex)

  const handleCategoryChange = (e) => {
    const genre = e.target.value
    setSelectedCategory(genre)

  }

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedCategory])

  return (
    <div className="min-h-screen bg-[#f8f6ed] px-8 py-8">
      <div className="w-full mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">All Books</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full md:w-1/2"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full md:w-1/4"
          >
            {categories.map(cat => (
              <option  key={cat} value={cat} >{cat}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {currentBooks.length === 0 ? (
            <div className="text-center text-gray-400 py-16">No books found.</div>
          ) : (
            currentBooks.map(book => (
              <BookCard key={book.bookId}
                        title={book.bookName}
                        author={book.author}
                        cover={book.imageUrl}
                        votes={book.numberOfViewers}
                        bookId={book.bookId}  />
            ))
          )}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllBooks