import React from 'react'
import BookCard from '../components/BookCard'

const favoriteBooks = [
  {
    bookId: 1,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81H9b5HkJIL.jpg',
    rating: 4,
    votes: 120,
    description: 'Timeless lessons on wealth, greed, and happiness.'
  },
  {
    bookId: 2,
    title: 'Company of One',
    author: 'Paul Jarvis',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81l3rZK4lnL.jpg',
    rating: 4,
    votes: 85,
    description: 'Why staying small is the next big thing for business.'
  },
  {
    bookId: 3,
    title: 'How Innovation Works',
    author: 'Matt Ridley',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81w+3k4vQwL.jpg',
    rating: 4,
    votes: 60,
    description: 'And why it flourishes in freedom.'
  }
]

const Favorites = () => {
  return (
    <div className="min-h-screen bg-[#f8f6ed] px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Favorite Books</h1>
        <div className="grid gap-8">
          {favoriteBooks.length === 0 ? (
            <div className="text-center text-gray-400 py-16">No favorite books yet.</div>
          ) : (
            favoriteBooks.map(book => (
              <BookCard key={book.bookId} {...book} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Favorites