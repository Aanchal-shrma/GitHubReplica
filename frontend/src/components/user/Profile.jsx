import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import HeatMapProfile from "../user/HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/userProfile/${userId}`
          );
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <Navbar />

      {/* Tabs */}
      <div className="border-b border-gray-800 px-6">
        <nav className="flex space-x-6 text-sm font-medium">
          <button className="py-3 border-b-2 border-green-500 text-white font-semibold">
            Overview
          </button>
          <button
            onClick={() => navigate("/repo")}
            className="py-3 text-gray-400 hover:text-white"
          >
            Starred Repositories
          </button>
        </nav>
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT SIDEBAR */}
        <aside className="space-y-4">
          <img
            className="w-40 h-40 rounded-full bg-gray-800 border border-gray-600 object-cover"
            src={`https://ui-avatars.com/api/?name=${userDetails.username}&background=1f6feb&color=fff&size=200`}
            alt="Profile"
          />

          <h2 className="text-2xl font-bold">{userDetails.username}</h2>

          {/* Follow Button */}
          <button className="w-full bg-[#21262d] text-white border border-gray-700 px-4 py-2 rounded-md hover:bg-[#30363d] transition">
            Follow
          </button>

          {/* Followers Count */}
          <div className="flex gap-4 text-sm text-gray-300">
            <p>
              <span className="font-semibold text-white">10</span> followers
            </p>
            <p>
              <span className="font-semibold text-white">3</span> following
            </p>
          </div>

          {/* Bio */}
          <div className="text-sm text-gray-300 space-y-2">
            <p className="font-medium">Bio will be added here...</p>
            <p className="flex gap-1 items-center text-gray-400">
              📍 Location: India
            </p>
            <p className="flex gap-1 items-center text-gray-400">
              🌐 Website: --
            </p>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="md:col-span-2 space-y-8">
          <div className="bg-[#161b22] rounded-lg p-6 border border-gray-800">
            <h3 className="font-semibold mb-4 text-gray-200 text-lg">
              Contribution Activity
            </h3>
            <HeatMapProfile />
          </div>

          {/* Pinned Repos */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-200">Pinned</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((repo, i) => (
                <div
                  key={i}
                  className="bg-[#161b22] border border-gray-700 rounded-lg p-4 hover:border-gray-500 transition"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-blue-400 font-medium hover:underline cursor-pointer">
                      sample-repo-{i + 1}
                    </h3>
                    <span className="text-gray-400 text-sm flex gap-1">
                      ⭐ 5
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-2">
                    Description of the repository goes here...
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                    JavaScript
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrentUser(null);
          window.location.href = "/auth";
        }}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
