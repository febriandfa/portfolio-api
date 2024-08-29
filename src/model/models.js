const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;
const model = mongoose.model;

// User Schema
const userSchema = new Schema({
  username: String,
  password: String,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = model("User", userSchema);

// Project Schema
const projectSchema = new Schema({
  name: String,
  img: {
    type: String,
    default: null,
  },
  start_date: Date,
  end_date: {
    type: Date,
    default: "Present",
  },
  desc: String,
  tech: {
    type: String,
    default: null,
  },
  github: {
    type: String,
    default: null,
  },
  website: {
    type: String,
    default: null,
  },
});
const Project = model("Project", projectSchema);

// Skill Schema
const skillSchema = new Schema({
  name: String,
  icon: {
    type: String,
    default: null,
  },
  level: {
    type: String,
    default: null,
  },
});
const Skill = model("Skill", skillSchema);

// Work Experience Schema
const workExperienceSchema = new Schema({
  position: String,
  start_date: Date,
  end_date: {
    type: Date,
    default: "Present",
  },
  company: String,
  status: {
    type: String,
    enum: ["intern", "full-time", "contract", "part-time"],
    default: null,
  },
  img: {
    type: String,
    default: null,
  },
});
const WorkExperience = model("WorkExperience", workExperienceSchema);

// Organization Experience Schema
const orgExperienceSchema = new Schema({
  position: String,
  start_date: Date,
  end_date: {
    type: Date,
    default: "Present",
  },
  organization: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: null,
  },
  img: {
    type: String,
    default: null,
  },
});
const OrgExperience = model("orgExperience", orgExperienceSchema);

module.exports = {
  User,
  Project,
  Skill,
  WorkExperience,
  OrgExperience,
};
