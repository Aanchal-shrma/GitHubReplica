const jwt = require("jsonwebtoken");
const { MongoClient, ReturnDocument } = require("mongodb");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });
    await client.connect();
  }
}

//USER SIGNUP
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    //connect to database
    await connectClient();
    const db = client.db("GitHubReplica");
    const usersCollection = db.collection("users");

    //user exists or not
    const user = await usersCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: result.insertedId });
  } catch (error) {
    console.error("Error during signup :", error.message);
    res.status(500).send("Server error");
  }
};

//USER LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //connect to database
    await connectClient();
    const db = client.db("GitHubReplica");
    const usersCollection = db.collection("users");

    //user exists or not
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user._id });
  } catch (error) {
    console.error("Error during login :", error.message);
    res.status(500).send("Server Error");
  }
};

//GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("GitHubReplica");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray(); //toArray function is used to convert object of profiles into an array

    res.json(users);
  } catch (error) {
    console.error("Error during getting all users :", error.message);
    res.status(500).send("Server Error");
  }
};

//READ PROFILE
const getUserProfile = async (req, res) => {
  const currentID = req.params.id;

  try {
    //connection setup
    await connectClient();
    const db = client.db("GitHubReplica");
    const usersCollection = db.collection("users");

    //get user by id
    const user = await usersCollection.findOne({
      _id: new ObjectId(currentID),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.send(user);
  } catch (error) {
    console.error("Error to getUserProfile :", error.message);
    res.status(500).send("Server Error");
  }
};

//UPDATE PROFILE
const updateUserProfile = async (req, res) => {
  const currentID = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("GitHubReplica");
    const usersCollection = db.collection("users");

    let updatedFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedFields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      {
        _id: new ObjectId(currentID),
      },
      { $set: updatedFields },
      { returnDocument: "after" }
    );
    if (!result.value) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(result.value);
  } catch (error) {
    console.error("Error during updating :", error.message);
    res.status(500).send("Server Error");
  }
};

//DELETE PROFILE
const deleteUserProfile = async (req, res) => {
  const currentID = req.params.id;

  try {
    await connectClient();
    const db = client.db("GitHubReplica");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(currentID),
    });

    if (result.deleteCount == 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User profile deleted" });
  } catch (error) {
    console.error("Error while deleting :", error.message);
    res.status(500).send("Server Error");
  }
};

//EXPORTING THEM

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
