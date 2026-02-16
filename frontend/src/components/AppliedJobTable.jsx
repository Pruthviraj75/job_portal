import React, { useMemo, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const AppliedJobTable = () => {
  const { allAppliedJobs = [] } = useSelector((store) => store.job);
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  /* ---------------- DATE ---------------- */
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  /* ---------------- STATUS COLORS ---------------- */
  const getStatusStyle = (status) => {
    switch (status) {
      case "rejected":
        return {
          pill: "bg-red-100 text-red-600",
          border: "border-l-red-500",
        };
      case "pending":
        return {
          pill: "bg-yellow-100 text-yellow-600",
          border: "border-l-yellow-500",
        };
      case "accepted":
        return {
          pill: "bg-green-100 text-green-600",
          border: "border-l-green-500",
        };
      default:
        return {
          pill: "bg-gray-100 text-gray-600",
          border: "border-l-gray-300",
        };
    }
  };

  /* ---------------- FILTER + SORT ---------------- */
  const processedJobs = useMemo(() => {
    let jobs = [...allAppliedJobs];

    if (statusFilter !== "all") {
      jobs = jobs.filter((j) => j.status === statusFilter);
    }

    if (search.trim()) {
      jobs = jobs.filter((j) =>
        j.job?.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    jobs.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    return jobs;
  }, [allAppliedJobs, statusFilter, search, sortOrder]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(processedJobs.length / rowsPerPage);

  const paginatedJobs = processedJobs.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search, sortOrder]);

  /* ===================================================== */

  return (
    <div className="rounded-2xl bg-[#fafafa] border p-5 space-y-5">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">Applied Jobs</h2>

        <div className="flex flex-col sm:flex-row gap-3">

          {/* SEARCH */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-56"
            />
          </div>

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* SORT */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* ================= CARD LIST ================= */}
      <div className="divide-y divide-gray-200 rounded-xl overflow-hidden">

        {paginatedJobs.length === 0 && (
          <p className="text-center text-gray-400 py-10">No jobs found</p>
        )}

        {paginatedJobs.map((job, index) => {
          const company = job.job?.company;
          const logo = company?.logo || company?.logoUrl;

          const styles = getStatusStyle(job.status);

          return (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => navigate(`/description/${job.job?._id}`)}
              className={`
                group
                cursor-pointer
                bg-white
                p-4
                flex items-center justify-between gap-4
                border-l-4 ${styles.border}
                hover:bg-gray-50
                hover:-translate-y-[1px]
                hover:shadow-md
                transition-all
              `}
            >
              {/* LEFT */}
              <div className="flex items-center gap-4 min-w-0">

                {logo ? (
                  <img
                    src={logo}
                    alt="logo"
                    className="w-12 h-12 rounded-xl object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center font-semibold">
                    {company?.name?.charAt(0)}
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="font-semibold truncate">
                    {job.job?.title}
                  </h3>

                  <p className="text-sm text-gray-500 truncate">
                    {company?.name}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <Calendar size={12} />
                    {formatDate(job.createdAt)}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div
                className="
                  flex items-center gap-3
                  opacity-0
                  group-hover:opacity-100
                  transition
                "
                onClick={(e) => e.stopPropagation()}
              >
                {/* smaller pill */}
                <Badge
                  className={`text-xs px-2 py-0.5 rounded-md ${styles.pill}`}
                >
                  {job.status.toUpperCase()}
                </Badge>

                {/* hover reveal action */}
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    navigate(`/description/${job.job?._id}`)
                  }
                >
                  <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ================= PAGINATION ================= */}
      {processedJobs.length > rowsPerPage && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AppliedJobTable;
