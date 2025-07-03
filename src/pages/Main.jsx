import React from 'react'
import { useNavigate } from 'react-router-dom'


const recommendations = [
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    image: 'https://images-na.ssl-images-amazon.com/images/I/81H9b5HkJIL.jpg'
  },
  {
    title: 'Company of One',
    author: 'Paul Jarvis',
    image: 'https://images-na.ssl-images-amazon.com/images/I/81l3rZK4lnL.jpg'
  },
  {
    title: 'How Innovation Works',
    author: 'Matt Ridley',
    image: 'https://images-na.ssl-images-amazon.com/images/I/81w+3k4vQwL.jpg'
  },
  {
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    image: 'https://images-na.ssl-images-amazon.com/images/I/81AFgE3cK+L.jpg'
  }
]

const categories = [
  {
    name: 'Money/Investing',
    image: 'https://images-na.ssl-images-amazon.com/images/I/81t2CVWEsUL.jpg'
  },
  {
    name: 'Design',
    image: 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg'
  },
  {
    name: 'Business',
    image: 'https://images-na.ssl-images-amazon.com/images/I/81vpsIs58WL.jpg'
  },
  {
    name: 'Self Improvement',
    image: 'https://images-na.ssl-images-amazon.com/images/I/71QKQ9mwV7L.jpg'
  }
]

const Main = () => {

  const navigate = useNavigate()
  return (
    
    <div className="min-h-screen bg-[#f8f6ed] px-8 py-4">
      {/* Search Bar */}
      <div className="w-full mb-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Discover</h1>
        <div className="flex gap-3 items-center bg-white rounded-xl shadow px-4 py-3">
          <select className="border-none bg-transparent text-gray-600 text-sm focus:ring-0">
            <option>All Categories</option>
            <option>Money/Investing</option>
            <option>Design</option>
            <option>Business</option>
            <option>Self Improvement</option>
          </select>
          <input
            type="text"
            placeholder="find the book you like ..."
            className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-700"
          />
          <button className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Book Recommendation */}
      <div className="w-full mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Book Recommendation</h2>
          <button onClick={() => navigate('/library')} className="flex items-center gap-1 text-sm text-gray-700 hover:text-green-700 font-medium">
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {recommendations.map((book, idx) => (
            <div
              key={idx}
              className="w-56 h-[370px] mx-auto bg-white rounded-xl shadow p-4 flex flex-col items-center"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-40 h-60 object-cover rounded-lg mb-4 shadow"
              />
              <div className="text-center flex-1 flex flex-col justify-end">
                <h3 className="text-base font-semibold text-gray-800">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book Category */}
      <div className="w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Book Category</h2>
        <div className="flex gap-8 flex-wrap">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[120px]">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-44 h-56 object-cover rounded-lg mb-2 shadow"
              />
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Main