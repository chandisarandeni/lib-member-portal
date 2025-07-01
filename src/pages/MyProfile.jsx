import React, { useState, useRef } from 'react'

const initialProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: '',
  role: 'Student',
  profilePic: 'https://randomuser.me/api/portraits/men/32.jpg'
}

const MyProfile = () => {
  const [profile, setProfile] = useState(initialProfile)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState(profile.profilePic)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEdit = () => setEditing(true)

  const handleCancel = () => {
    setProfile(initialProfile)
    setPreview(initialProfile.profilePic)
    setEditing(false)
    setMessage('')
  }

  const handleSave = (e) => {
    e.preventDefault()
    setEditing(false)
    setMessage('Profile updated successfully!')
    // Here you would usually send the updated profile to your backend
  }

  const handlePicChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        setProfile(prev => ({
          ...prev,
          profilePic: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePicClick = () => {
    if (editing && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f6ed] px-8 py-8 flex justify-center items-start">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h1>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-4">
            <div
              className={`relative w-28 h-28 rounded-full overflow-hidden border-4 ${editing ? 'border-blue-400 cursor-pointer' : 'border-gray-200'}`}
              onClick={handlePicClick}
              title={editing ? "Click to change profile picture" : ""}
              style={{ transition: 'border-color 0.2s' }}
            >
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {editing && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">Change</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePicChange}
              className="hidden"
              disabled={!editing}
            />
          </div>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder={editing ? "Enter new password" : "********"}
            />
            <p className="text-xs text-gray-400 mt-1">Leave blank to keep current password.</p>
          </div>
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={profile.role}
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
            />
          </div>
          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="w-full px-4 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
          {message && <div className="text-green-600 text-sm mt-2">{message}</div>}
        </form>
      </div>
    </div>
  )
}

export default MyProfile