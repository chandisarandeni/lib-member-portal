import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'






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
  const [recommendations, setRecommendations] = useState([])
  const { fetchPopularBooks } = useContext(AppContext)
  const sliderRef = useRef(null)
  const [scrollX, setScrollX] = useState(0)

  useEffect(() => {
    fetchPopularBooks()
      .then(data => {
        setRecommendations(data)
      })
  }, [fetchPopularBooks])

  // Slider controls
  const scrollBy = (offset) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' })
    }
  }

  // Track scroll position for disabling arrows
  useEffect(() => {
    const handleScroll = () => {
      setScrollX(sliderRef.current.scrollLeft)
    }
    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener('scroll', handleScroll)
      return () => slider.removeEventListener('scroll', handleScroll)
    }
  }, [])

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

      {/* Book Recommendation Slider */}
      <div className="w-full mb-10 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Book Recommendation</h2>
          <button
            onClick={() => navigate('/library')}
            className="flex items-center gap-1 text-sm text-gray-700 hover:text-green-700 font-medium"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {/* Blurred edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 z-10">
          <div className="h-full w-full bg-gradient-to-r from-[#f8f6ed] to-transparent" />
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 z-10">
          <div className="h-full w-full bg-gradient-to-l from-[#f8f6ed] to-transparent" />
        </div>
        {/* Slider Arrows */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-2 shadow hover:bg-white transition disabled:opacity-30"
          style={{ display: recommendations.length > 4 ? 'block' : 'none' }}
          onClick={() => scrollBy(-240 * 1)} // scroll by 1 card width
          disabled={scrollX === 0}
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-2 shadow hover:bg-white transition"
          style={{ display: recommendations.length > 4 ? 'block' : 'none' }}
          onClick={() => scrollBy(240 * 1)} // scroll by 1 card width
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide relative z-0 scroll-smooth"
          style={{
            scrollBehavior: 'smooth',
            width: '992px', // 4 cards * 224px (w-56) + 3*gap-6 (24px*3=72px)
            maxWidth: '100%',
            margin: '0 auto',
            overflowX: 'hidden'
          }}
        >
          {recommendations.map((book, idx) => (
            <div
              key={idx}
              className="w-56 h-[370px] flex-shrink-0 mx-auto bg-white rounded-xl shadow p-4 flex flex-col items-center"
            >
              <img
                src={book.imageUrl}
                alt={book.bookName}
                className="w-40 h-60 object-cover rounded-lg mb-4 shadow"
              />
              <div className="text-center flex-1 flex flex-col justify-end">
                <h3 className="text-base font-semibold text-gray-800">{book.bookName}</h3>
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