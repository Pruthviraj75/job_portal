// import { Application } from "../models/application.model.js";
// import { Job } from "../models/job.model.js";
// import {User} from "../models/user.model.js";
// import { sendMailApplication } from "../utils/sendMail.js";


// export const applyJob = async (req, res) => {
//    try {
//     const userId = req.id;
//     const jobId = req.params.id;
//     if(!jobId) {
//         return res.status(400).json({
//             message: "Job ID is required.",
//             success: false,
//         })
//     }
//     // Check the user has already apply for the job
//     const existingApplication = await Application.findOne({
//         job: jobId, 
//         applicant: userId
//     });

//     if(existingApplication) {
//         return res.status(400).json({
//             message: "You have already applied for this job.",
//             success: false,
//         });
//     }
    
//     //check job exists
//     const job = await Job.findById(jobId).populate('company');
//     if(!job) {
//         return res.status(404).json({
//             message: "Job not found.",
//             success: false,
//         });
//     }

//     //get user details for sending mail
//     const user = await User.findById(userId);
//     if(!user) {
//         return res.status(404).json({
//             message: "User not found.",
//             success: false,
//         });
//     }

//     //create a new application
//     const newApplication = await Application.create({
//         job: jobId,
//         applicant: userId,
//     });

//     job.applications.push(newApplication._id);
//     await job.save();

//     await sendMailApplication({
//         to: user.email,
//         userName: user.fullname || user.name,
//         jobTitle: job.title,
//         companyName: job.company.name,
//     });

//     return res.status(201).json({
//         message: "Application submitted successfully. A confirmation email has been sent.",
//         success: true,
//     })

//    } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//         message: "Something went wrong.",
//         success: false,
//     });
//    }
// }

// export const  getAppliedJobs = async (req, res) => {
//     try {
//         const userId = req.id;
//         const application = await Application.find({applicant: userId}).sort({createdAt: -1}).populate({
//             path: 'job',
//             options: { sort: {createdAt: -1}},
//             populate: {
//                 path: 'company',
//                 options: { createdAt: -1}
//             }
//         });
//         if(!application) {
//             return res.status(404).json({
//                 message: "No applied jobs found.",
//                 success: false
//             });
//         };
//         return res.status(200).json({
//             application,
//             success: true
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

// //admin will see how many applicants for this job
// export const getApplicants = async (req, res) => {
//     try {
//         const jobId = req.params.id;
//         const job = await Job.findById(jobId).populate({
//             path: 'applications',
//             options: { sort: { createdAt: -1}},
//             populate: {
//                 path: 'applicant',
//                 options: { sort: { createdAt: -1}}
//             }
//         })
//         if(!job) {
//             return res.status(404).json({
//                 message: "Job not found.",
//                 success: false
//             })
//         }
//         return res.status(200).json({
//             job,
//             success: true
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

// export const updateStatus = async (req, res) => {
//     try {
//         const {status} = req.body;
//         const applicationId = req.params.id;
//         if(!status) {
//             return res.status(400).json({
//                 message: "Status is required.",
//                 success: false
//             })
//         };

//         //find the application by applicantion id
//         const application = await Application.findOne({_id: applicationId})
//         if(!application) {
//             return res.status(404).json({
//                 message: "Application not found.",
//                 success: false
//             });
//         };

//         //update the status
//         application.status = status.toLowerCase();
//         await application.save();
//         return res.status(200).json({
//             message: "Status updated successfully.",
//             success: true
//         })

//     } catch (error) {
//         console.log(error);
//     }
// }

import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { sendMailApplication } from "../utils/sendMail.js";

// ✅ APPLY JOB
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required.",
        success: false,
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    await sendMailApplication({
      to: user.email,
      userName: user.fullname || user.name,
      jobTitle: job.title,
      companyName: job.company.name,
    });

    return res.status(201).json({
      message:
        "Application submitted successfully. A confirmation email has been sent.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong.",
      success: false,
    });
  }
};

// ✅ GET APPLIED JOBS (FIXED)
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    const validApplications = applications.filter(
      (app) => app.job !== null
    );

    return res.status(200).json({
      application: validApplications,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// ✅ GET APPLICANTS (🔥 MISSING FUNCTION)
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// ✅ UPDATE STATUS (🔥 ALSO REQUIRED)
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required.",
        success: false,
      });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};