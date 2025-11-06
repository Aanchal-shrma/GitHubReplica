const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");

dotenv.config();

const yargs = require("yargs"); //used to read commands from terminal
const { hideBin } = require("yargs/helpers"); //read commands with space access parameters
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pullRepo } = require("./controllers/pull");
const { pushRepo } = require("./controllers/push");
const { revertRepo } = require("./controllers/revert");

yargs(hideBin(process.argv))
  //initialize a repository
  .command("start", "start a new server", {}, startServer)
  .command("init", "initialize a new repository", {}, initRepo)

  //add repository
  .command(
    "add <file>",
    "add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )

  //commit repository
  .command(
    "commit <message>",
    "commit to the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )

  //pull repository
  .command("pull", "commits pulled", {}, pullRepo)

  //push repository
  .command("push", "commits pushed", {}, pushRepo)

  //revert to specific commit
  .command(
    "revert <commitID>",
    "revert to specific commit",
    (yargs) => {
      yargs.positional("revertID", {
        describe: "commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "you need at least one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGODB_URI;

  mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => {
      console.log("error while connecting", err);
    });

    app.use(cors({ origin: "*"}));

    app.use("/", mainRouter);

    let user = "test";
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    io.on("connection", (socket) => {
      socket.on("joinRoom", (userID) => {
        user=userID;
        console.log("=====");
        console.log(user);
        console.log("=====");
        socket.join(userID);
      })
    })

    const db = mongoose.connection;

    db.once("open", async() => {
      console.log("CRUD operations called");
      //CRUD operations
    });

    httpServer.listen(port, () => {
      console.log(`server is listening on ${port}`);
    })
}
