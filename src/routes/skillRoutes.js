const express = require("express");
const auth = require("../middleware/auth.middleware");
const { Skill } = require("../model/models");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

// Get All Skill
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(201).json(skills);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get Skill By Id
router.get("/:id", async (req, res) => {
  try {
    const skillId = req.params.id;
    const skill = await Skill.findById(skillId);
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Post Skill
router.post("/create", auth, upload.single("icon"), async (req, res) => {
  try {
    const skillData = req.body;
    if (req.file) {
      skillData.icon = "/uploads/" + req.file.filename;
    }
    const newSkill = new Skill(skillData);
    const savedSkill = await newSkill.save();
    res.status(201).json(savedSkill);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update Skill
router.patch("/update/:id", auth, upload.single("icon"), async (req, res) => {
  try {
    const skillId = req.params.id;
    const skillData = req.body;
    if (req.file) {
      skillData.icon = "/uploads/" + req.file.filename;
    }
    const updatedSkill = await Skill.findByIdAndUpdate(skillId, skillData, { new: true });

    if (!updatedSkill) {
      res.status(404).send("Data not found!");
    }

    res.status(201).json(updatedSkill);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete Skill
router.delete("/destroy/:id", auth, async (req, res) => {
  try {
    const skillId = req.params.id;
    const deletedSkill = await Skill.findByIdAndDelete(skillId);

    if (!deletedSkill) {
      res.status(404).send("Data not found!");
    }

    if (deletedSkill.icon) {
      await fs.promises.unlink(path.join("public", deletedSkill.icon), (err) => {
        res.status(500).send(err.message);
      });
    }

    res.status(200).send("Data deleted!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
