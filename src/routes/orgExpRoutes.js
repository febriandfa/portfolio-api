const express = require("express");
const auth = require("../middleware/auth.middleware");
const { OrgExperience } = require("../model/models");
const upload = require("../middleware/upload.middleware");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Get All OrgExperience
router.get("/", async (req, res) => {
  try {
    const orgs = await OrgExperience.find().populate("organization").sort({ start_date: -1 });
    res.status(201).json(orgs);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get OrgExperience By Id
router.get("/:id", async (req, res) => {
  try {
    const orgId = req.params.id;
    const org = await OrgExperience.findById(orgId);
    res.status(201).json(org);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Post OrgExperience
router.post("/create", auth, upload.single("img"), async (req, res) => {
  try {
    const orgData = req.body;
    if (req.file) {
      orgData.img = "/uploads/" + req.file.filename;
    }
    const newOrgExperience = new OrgExperience(orgData);
    const savedOrgExperience = await newOrgExperience.save();
    res.status(201).json(savedOrgExperience);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update OrgExperience
router.patch("/update/:id", auth, upload.single("img"), async (req, res) => {
  try {
    const orgId = req.params.id;
    const orgData = req.body;
    if (req.file) {
      orgData.img = "/uploads/" + req.file.filename;
    }
    const updatedOrgExperience = await OrgExperience.findByIdAndUpdate(orgId, orgData, { new: true });

    if (!updatedOrgExperience) {
      res.status(404).send("Data not found!");
    }

    res.status(201).json(updatedOrgExperience);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete OrgExperience
router.delete("/destroy/:id", auth, async (req, res) => {
  try {
    const orgId = req.params.id;
    const deletedOrgExperience = await OrgExperience.findByIdAndDelete(orgId);

    if (!deletedOrgExperience) {
      res.status(404).send("Data not found!");
    }

    if (deletedOrgExperience.img) {
      await fs.promises.unlink(path.join("public", deletedOrgExperience.img), (err) => {
        res.status(500).send(err.message);
      });
    }

    res.status(200).send("Data deleted!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
