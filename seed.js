const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const { User, Skill, Project, WorkExperience, OrgExperience } = require("./src/model/models");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database!");
    seedDatabase();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const userData = JSON.parse(fs.readFileSync("./src/data/users.json", "utf8"));
const skillData = JSON.parse(fs.readFileSync("./src/data/skills.json", "utf8"));
const projectData = JSON.parse(fs.readFileSync("./src/data/projects.json", "utf8"));
const workData = JSON.parse(fs.readFileSync("./src/data/works.json", "utf8"));
const organizationData = JSON.parse(fs.readFileSync("./src/data/organizations.json", "utf8"));

const seedDatabase = async () => {
  try {
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await WorkExperience.deleteMany({});
    await OrgExperience.deleteMany({});

    for (const user of userData) {
      const newUser = new User(user);
      await newUser.save();
    }
    // await Skill.insertMany(skillData);
    // await Project.insertMany(projectData);
    // await WorkExperience.insertMany(workData);
    // await OrgExperience.insertMany(organizationData);

    console.log("Database seeded successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
};
