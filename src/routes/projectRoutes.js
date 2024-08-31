const express = require("express");
const auth = require("../middleware/auth.middleware");
const { Project } = require("../model/models");
const upload = require("../middleware/upload.middleware");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Get All Project
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ start_date: -1 });
    res.status(201).json(projects);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get Project By Id
router.get("/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Post Project
router.post("/create", auth, upload.single("img"), async (req, res) => {
  try {
    const projectData = req.body;
    if (req.file) {
      projectData.img = "/uploads/" + req.file.filename;
    }
    const newProject = new Project(projectData);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update Project
router.patch("/update/:id", auth, upload.single("img"), async (req, res) => {
  try {
    const projectId = req.params.id;
    const projectData = req.body;
    if (req.file) {
      projectData.img = "/uploads/" + req.file.filename;
    }
    const updatedProject = await Project.findByIdAndUpdate(projectId, projectData, { new: true });

    if (!updatedProject) {
      res.status(404).send("Data not found!");
    }

    res.status(201).json(updatedProject);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete Project
router.delete("/destroy/:id", auth, async (req, res) => {
  try {
    const projectId = req.params.id;
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      res.status(404).send("Data not found!");
    }

    if (deletedProject.img) {
      await fs.promises.unlink(path.join("public", deletedProject.img), (err) => {
        res.status(500).send(err.message);
      });
    }

    res.status(200).send("Data deleted!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
