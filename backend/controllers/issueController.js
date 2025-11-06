const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

//ISSUE CREATED
const crateIssue = async (req, res) => {
   const { title, description } = req.body;
   const { id } = req.params; //this will be repository id

   try {
    const issue = new Issue({
        title,
        description, 
        repository: id,
    });

    await issue.save();

    res.status(201).json(issue);

   } catch (error) {
    console.error("Errro during creating issue :", error.message);
    res.status(500).send("Server error");
   }

}

//UPDATE ISSUE BY ID
const updateIssueById = async (req, res) => {
   const { id } = req.params;
   const { title, description, status} = req.body;

   try {
    const issue = await Issue.findById({id});

    if(!issue){
        return res.status(404).json({ error: "issue not found" })
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();

    res.json({ meassge: "issue updated", issue});
   } catch (error) {
    console.error("Errro during creating issue :", error.message);
    res.status(500).send("Server error");
   }
}

//DELETE ISSUE BY ID
const deleteIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        const issue = await Issue.findByIdAndDelete({id});

        if(!issue){
        return res.status(404).json({ error: "issue not found" })
    }

        res.json({message: "issue deleted"});
    } catch (error) {
         console.error("Errro during deletion :", error.message);
    res.status(500).send("Server error");
    }
}

//ALL ISSUES
const getAllIssues = async (req, res) => {
    const { id } = req.params; //repository ID

    try {
        const issues = await Issue.find({ repository: id});

        if(!issues){
        return res.status(404).json({ error: "issues not found" })
        }

        res.status(200).json(issues);
    } catch (error) {
         console.error("Errro during fetching issues :", error.message);
    res.status(500).send("Server error");
    }
}

//INDIVIDUAL ISSUE
const getIssueById = async (req, res) => {
    const { id } = req.params; //issue id

    try {
        const issue = await Issue.findById({id});

        if(!issue){
        return res.status(404).json({ error: "issue not found" })
        }

        res.json({ message: "issue found", issue});
    } catch (error) {
         console.error("Errro during fetching issue :", error.message);
    res.status(500).send("Server error");
    }
}

module.exports = {
    crateIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
}

