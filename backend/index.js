// import express from 'express';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './utils/db.js';
// import userRoutes from './routes/user.route.js';
// import companyRoutes from './routes/company.route.js';
// import jobRoute from './routes/job.route.js';
// import applicationsRoute from './routes/application.route.js';
// import savedJobRoutes from './routes/savedJob.route.js';
// import path from 'path'

// dotenv.config({});


// //connect db
// connectDB();

// // const PORT = process.env.PORT || 8080;
// const PORT = process.env.PORT || 3000;
// const app = express();

// const _dirname = path.resolve()


// //middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const corsOptions = {
//     // origin: 'https://job-portal-fjmy.onrender.com',
//     origin: 'http://localhost:5173',
//     credentials: true
// }
// app.use(cors(corsOptions));

// //api's route
// app.use('/api/v1/user', userRoutes);
// app.use('/api/v1/company', companyRoutes);
// app.use('/api/v1/job', jobRoute);
// app.use('/api/v1/application', applicationsRoute);
// app.use('/api/v1/savedjobs', savedJobRoutes);
          
// // Serve frontend build
// app.use(express.static(path.join(_dirname, "/frontend/dist")));
// app.get(/.*/, (_,res) => {
//     res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
// })

// app.listen(PORT, () => {
//     console.log(`Server listening at port ${PORT}`);
// });


import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoutes from './routes/user.route.js';
import companyRoutes from './routes/company.route.js';
import jobRoute from './routes/job.route.js';
import applicationsRoute from './routes/application.route.js';
import savedJobRoutes from './routes/savedJob.route.js';
import path from 'path';

//  NEW IMPORTS (for cleanup)
import { Application } from './models/application.model.js';
import { Job } from './models/job.model.js';

dotenv.config({});

//connect db
connectDB();

const PORT = process.env.PORT || 3000;
// const PORT = process.env.PORT || 8080;
const app = express();

const _dirname = path.resolve();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173',
  // origin: 'https://job-portal-fjmy.onrender.com',
  credentials: true
};
app.use(cors(corsOptions));

//api routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/job', jobRoute);
app.use('/api/v1/application', applicationsRoute);
app.use('/api/v1/savedjobs', savedJobRoutes);

// Serve frontend build
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get(/.*/, (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});


// CLEANUP FUNCTION (VERY IMPORTANT)
const cleanOrphanApplications = async () => {
  try {
    const jobs = await Job.find().select("_id");
    const jobIds = jobs.map(j => j._id);

    const result = await Application.deleteMany({
      job: { $nin: jobIds }
    });

    console.log(` Cleaned ${result.deletedCount} orphan applications`);
  } catch (error) {
    console.log(error);
  }
};


// RUN SERVER + CLEANUP
app.listen(PORT, async () => {
  console.log(`Server listening at port ${PORT}`);

  // 🔥 run once when server starts
  await cleanOrphanApplications();
});