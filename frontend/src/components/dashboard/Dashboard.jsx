import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error("Error while fetching repositories:", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data || []);
      } catch (err) {
        console.error("Error while fetching suggested repositories:", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filtered = repositories.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, repositories]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Sidebar */}
        <aside className="hidden lg:block bg-[#161b22] rounded-xl p-4 border border-gray-800 h-fit">
          <h3 className="text-lg font-semibold mb-4">Suggested Repositories</h3>
          {suggestedRepositories.map(repo => (
            <div key={repo._id} className="mb-4 p-3 rounded-lg hover:bg-[#1d2530] transition border border-gray-700">
              <h4 className="text-blue-400 font-medium hover:underline cursor-pointer">{repo.name}</h4>
              <p className="text-gray-400 text-sm">{repo.description}</p>
            </div>
          ))}
        </aside>

        {/* Main Section */}
        <main className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Repositories</h2>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            className="w-full px-3 py-2 rounded-md bg-[#161b22] border border-gray-700 text-sm focus:outline-none focus:ring focus:ring-green-600"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Repo List */}
          <div className="mt-4 space-y-3">
            {searchResults.map(repo => (
              <div key={repo._id} className="border border-gray-800 bg-[#161b22] rounded-lg p-4 hover:border-gray-600 transition">
                <h4 className="text-blue-400 font-medium hover:underline cursor-pointer">{repo.name}</h4>
                <p className="text-gray-400 text-sm">{repo.description}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="bg-[#161b22] rounded-xl p-4 border border-gray-800 h-fit">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li>Tech Conference - Dec 15</li>
            <li>Developer Meetup - Dec 25</li>
            <li>React Summit - Jan 5</li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;