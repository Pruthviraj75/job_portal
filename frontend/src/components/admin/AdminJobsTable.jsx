import React, { useEffect, useMemo, useRef, useState } from "react";
import { Edit2, Eye, Calendar, Briefcase, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { setSingleJob } from "../../redux/jobSlice";
import { Job_API_ENDPOINT } from "../utils/constant";

const ITEMS_PER_PAGE = 5;

const AdminJobsTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);

  const [jobs, setJobs] = useState(allAdminJobs); // ⚡ local state
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [sortOrder, setSortOrder] = useState("new");

  // Sync local state when redux updates
  useEffect(() => {
    setJobs(allAdminJobs);
  }, [allAdminJobs]);

  /* ---------------- FILTER + SORT ---------------- */
  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      if (!searchJobByText) return true;

      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });

    return filtered.sort((a, b) =>
      sortOrder === "new"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [jobs, searchJobByText, sortOrder]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [searchJobByText, sortOrder]);

  /* ---------------- OUTSIDE CLICK CLOSE ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- DELETE JOB ---------------- */
  const handleDelete = async (id) => {
    try {
      // Optimistically remove job from UI
      setJobs((prev) => prev.filter((job) => job._id !== id));
      setActiveId(null);

      const res = await axios.delete(`${Job_API_ENDPOINT}/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Job deleted successfully");
      } else {
        toast.error("Delete failed");
        // rollback if failed
        setJobs(allAdminJobs);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
      setJobs(allAdminJobs); // rollback
    }
  };

  if (!filteredJobs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Briefcase className="w-14 h-14 text-gray-300 mb-4" />
        <p className="text-gray-500">No jobs found</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-5">
      {/* SORT */}
      <div className="flex justify-end">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded-xl px-3 py-1 text-sm"
        >
          <option value="new">Newest First</option>
          <option value="old">Oldest First</option>
        </select>
      </div>

      {/* CARDS */}
      {paginatedJobs.map((job, index) => (
        <motion.div
          key={job._id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ delay: index * 0.04 }}
          onMouseEnter={() => setActiveId(job._id)}
          onMouseLeave={() => setActiveId(null)}
          className="relative bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex items-center justify-between gap-4"
        >
          {/* LEFT */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gray-100">
              <Briefcase size={22} />
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold truncate">{job.title}</h3>
              <p className="text-sm text-gray-500 truncate">{job.company?.name}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <Calendar size={12} />
                {job?.createdAt?.split("T")[0]}
              </div>
            </div>
          </div>

          {/* ACTION BAR */}
          <AnimatePresence>
            {activeId === job._id && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 bg-gray-50 border rounded-xl px-2 py-1 shadow-sm"
              >
                {/* Edit */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    dispatch(setSingleJob(job));
                    navigate(`/admin/jobs/edit/${job._id}`);
                  }}
                  className="hover:bg-gray-200 rounded-lg text-[#6A38C2]"
                >
                  <Edit2 size={16} />
                </Button>

                {/* Applicants */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                  className="hover:bg-gray-200 rounded-lg text-[#6A38C2]"
                >
                  <Eye size={16} />
                </Button>

                {/* Delete */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(job._id)}
                  className="hover:bg-red-100 text-red-500 rounded-lg"
                >
                  <Trash2 size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* PAGINATION */}
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
  );
};

export default AdminJobsTable;
