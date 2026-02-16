import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Edit2, MoreHorizontal, Building2, Trash2, Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { COMPANY_API_ENDPOINT } from "../utils/constant";
import { motion, AnimatePresence } from "framer-motion";
import CompanyDetails from "./CompanyDetails";

const ITEMS_PER_PAGE = 5;

const CompaniesTable = ({ companies = [] }) => {
  const navigate = useNavigate();
  const { searchCompanyByText } = useSelector((store) => store.company);

  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const containerRef = useRef(null);

  /* ---------------- FILTER ---------------- */
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name
        ?.toLowerCase()
        .includes(searchCompanyByText.toLowerCase());
    });
  }, [companies, searchCompanyByText]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);

  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [searchCompanyByText]);

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

  /* ---------------- DELETE ---------------- */
  const deleteCompanyHandler = async (id) => {
    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
      const res = await axios.delete(`${COMPANY_API_ENDPOINT}/delete/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Company deleted successfully");
      }
    } catch {
      toast.error("Failed to delete company");
    }
  };

  /* ---------------- EMPTY ---------------- */
  if (!filteredCompanies.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Building2 className="w-14 h-14 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">No companies found</p>
        <Button
          onClick={() => navigate("/admin/companies/create")}
          className="bg-[#7209b7] hover:bg-[#5f32ad] rounded-xl"
        >
          + Add Company
        </Button>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div ref={containerRef} className="space-y-5">
      {paginatedCompanies.map((company, index) => (
        <motion.div
         onClick={()=>navigate(`/admin/companies/${company._id}/details`)}
          key={company._id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          onMouseEnter={() => setActiveId(company._id)}
          onMouseLeave={() => setActiveId(null)}
          className="relative bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex items-center justify-between gap-4 group"
        >
          {/* LEFT */}
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-14 w-14 rounded-xl">
              <AvatarImage src={company.logo} />
            </Avatar>

            <div className="min-w-0">
              <h3 className="font-semibold text-base truncate">
                {company.name}
              </h3>

              <p className="text-sm text-gray-500 truncate max-w-[420px]">
                {company.description || "No description added"}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <Calendar size={12} />
                {company?.createdAt?.split("T")[0]}
              </div>
            </div>
          </div>

          {/* RIGHT ACTION BAR (hover reveal) */}
          <AnimatePresence>
            {activeId === company._id && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 bg-gray-50 border rounded-xl px-2 py-1 shadow-sm"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  title="Edit"
                  onClick={(e) =>{
                    e.stopPropagation();
                    navigate(`/admin/companies/${company._id}`)}}
                  className="hover:bg-gray-200 rounded-lg text-[#6A38C2]"
                >
                  <Edit2 size={16} />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  title="Delete"
                  onClick={(e) =>{ 
                    e.stopPropagation();
                    deleteCompanyHandler(company._id)}}
                  className="hover:bg-red-100 text-[#6A38C2] rounded-lg"
                >
                  <Trash2 size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* ---------------- PAGINATION ---------------- */}
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

export default CompaniesTable;