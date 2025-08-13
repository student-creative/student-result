const mongoose = require("mongoose");

const StudentResultSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  rollNumber: {
    type: Number,
    required: true
  },
  math: {
    type: Number,
    required: true
  },
  science: {
    type: Number,
    required: true
  },
  english: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: false  // Not required from client
  },
  percentage: {
    type: Number,
    required: false  // Not required from client
  },
  resultStatus: {
    type: String,
    enum: ["Pass", "Fail"],
    required: false  // Will be auto-calculated
  },
  date: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

// 🔄 Pre-save middleware to calculate results
StudentResultSchema.pre("save", function (next) {
  this.totalMarks = this.math + this.science + this.english;
  this.percentage = this.totalMarks / 3;

  const isPassed = this.math >= 35 && this.science >= 35 && this.english >= 35;
  this.resultStatus = isPassed ? "Pass" : "Fail";

  next();
});

module.exports = mongoose.model("marksheets", StudentResultSchema);