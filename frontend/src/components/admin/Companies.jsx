import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setSearchCompanyByText } from "../../redux/companySlice";
import {
  Building2,
  Briefcase,
  Search,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

const Companies = () => {
  useGetAllCompanies();

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { companies } = useSelector((store) => store.company);

  /* ================= SEARCH ================= */
  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  /* ================= FILTER / SORT LOGIC ================= */
  const sortedCompanies = useMemo(() => {
    if (!companies) return [];

    let temp = [...companies];

    switch (filter) {
      case "recent":
        return temp.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

      case "oldest":
        return temp.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

      case "az":
        return temp.sort((a, b) => a.name.localeCompare(b.name));

      default:
        return temp;
    }
  }, [companies, filter]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-10 space-y-8">
        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your registered companies and hiring details
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow border flex items-center gap-4">
            <Building2 className="text-[#6A38C2]" />
            <div>
              <p className="text-gray-500 text-sm">Total Companies</p>
              <h2 className="text-2xl font-bold">{companies?.length || 0}</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border flex items-center gap-4">
            <Briefcase className="text-[#6A38C2]" />
            <div>
              <p className="text-gray-500 text-sm">Active Recruiters</p>
              <h2 className="text-2xl font-bold">{companies?.length || 0}</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border flex items-center gap-4">
            <Building2 className="text-[#6A38C2]" />
            <div>
              <p className="text-gray-500 text-sm">This Month</p>
              <h2 className="text-2xl font-bold">+{companies?.length || 0}</h2>
            </div>
          </div>
        </div>

        {/* ================= SEARCH + FILTER + BUTTON ================= */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Search + Filter */}
          <div className="flex gap-3 md:w-[520px]">
            {/* Search input */}
            <div className="relative flex-1 group">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 bg-white group-focus-within:text-[#6A38C2]"
              />

              <Input
                className="
                  pl-10 rounded-xl
                  focus-visible:ring-2
                  focus-visible:ring-[#6A38C2]
                  focus-visible:ring-offset-2
                  transition-all duration-200
                "
                placeholder="Search companies..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {/* Filter dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="
                  appearance-none
                  rounded-xl
                  border
                  px-10 py-2
                  text-sm
                  focus:ring-2
                  focus:ring-[#6A38C2]
                  focus:ring-offset-2
                  transition-all duration-200
                  bg-white
                  cursor-pointer
                "
              >
                <option value="all">All</option>
                <option value="recent">Recent</option>
                <option value="oldest">Oldest</option>
                <option value="az">A → Z</option>
              </select>

              <SlidersHorizontal
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* New Company button */}
          <Button
            onClick={() => navigate("/admin/companies/create")}
            className="bg-[#6A38C2] hover:bg-[#5f32ad] rounded-xl flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            New Company
          </Button>
        </div>

        {/* ================= TABLE CARD ================= */}
        <div className="bg-white rounded-2xl shadow border p-6">
          {/* pass sorted companies */}
          <CompaniesTable companies={sortedCompanies} />
        </div>
      </div>
    </div>
  );
};

export default Companies;
