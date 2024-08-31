const express = require("express");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { Company } = require("../model/models");

const router = express.Router();

// Get All Company
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(201).json(companies);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get Company By Id
router.get("/:id", async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    res.status(201).json(company);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Post Company
router.post("/create", auth, upload.single("logo"), async (req, res) => {
  try {
    const companyData = req.body;
    if (req.file) {
      companyData.logo = "/uploads/" + req.file.filename;
    }
    const newSkill = new Company(companyData);
    const savedSkill = await newSkill.save();
    res.status(201).json(savedSkill);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update Company
router.patch("/update/:id", auth, upload.single("logo"), async (req, res) => {
  try {
    const companyId = req.params.id;
    const companyData = req.body;
    if (req.file) {
      companyData.logo = "/uploads/" + req.file.filename;
    }
    const updatedCompany = await Company.findByIdAndUpdate(companyId, companyData, { new: true });

    if (!updatedCompany) {
      res.status(404).send("Data not found!");
    }

    res.status(201).json(updatedCompany);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete Company
router.delete("/destroy/:id", auth, async (req, res) => {
  try {
    const companyId = req.params.id;
    const deletedCompany = await Company.findByIdAndDelete(companyId);

    if (!deletedCompany) {
      res.status(404).send("Data not found!");
    }

    if (deletedCompany.logo) {
      await fs.promises.unlink(path.join("public", deletedCompany.logo), (err) => {
        res.status(500).send(err.message);
      });
    }

    res.status(200).send("Data deleted!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
