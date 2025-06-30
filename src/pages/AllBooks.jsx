import React, { useState } from 'react'

// Example random books data
const initialBooks = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  title: `Book Title ${i + 1}`,
  author: `Author ${i + 1}`,
  category: ['Technology', 'Fiction', 'Science'][i % 3],
  status: i % 4 === 0 ? 'Borrowed' : (i % 5 === 0 ? 'Overdue' : 'Available')
}))

const AllBooks = () => {
  const [search, setSearch] = useState('')
  const [books] = useState(initialBooks)

  // Filter books by title, author, or category
  const filteredBooks = books.filter(
    book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-xl font-bold text-gray-800">All Books</h2>
        <input
          type="text"
          placeholder="Search by title, author, or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full md:w-64"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBooks.map(book => (
              <tr key={book.id}>
                <td className="px-4 py-3 text-sm text-gray-900">#{book.id.toString().padStart(4, '0')}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{book.title}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{book.author}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{book.category}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    book.status === 'Available'
                      ? 'bg-green-100 text-green-800'
                      : book.status === 'Borrowed'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button className="border border-gray-300 px-3 py-1 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {filteredBooks.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">No books found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllBooks