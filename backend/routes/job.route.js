import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { deleteJob, getAdminJobs, getAllJobs, getJobById, postJob, updateJob } from '../controllers/job.controller.js';

const router = express.Router();

router.route('/post').post( isAuthenticated, postJob)
router.route('/get').get( getAllJobs)
router.route('/getadminjobs').get( isAuthenticated, getAdminJobs)
router.route('/get/:id').get( isAuthenticated, getJobById)      
router.route('/:id').delete( isAuthenticated, deleteJob)
router.route('/update/:id').put( isAuthenticated, updateJob) // postJob function will handle both create and update based on presence of id

export default router;