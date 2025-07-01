import React from 'react'

const Help = () => (
  <div className="min-h-screen bg-[#f8f6ed] px-8 py-8 flex justify-center items-start">
    <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Help & Dashboard Guide</h1>
      <div className="space-y-6 text-gray-700 text-base">
        <section>
          <h2 className="text-xl font-semibold mb-2">Dashboard Overview</h2>
          <p>
            Welcome to your Book Dashboard! Here you can manage your books, profile, and more. Use the sidebar to navigate between different sections.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold mt-4 mb-2">Sections Explained</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <b>Dashboard:</b> View book recommendations and categories. Use the search bar to find books quickly.
            </li>
            <li>
              <b>All Books / Library:</b> Browse all available books. Use the search bar and category filter to find books. Click a book for details or to reserve it.
            </li>
            <li>
              <b>My Books:</b> See books you have borrowed, returned, or not yet returned. Use the tabs to filter by status.
            </li>
            <li>
              <b>Favorites:</b> View your favorite books. Click a book to see more details.
            </li>
            <li>
              <b>Profile:</b> View and edit your profile details. Click "Edit Profile" to update your information or change your profile picture.
            </li>
            <li>
              <b>Add Books / Add User:</b> (Admins only) Add new books or users to the system.
            </li>
            <li>
              <b>All Users:</b> (Admins only) View and manage all users in the system.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold mt-4 mb-2">Common Actions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <b>Searching:</b> Use the search bar at the top of most pages to quickly find books by title or author.
            </li>
            <li>
              <b>Filtering:</b> Use the category dropdown to filter books by category.
            </li>
            <li>
              <b>Reserving a Book:</b> Click the "Reserve" button on a book to reserve it (if available).
            </li>
            <li>
              <b>Editing Profile:</b> Go to the Profile page, click "Edit Profile", make your changes, and click "Save".
            </li>
            <li>
              <b>Logging Out:</b> Click the "Logout" button in the sidebar or header to log out of your account.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold mt-4 mb-2">Need More Help?</h2>
          <p>
            If you have any issues or questions, please contact your system administrator or support team.
          </p>
        </section>
      </div>
    </div>
  </div>
)

export default Help