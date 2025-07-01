import React, { useState } from 'react'
import BookCard from '../components/BookCard'

const allBooksData = [
  {
    bookId: 1,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81H9b5HkJIL.jpg',
    rating: 4,
    votes: 120,
    description: 'Timeless lessons on wealth, greed, and happiness.',
    category: 'Money/Investing'
  },
  {
    bookId: 2,
    title: 'Company of One',
    author: 'Paul Jarvis',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81l3rZK4lnL.jpg',
    rating: 4,
    votes: 85,
    description: 'Why staying small is the next big thing for business.',
    category: 'Business'
  },
  {
    bookId: 3,
    title: 'How Innovation Works',
    author: 'Matt Ridley',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81w+3k4vQwL.jpg',
    rating: 4,
    votes: 60,
    description: 'And why it flourishes in freedom.',
    category: 'Science'
  },
  {
    bookId: 4,
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81AFgE3cK+L.jpg',
    rating: 5,
    votes: 200,
    description: 'A classic novel of moral duplicity.',
    category: 'Fiction'
  },
  {
    bookId: 5,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81H9b5HkJIL.jpg',
    rating: 4,
    votes: 120,
    description: 'Timeless lessons on wealth, greed, and happiness.',
    category: 'Money/Investing'
  },
  {
    bookId: 6,
    title: 'Company of One',
    author: 'Paul Jarvis',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81l3rZK4lnL.jpg',
    rating: 4,
    votes: 85,
    description: 'Why staying small is the next big thing for business.',
    category: 'Business'
  },
  {
    bookId: 7,
    title: 'How Innovation Works',
    author: 'Matt Ridley',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81w+3k4vQwL.jpg',
    rating: 4,
    votes: 60,
    description: 'And why it flourishes in freedom.',
    category: 'Science'
  },
  {
    bookId: 8,
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81AFgE3cK+L.jpg',
    rating: 5,
    votes: 200,
    description: 'A classic novel of moral duplicity.',
    category: 'Fiction'
  }
]

const categories = [
  'All',
  ...Array.from(new Set(allBooksData.map(book => book.category)))
]

const AllBooks = () => {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredBooks = allBooksData.filter(book => {
    const matchesCategory =
      selectedCategory === 'All' || book.category === selectedCategory
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full md:w-1/4"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBooks.length === 0 ? (
            <div className="text-center text-gray-400 py-16">No books found.</div>
          ) : (
            filteredBooks.map(book => (
              <BookCard key={book.bookId} {...book} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AllBooks