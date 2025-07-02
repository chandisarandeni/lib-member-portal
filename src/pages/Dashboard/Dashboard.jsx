import React from "react";
import Main from "../Main";
import AddBooks from "../AddBooks";
import AddUser from "../AddUser";
import EditBookModal from "../../components/EditBookModal";
import AllUsers from "../AllUsers";
import AllBooks from "../AllBooks";
import Profile from "../Profile";
import OverdueBooks from "../OverdueBooks";
import { Route, Routes, Link, NavLink } from "react-router-dom";
import MyBooks from "../MyBooks";
import Favorites from "../Favorites";
import MyProfile from "../MyProfile";
import Help from "../Help";
import { assets } from "../../assets/assests";

const Dashboard = () => {
  const dashboardicon = (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z"
      />
    </svg>
  );

  const overviewicon = (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        d="M7.111 20A3.111 3.111 0 0 1 4 16.889v-12C4 4.398 4.398 4 4.889 4h4.444a.89.89 0 0 1 .89.889v12A3.111 3.111 0 0 1 7.11 20Zm0 0h12a.889.889 0 0 0 .889-.889v-4.444a.889.889 0 0 0-.889-.89h-4.389a.889.889 0 0 0-.62.253l-3.767 3.665a.933.933 0 0 0-.146.185c-.868 1.433-1.581 1.858-3.078 2.12Zm0-3.556h.009m7.933-10.927 3.143 3.143a.889.889 0 0 1 0 1.257l-7.974 7.974v-8.8l3.574-3.574a.889.889 0 0 1 1.257 0Z"
      />
    </svg>
  );

  const chaticon = (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
      />
    </svg>
  );

  const sidebarLinks = [
    { name: "Dashboard", path: "/", icon: dashboardicon },
    { name: "My Books", path: "/all-books", icon: overviewicon },
    { name: "profile", path: "/profile", icon: chaticon },
    { name: "Favorites", path: "/favorites", icon: chaticon },
    { name: "library", path: "/library", icon: chaticon },
    { name: "Help", path: "/help", icon: chaticon },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="md:w-64 w-16 border-r border-gray-300 bg-white flex flex-col transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-[#8E552C]">
          <a href="/">
            <img
              className="h-9"
              src={assets.logo}
              alt="dummyLogoColored"
            />
          </a>
        </div>

        {/* Sidebar Links */}
        <div className="pt-4 flex flex-col flex-1">
          {sidebarLinks.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 transition-colors
                            ${
                              isActive
                                ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-[#8E552C] text-[#B67242]"
                                : "hover:bg-gray-100/90 border-white text-gray-700"
                            }`
              }
              end={item.path === "/"}
            >
              {item.icon}
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header for all screens */}
        <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-[#8E552C]">
          <div></div>
          <div className="flex items-center gap-5 text-black">
            <p>Hi! Admin</p>
            <button className="border rounded-full text-sm px-4 py-1">
              Logout
            </button>
          </div>
        </div>
        {/* Main Dashboard Content */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="" element={<Main />} />
            <Route path="/add-books" element={<AddBooks />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/edit-book/:id" element={<EditBookModal />} />
            <Route path="/all-users" element={<AllUsers />} />
            <Route path="/all-books" element={<MyBooks />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/library" element={<AllBooks />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
