import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    //This stores which job the user applied for
    job:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    //This stores which user applied for the job
    applicant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    //status of the application
    status:{
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true })
export const Application = mongoose.model('Application', applicationSchema);