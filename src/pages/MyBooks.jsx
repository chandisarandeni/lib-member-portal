import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'




const statusTabs = ['All', 'Borrowed', 'Returned', 'Overdue']

const MyBooks = () => {
  const [selectedTab, setSelectedTab] = useState('All')
  const [myBorrowings, setMyBorrowings] = useState([])
  const [loading, setLoading] = useState(true)
  const {getBorrowing, user, getRelatedMember} = useContext(AppContext)
  
  // Fetch user's borrowings on component mount
  useEffect(() => {
    const fetchMyBorrowings = async () => {
      try {
        setLoading(true)
        if (user?.email) {
          console.log('Fetching borrowings for user:', user.email)
          // Get user's member info first
          const memberInfo = await getRelatedMember(user.email)
          if (memberInfo?.id) {
            console.log('Member info found:', memberInfo)
            // Get borrowings for this member
            const borrowings = await getBorrowing(memberInfo.id)
            console.log('Raw borrowings data:', borrowings)
            if (borrowings && borrowings.length > 0) {
              console.log('Sample borrowing object:', borrowings[0])
            }
            setMyBorrowings(borrowings || [])
          } else {
            console.log('No member info found for user')
            setMyBorrowings([])
          }
        } else {
          console.log('No user email available')
          setMyBorrowings([])
        }
      } catch (error) {
        console.error('Error fetching borrowings:', error)
        setMyBorrowings([])
      } finally {
        setLoading(false)
      }
    }

    fetchMyBorrowings()
  }, [user, getBorrowing, getRelatedMember])

  // Helper function to determine book status
  const getBookStatus = (book) => {
    // Check various possible status field names
    if (book.returnStatus) return book.returnStatus
    if (book.status) return book.status
    if (book.borrowingStatus) return book.borrowingStatus
    
    // Calculate status based on dates
    if (book.returnDate || book.returnedDate || book.returned_date) {
      return 'Returned'
    }
    
    // Check if overdue (if there's a due date)
    if (book.dueDate || book.due_date) {
      const dueDate = new Date(book.dueDate || book.due_date)
      const today = new Date()
      if (today > dueDate) {
        return 'Overdue'
      }
    }
    
    // Default to Borrowed if no return date
    return 'Borrowed'
  }

  const filteredBooks =
    selectedTab === 'All'
      ? myBorrowings
      : myBorrowings.filter(book => {
          const status = getBookStatus(book)
          return status === selectedTab
        })

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
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    Loading your books...
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No books found.
                  </td>
                </tr>
              ) : (
                filteredBooks.map(book => (
                  <tr key={book.id || book.borrowingId || book.borrowing_id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center">
                        {/* Book Cover Image */}
                        {book.bookCover && (
                          <img 
                            src={book.bookCover} 
                            alt={book.bookTitle}
                            className="w-10 h-12 object-cover rounded mr-3"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {book.bookTitle || book.title || book.book?.bookName || 'Unknown Title'}
                            {/* Show warning icon if book fetch failed */}
                            {book.bookFetchError && (
                              <span className="text-yellow-500 text-sm" title="Book details could not be loaded">
                                ⚠️
                              </span>
                            )}
                          </div>
                          {/* Book Category */}
                          {book.bookCategory && book.bookCategory !== 'Uncategorized' && (
                            <div className="text-xs text-gray-500 mt-1">
                              {book.bookCategory}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {book.bookAuthor || book.author || book.book?.author || 'Unknown Author'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {book.borrowingDate || book.borrowedDate || book.borrowed_date || '--'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {book.returnDate || book.returnedDate || book.returned_date ? 
                        (book.returnDate || book.returnedDate || book.returned_date) : 
                        <span className="text-gray-400">--</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {(() => {
                        const status = getBookStatus(book)
                        switch(status) {
                          case 'Returned':
                            return (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                Returned
                              </span>
                            )
                          case 'Borrowed':
                            return (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                Borrowed
                              </span>
                            )
                          case 'Overdue':
                            return (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                Overdue
                              </span>
                            )
                          default:
                            return (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                {status}
                              </span>
                            )
                        }
                      })()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MyBooks