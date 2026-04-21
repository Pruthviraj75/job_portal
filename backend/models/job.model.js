// import mongoose from "mongoose";
// const jobSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   requirements: [{
//       type: String
//   }],
//   salary: {
//     type: Number,
//     required: true
//   },
//   experienceLevel:{
//     type: Number,
//     required: true
//   },
//   location: {
//     type: String,
//     required: true
//   },
//   jobType: {
//     type: String,
//     required: true
//   },
//   position: {
//     type: Number,
//     required: true
//   },
//   company: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Company",
//     required: true
//   },
//   created_by: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   applications: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Application",
//     }
//   ],
// }, { timestamps: true });
// export const Job = mongoose.model('Job', jobSchema);


import mongoose from "mongoose";
import { Application } from "./application.model.js";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    salary: { type: Number, required: true },
    experienceLevel: { type: Number, required: true },
    location: { type: String, required: true },
    jobType: { type: String, required: true },
    position: { type: Number, required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

// 🔥 AUTO DELETE APPLICATIONS WHEN JOB IS DELETED
jobSchema.pre("findOneAndDelete", async function (next) {
  const jobId = this.getQuery()._id;
  await Application.deleteMany({ job: jobId });
  next();
});

export const Job = mongoose.model("Job", jobSchema);