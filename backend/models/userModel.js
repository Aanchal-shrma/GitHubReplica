
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Timestamps: true,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  repositories: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repository"
    }
  ],

  followedUsers: [
    {
        dafault: [],
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
  ],
  starRepos: [
    {
        dafault: [],
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repository"
    }
  ]
});

const User = new mongoose.model("User", userSchema);

module.exports =  User;
