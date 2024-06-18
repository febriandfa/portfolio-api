const express = require("express");
const auth = require("../middleware/auth.middleware");
const { WorkExperience } = require("../model/models");
const upload = require("../middleware/upload.middleware");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Get All WorkExperience
router.get("/", async (req, res) => {
  try {
    const works = await WorkExperience.find();
    res.status(201).json(works);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get WorkExperience By Id
router.get("/:id", async (req, res) => {
  try {
    const workId = req.params.id;
    const work = await WorkExperience.findById(workId);
    res.status(201).json(work);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Post WorkExperience
router.post("/create", auth, upload.single("img"), async (req, res) => {
  try {
    const workData = req.body;
    if (req.file) {
      workData.img = "/uploads/" + req.file.filename;
    }
    const newWorkExperience = new WorkExperience(workData);
    const savedWorkExperience = await newWorkExperience.save();
    res.status(201).json(savedWorkExperience);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update WorkExperience
router.patch("/update/:id", auth, upload.single("img"), async (req, res) => {
  try {
    const workId = req.params.id;
    const workData = req.body;
    if (req.file) {
      workData.img = "/uploads/" + req.file.filename;
    }
    const updatedWorkExperience = await WorkExperience.findByIdAndUpdate(workId, workData, { new: true });

    if (!updatedWorkExperience) {
      res.status(404).send("Data not found!");
    }

    res.status(201).json(updatedWorkExperience);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete WorkExperience
router.delete("/destroy/:id", auth, async (req, res) => {
  try {
    const workId = req.params.id;
    const deletedWorkExperience = await WorkExperience.findByIdAndDelete(workId);

    if (!deletedWorkExperience) {
      res.status(404).send("Data not found!");
    }

    if (deletedWorkExperience.img) {
      await fs.promises.unlink(path.join("public", deletedWorkExperience.img), (err) => {
        res.status(500).send(err.message);
      });
    }

    res.status(200).send("Data deleted!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
