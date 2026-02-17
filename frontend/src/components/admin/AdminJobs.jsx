import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";
import { clearSingleJob, setSearchJobByText } from "../../redux/jobSlice";

const AdminJobs = () => {
  useGetAllAdminJobs();

  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* main content */}
      <div className="max-w-6xl mx-auto px-4 pt-0 pb-10">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Jobs</h1>
          <p className="text-gray-500 text-sm mt-1">
            Create, search and manage all posted jobs
          </p>
        </div>

        {/* Controls Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search by job title, company or role..."
              className="w-full sm:w-80"
            />

            <Button
              onClick={() =>{ 
                dispatch(clearSingleJob());
                navigate("/admin/jobs/create")}}
              className="px-6"
            >
              + New Job
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <AdminJobsTable />
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
