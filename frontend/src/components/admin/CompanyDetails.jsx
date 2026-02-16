import React, { useState, useEffect } from "react";
import useGetCompanyById from "../../hooks/useGetCompanyById";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Trash2, Briefcase, Users } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { COMPANY_API_ENDPOINT, Job_API_ENDPOINT } from "../utils/constant";

const ITEMS_PER_PAGE = 5;

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [activeJobId, setActiveJobId] = useState(null);
  const [sortOrder, setSortOrder] = useState("new");

  useGetCompanyById(id);
  const { singleCompany } = useSelector((store) => store.company);

  if (!singleCompany) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg">
        Loading company details...
      </div>
    );
  }

  // Fetch jobs for this company
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${Job_API_ENDPOINT}/company/${id}`, { withCredentials: true });
        if (res.data.success) {
          setCompanyJobs(res.data.jobs);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch jobs");
      }
    };
    fetchJobs();
  }, [id]);

  // Sort + Pagination
  const sortedJobs = companyJobs
    .sort((a, b) =>
      sortOrder === "new"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = sortedJobs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${COMPANY_API_ENDPOINT}/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Company deleted successfully");
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-600 hover:text-black transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Company Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl mx-auto hover:shadow-xl transition">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center hover:scale-105 transition duration-300">
              <img
                src={singleCompany.logo}
                alt={singleCompany.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">{singleCompany.name}</h1>
              <p className="text-gray-500 mt-1">{singleCompany.location}</p>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-50 rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition">
            <Briefcase className="text-blue-600" size={28} />
            <div>
              <p className="text-gray-400 text-sm">Total Jobs</p>
              <h3 className="text-2xl font-bold text-gray-800">{singleCompany.jobsCount || 0}</h3>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition">
            <Users className="text-green-600" size={28} />
            <div>
              <p className="text-gray-400 text-sm">Total Applicants</p>
              <h3 className="text-2xl font-bold text-gray-800">{singleCompany.applicantsCount || 0}</h3>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-6 mb-10">
          <div>
            <h3 className="text-sm text-gray-400 uppercase tracking-wide">Description</h3>
            <p className="text-gray-700 mt-2 leading-relaxed">{singleCompany.description}</p>
          </div>

          <div>
            <h3 className="text-sm text-gray-400 uppercase tracking-wide">Website</h3>
            <a
              href={singleCompany.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2 block"
            >
              {singleCompany.website}
            </a>
          </div>
        </div>

        {/* Jobs Preview Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Jobs Posted</h2>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-xl px-3 py-1 text-sm"
          >
            <option value="new">Newest First</option>
            <option value="old">Oldest First</option>
          </select>
        </div>

        {/* Jobs Cards */}
        <div className="space-y-4">
          {paginatedJobs.length === 0 && (
            <div className="text-gray-500 text-center py-4">No jobs found.</div>
          )}

          {paginatedJobs.map((job) => (
            <motion.div
              key={job._id}
              onMouseEnter={() => setActiveJobId(job._id)}
              onMouseLeave={() => setActiveJobId(null)}
              className="relative bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex items-center justify-between gap-4"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gray-100">
                  <Briefcase size={22} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-base truncate">{job.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{singleCompany.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span>Posted: {job.createdAt.split("T")[0]}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <AnimatePresence>
                {activeJobId === job._id && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2 bg-gray-50 border rounded-xl px-2 py-1 shadow-sm"
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => navigate(`/admin/jobs/${job._id}`)}
                      className="hover:bg-gray-200 rounded-lg text-[#6A38C2]"
                      title="Edit Job"
                    >
                      Edit
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                      className="hover:bg-gray-200 rounded-lg text-[#6A38C2]"
                      title="View Applicants"
                    >
                      Applicants
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-6">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl"
            >
              Prev
            </Button>

            <span className="px-3 py-2 text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl"
            >
              Next
            </Button>
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this company? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
