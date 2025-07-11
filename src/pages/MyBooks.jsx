import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'


const booksData = [
  {
    id: 1,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    borrowDate: '2024-06-01',
    returnDate: '2024-06-10',
    status: 'Returned'
  },
  {
    id: 2,
    title: 'Company of One',
    author: 'Paul Jarvis',
    borrowDate: '2024-06-05',
    returnDate: null,
    status: 'Borrowed'
  },
  {
    id: 3,
    title: 'How Innovation Works',
    author: 'Matt Ridley',
    borrowDate: '2024-05-20',
    returnDate: '2024-06-01',
    status: 'Returned'
  },
  {
    id: 4,
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    borrowDate: '2024-06-10',
    returnDate: null,
    status: 'Overdue'
  }
]

const statusTabs = ['All', 'Borrowed', 'Returned', 'Overdue']

const MyBooks = () => {
  const [selectedTab, setSelectedTab] = useState('All')
  const {borrowedBooks} = useContext(AppContext)

  const filteredBooks =
    selectedTab === 'All'
      ? borrowedBooks
      : borrowedBooks.filter(book => book.status === selectedTab)

  return (
    <div className="min-h-screen bg-[#f8f6ed] px-8 py-8">
      <div className="w-full bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Books</h1>
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {statusTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTab === tab
                  ? 'bg-[#8E552C] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed On</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returned On</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No books found.
                  </td>
                </tr>
              )}
              {filteredBooks.map(book => (
                <tr key={book.bookId}>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.author}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.borrowDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {book.returnDate ? book.returnDate : <span className="text-gray-400">--</span>}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {book.returnStatus === 'Returned' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Returned
                      </span>
                    )}
                    {book.returnStatus === 'Borrowed' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        Borrowed
                      </span>
                    )}
                    {book.returnStatus === 'Overdue' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                        Overdue
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MyBooks