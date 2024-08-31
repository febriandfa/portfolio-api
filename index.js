const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./src/database/db");
const authRoutes = require("./src/routes/authRoutes");
const skillRoutes = require("./src/routes/skillRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const workExpRoutes = require("./src/routes/workExpRoutes");
const orgExpRoutes = require("./src/routes/orgExpRoutes");
const companyRoutes = require("./src/routes/companyRoutes");

const app = express();
const port = process.env.PORT;

const { User, Skill, Project, WorkExperience, OrgExperience } = require("./src/model/models");

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Auth Route
app.use("/api/auth", authRoutes);

// Skill Route
app.use("/api/skill", skillRoutes);

// Project Route
app.use("/api/project", projectRoutes);

// Work Experience Route
app.use("/api/work-experience", workExpRoutes);

// Organization Experience Route
app.use("/api/organization-experience", orgExpRoutes);

// Company Route
app.use("/api/company", companyRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
