const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema({
    // Timestamps: true,
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    content: [
        {
            type: String,
        }
    ],
    visibility: {
        type: Boolean,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    issues: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Issue",
        }
    ]
})

const Repository = new mongoose.model("Repository", repositorySchema);

module.exports =  Repository;