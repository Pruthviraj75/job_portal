import { SavedJob } from "../models/savedJob.model.js";

// Post saved jobs

export const saveJob = async (req, res) => {
    const { jobId } =  req.body;
    const userId = req.id;
    try {
        // prevent duplicate saved jobs
        const exist = await SavedJob.findOne({user: userId, job: jobId});
        if(exist) {
            return res.status(200).json({
                message: "Job already saved.",
                success: false
            })
        }

        const savedJob = await SavedJob.create({
            user: userId,
            job: jobId
        });
        return res.status(201).json({
            message: "Job saved successfully.",
            savedJob,
            success: true
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Server error.",
            success: false
        })
    }
}

export const unsaveJob = async (req, res) => {
    const userId = req.id;
    const { jobId } = req.params;

    await SavedJob.findOneAndDelete({user: userId, job: jobId});
    return res.status(200).json({
        message: "Job unsaved successfully.",
        success: true
    })
}

export const getSavedJobs = async (req, res) => {
    const userId = req.id;
    const jobs = await SavedJob.find({user:userId}).populate({path:'job', populate:{path:'company'}}).sort({ createdAt: -1 });
    return res.status(200).json({
        jobs,
        success: true
    })
}