import {Company} from '../models/company.model.js';
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/datauri.js';
import {Job} from "../models/job.model.js";

export const registerCompany = async (req, res) => {
    try {
        const {companyName} = req.body;
        if(!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            })
        }
        let company = await Company.findOne({name:companyName});
        if(company) {
            return res.status(400).json({
                message: "You can not register same company again.",
                success: false
            })
        }
        company = await Company.create({
            name: companyName,
            userId: req.id
        });
        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true

        })
    } catch (error) {
        console.log(error);
        
    }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({userId});  
        if(!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
             companies,
             success: true
        })
    } catch (error) {
        console.log(error);
    }
}


export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    // Find company
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    // Find all jobs of this company
    const jobs = await Job.find({ company: companyId }).populate("applications");
    // Calculate counts
    const jobsCount = jobs.length;

    const applicantsCount = jobs.reduce((total, job) => {
      return total + job.applications.length;
    }, 0);


    // Send enhanced response
    return res.status(200).json({
      success: true,
      company,
      jobsCount,
      applicantsCount,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


export const updatedCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    let logo;

    // correct way for upload.fields()
    const file = req.files?.companyLogo?.[0];

    // upload only if file exists
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }

    const updateData = {
      name,
      description,
      website,
      location,
    };

    // only update logo if uploaded
    if (logo) updateData.logo = logo;

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated successfully.",
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const deleteCompany = async (req, res) => {
  await Company.findByIdAndDelete(req.params.id);

  return res.json({
    success: true,
    message: "Company deleted successfully",
  });
};

