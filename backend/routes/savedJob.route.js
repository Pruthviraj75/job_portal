import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getSavedJobs, saveJob, unsaveJob } from '../controllers/savedJob.Controller.js';

const router = express.Router();

router.route('/save').post( isAuthenticated, saveJob)
router.route('/unsave/:jobId').delete( isAuthenticated, unsaveJob)
router.route('/get').get( isAuthenticated, getSavedJobs)

export default router;