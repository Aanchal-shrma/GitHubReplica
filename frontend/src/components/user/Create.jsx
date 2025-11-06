import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId"); // userId must in localstorage

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/repo/create", {
        owner: userId,
        name,
        description,
        visibility: visibility === "public" ? true : false,
        issues: [],
        content: [],
      });

      console.log("Create Repo Request Body:", req.body);

      if (!userId) {
        setMessage("User not logged in");
        return;
      }

      setMessage(res.data.message);
      setName("");
      setDescription("");
      setVisibility("public");
    } catch (err) {
      setMessage(err.response?.data?.error || "Error creating repository");
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#0d1117] text-white flex justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-semibold mb-6">Create a new repository</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Repository Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Repository name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#161b22] border border-gray-700 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-600"
              placeholder="Enter repository name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              🛈 Great repository names are short and memorable.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full bg-[#161b22] border border-gray-700 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-600"
              placeholder="Write a short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Visibility */}
          <div>
            <span className="block text-sm font-medium mb-1">Visibility</span>

            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                value="public"
                checked={visibility === "public"}
                onChange={() => setVisibility("public")}
              />
              <span>Public</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="private"
                checked={visibility === "private"}
                onChange={() => setVisibility("private")}
              />
              <span>Private</span>
            </label>
          </div>

          {/* Submit Button */}
          <Link to="/">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded-md font-medium"
          >
            Create repository
          </button>
          </Link>

          {/* Response Message */}
          {message && <p className="mt-2 text-sm text-green-400">{message}</p>}
        </form>
      </div>
    </div>
    </>
  );
};

export default CreateRepo;
