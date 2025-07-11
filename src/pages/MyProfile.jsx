import React, { useState, useRef, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const initialProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  address: "",
  phoneNumber: "",
  role: "Member",
  profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
};

const MyProfile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(profile.profilePic);
  const fileInputRef = useRef(null);
  const [memberData, setMemberData] = useState(null);
  const { user, getRelatedMember, editMember } = useContext(AppContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    // Reset to the current member data instead of initial profile
    if (memberData) {
      setProfile((prev) => ({
        ...prev,
        name: memberData.name || prev.name,
        email: memberData.email || user.email || prev.email,
        address: memberData.address || prev.address,
        phoneNumber: memberData.phoneNumber || memberData.phone || "",
        profilePic: memberData.profilePic || prev.profilePic,
        dateOfBirth: memberData.dateOfBirth,
        gender: memberData.gender,
      }));
    } else {
      setProfile(initialProfile);
    }
    setPreview(initialProfile.profilePic);
    setEditing(false);
  };

  useEffect(() => {
    const fetchMemberData = async () => {
      if (user?.email) {
        const memberInfo = await getRelatedMember(user.email);
        setMemberData(memberInfo);
        console.log("Member Data:", memberInfo);

        // Update profile with member data if available
        if (memberInfo) {
          console.log("Member Data:", memberInfo);
          console.log(
            "Member ID field:",
            memberInfo.id,
            memberInfo.memberId,
            memberInfo.member_id
          );
          console.log("Phone from memberInfo:", memberInfo.phone);
          console.log("PhoneNumber from memberInfo:", memberInfo.phoneNumber);

          setProfile((prev) => ({
            ...prev,
            name: memberInfo.name || prev.name,
            email: memberInfo.email || user.email || prev.email,
            address: memberInfo.address || prev.address,
            phoneNumber: memberInfo.phoneNumber || memberInfo.phone || "",
            profilePic: memberInfo.profilePic || prev.profilePic,
            dateOfBirth: memberInfo.dateOfBirth,
            gender: memberInfo.gender
          }));
        } else if (user?.email) {
          // If no member data but user is logged in, at least show their email
          setProfile((prev) => ({
            ...prev,
            email: user.email,
          }));
        }
      }
    };

    fetchMemberData();
  }, [user, getRelatedMember]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      // Check if memberData exists and has an ID
      if (!memberData) {
        toast.error("Member data not found. Please refresh the page.", {
          duration: 4000,
          position: "top-center",
        });
        return;
      }

      // Try different possible ID field names
      const memberId =
        memberData.id || memberData.memberId || memberData.member_id;

      if (!memberId) {
        console.error("No member ID found in memberData:", memberData);
        toast.error("Member ID not found. Please contact support.", {
          duration: 4000,
          position: "top-center",
        });
        return;
      }

      // Prepare the data to send to the backend - include ALL existing fields
      const updatedData = {
        ...memberData, // Keep ALL existing member data
        // Only update the fields that can be edited
        name: profile.name,
        address: profile.address,
        phoneNumber: profile.phoneNumber || profile.phone,
        email: profile.email,
        // Ensure ID field is properly set
        memberId: memberData.memberId || memberData.id,
      };

      console.log("Original memberData:", memberData);
      console.log("memberData nic value:", memberData.nic);
      console.log("memberData dateOfBirth value:", memberData.dateOfBirth);
      console.log("memberData gender value:", memberData.gender);
      console.log("Fields being updated:", {
        name: profile.name,
        address: profile.address,
        phoneNumber: profile.phoneNumber || profile.phone,
        email: profile.email,
      });
      console.log("Final updatedData being sent:", updatedData);
      console.log("Member ID being used:", memberId);
      
      // Validate that critical fields are not being set to null
      console.log("Critical fields check:", {
        nic: updatedData.nic,
        dateOfBirth: updatedData.dateOfBirth,
        gender: updatedData.gender,
        password: updatedData.password
      });

      // Call editMember function from AppContext with separate parameters
      const result = await editMember(memberId, updatedData);

      if (result) {
        setEditing(false);
        toast.success("Profile updated successfully!", {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#10B981",
            color: "white",
            fontWeight: "500",
          },
        });

        // Optionally refresh member data after successful update
        const updatedMemberInfo = await getRelatedMember(user.email);
        console.log("Updated member info after save:", updatedMemberInfo);
        if (updatedMemberInfo) {
          setMemberData(updatedMemberInfo);
          // Update profile state with refreshed data to ensure UI shows latest data
          setProfile((prev) => ({
            ...prev,
            name: updatedMemberInfo.name || prev.name,
            address: updatedMemberInfo.address || prev.address,
            phoneNumber:
              updatedMemberInfo.phoneNumber ||
              updatedMemberInfo.phone ||
              prev.phoneNumber,
            email: updatedMemberInfo.email || prev.email,
          }));
        }
      } else {
        toast.error("Failed to update profile. Please try again.", {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error updating profile. Please try again.", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setProfile((prev) => ({
          ...prev,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePicClick = () => {
    if (editing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="relative inline-block mb-4">
                <div
                  className={`relative w-32 h-32 rounded-full overflow-hidden border-4 ${
                    editing
                      ? "border-indigo-400 cursor-pointer shadow-lg"
                      : "border-gray-200"
                  } transition-all duration-300`}
                  onClick={handlePicClick}
                  title={editing ? "Click to change profile picture" : ""}
                >
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {editing && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-white text-center">
                        <svg
                          className="w-8 h-8 mx-auto mb-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-xs font-medium">Change</span>
                      </div>
                    </div>
                  )}
                </div>
                {editing && (
                  <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white rounded-full p-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
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
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {memberData?.name || profile.name}
              </h3>
              <p className="text-gray-500 text-sm">
                {memberData?.membershipType ||
                  memberData?.role ||
                  profile.role ||
                  "Member"}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Account Information
                </h2>
                {!editing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        disabled={!editing}
                        className={`w-full px-4 py-3 border rounded-lg transition-all ${
                          editing
                            ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            : "border-gray-200 bg-gray-50 text-gray-600"
                        }`}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Email - Read Only */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      disabled={!editing}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg transition-all resize-none ${
                        editing
                          ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                      placeholder={
                        editing ? "Enter your address" : "No address provided"
                      }
                    />
                    <div className="absolute top-3 right-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profile.phoneNumber || ""}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder={
                        editing
                          ? "Enter your phone number"
                          : "No phone number provided"
                      }
                      className={`w-full px-4 py-3 border rounded-lg transition-all ${
                        editing
                          ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {editing && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
