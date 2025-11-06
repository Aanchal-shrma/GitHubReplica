const mongoose = require("mongoose");

const issuesSchema = new mongoose.Schema({
    // Timestamps: true,
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    },
    repository: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repository",
        required: true,
    }
})

const Issue = new mongoose.model("Issue", issuesSchema);

module.exports =  Issue;