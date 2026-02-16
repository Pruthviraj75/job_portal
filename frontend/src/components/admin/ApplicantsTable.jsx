import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { APPLICATION_API_ENDPOINT } from "../utils/constant";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText } from "lucide-react";

const ITEMS_PER_PAGE = 5;
const shortListingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("new");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState({});

  /* ---------------- FILTER + SORT ---------------- */
  const filteredApplicants = useMemo(() => {
    let data = applicants || [];

    /* search */
    if (search) {
      data = data.filter((item) =>
        item?.applicant?.fullname
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    /* status filter */
    if (statusFilter !== "All") {
      data = data.filter(
        (item) =>
          (updatedStatus[item._id] || item.status) === statusFilter
      );
    }

    /* sort */
    data = [...data].sort((a, b) =>
      sortOrder === "new"
        ? new Date(b.applicant.createdAt) -
          new Date(a.applicant.createdAt)
        : new Date(a.applicant.createdAt) -
          new Date(b.applicant.createdAt)
    );

    return data;
  }, [applicants, search, statusFilter, sortOrder, updatedStatus]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredApplicants.length / ITEMS_PER_PAGE);

  const paginatedApplicants = filteredApplicants.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ---------------- STATUS UPDATE ---------------- */
  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        setUpdatedStatus((prev) => ({
          ...prev,
          [id]: status,
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  /* ---------------- BADGE STYLE ---------------- */
  const getBadgeColor = (status) => {
    if (status === "Accepted")
      return "bg-green-100 text-green-600";
    if (status === "Rejected")
      return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-500";
  };

  /* ---------------- EMPTY ---------------- */
  if (!applicants?.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No applicants found
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= CONTROLS ================= */}
      <div className="flex flex-wrap gap-3 justify-end">

        {/* search */}
        <input
          type="text"
          placeholder="Search applicant..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-xl px-3 py-2 text-sm w-60"
        />

        {/* status filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded-xl px-3 py-2 text-sm"
        >
          <option>All</option>
          <option>Accepted</option>
          <option>Rejected</option>
          <option>Pending</option>
        </select>

        {/* sort */}
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
          className="border rounded-xl px-3 py-2 text-sm"
        >
          <option value="new">Newest First</option>
          <option value="old">Oldest First</option>
        </select>
      </div>

      {/* ================= CARDS ================= */}
      <AnimatePresence>
        {paginatedApplicants.map((item, index) => {
          const applicant = item?.applicant;
          const currentStatus =
            updatedStatus[item._id] || item.status;

          const disabled =
            currentStatus === "Accepted" ||
            currentStatus === "Rejected";

          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-all p-5 flex items-center justify-between gap-4"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">

                {/* photo */}
                <div
                  onClick={() => setSelectedApplicant(applicant)}
                  className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 cursor-pointer transition duration-300 hover:scale-110"
                >
                  {applicant?.profile?.profilePhoto ? (
                    <img
                      src={applicant.profile.profilePhoto}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-semibold text-gray-500">
                      {applicant?.fullname?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* details */}
                <div>
                  <h3 className="font-semibold">{applicant?.fullname}</h3>
                  <p className="text-sm text-gray-500">{applicant?.email}</p>
                  <p className="text-xs text-gray-400">{applicant?.phoneNumber}</p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3 flex-wrap">

                {currentStatus && (
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${getBadgeColor(
                      currentStatus
                    )}`}
                  >
                    {currentStatus}
                  </span>
                )}

                {applicant?.profile?.resume && (
                  <a
                    href={applicant.profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline" className="rounded-xl">
                      <FileText size={14} className="mr-1" />
                      Resume
                    </Button>
                  </a>
                )}

                {shortListingStatus.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    disabled={disabled}
                    onClick={() =>
                      statusHandler(status, item._id)
                    }
                    className={`rounded-xl ${
                      status === "Accepted"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </Button>

          <span className="px-3 py-2 text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* ================= PROFILE MODAL ================= */}
      <AnimatePresence>
        {selectedApplicant && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedApplicant(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="bg-white rounded-2xl w-[360px] p-6 relative shadow-xl"
            >
              <X
                className="absolute right-4 top-4 cursor-pointer"
                onClick={() => setSelectedApplicant(null)}
              />

              <div className="flex justify-center mb-4">
                <img
                  src={selectedApplicant?.profile?.profilePhoto}
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>

              <div className="text-center space-y-2">
                <h2 className="font-semibold text-lg">
                  {selectedApplicant?.fullname}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedApplicant?.email}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedApplicant?.phoneNumber}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicantsTable;
