import { Job } from "../models/job.model.js";


//jobs posted by admin
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id; // logged in user id
        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            })
        }
        const job  = await Job.create({
            title,
            description,
            requirements: requirements.split(','),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel:experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "Job posted successfully.",
            job,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

//this is for job seekers
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                {title: {$regex: keyword, $options: 'i'}},
                {description: {$regex: keyword, $options: 'i'}}
            ]
        };
        const jobs = await Job.find(query).populate({path:'company'}).sort({ createdAt: -1 });
        if(!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}

//for job seekers
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        })
        if(!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        };
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

//Jobs posted by admin till now

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id; // logged in user id
        const jobs = await Job.find({created_by: adminId}).populate({
            path: 'company',
            createdAt: -1,
        });
        if(!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

