import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";
import { useNavigate } from "react-router";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      {/* Soft gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-50 via-white to-white" />

      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex flex-col items-center gap-8">
          {/* Badge */}
          <span className="px-5 py-2 text-sm font-medium rounded-full bg-[#6A38C2]/10 text-[#6A38C2]">
            🚀 Find your next opportunity
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            Search, Apply & <br />
            Get Your{" "}
            <span className="text-[#6A38C2]">Dream Job</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-gray-500 text-base sm:text-lg">
            Discover thousands of jobs from top companies.  
            Connect with recruiters and land your perfect role faster.
          </p>

          {/* Search Bar */}
          <div
            className="
              flex items-center w-full max-w-2xl
              bg-white border border-gray-200
              rounded-full shadow-lg
              focus-within:ring-2 focus-within:ring-[#6A38C2]/40
              transition
              p-2
            "
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, skills, companies..."
              className="
                flex-1 px-4 py-3 bg-transparent
                outline-none text-sm sm:text-base
              "
            />

            <Button
              onClick={searchJobHandler}
              className="
                rounded-full px-6 py-5
                bg-[#6A38C2] hover:bg-[#5b30a6]
                shadow-md
              "
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {/* Optional small stats (adds professionalism) */}
          <div className="flex gap-8 text-sm text-gray-400 pt-4">
            <span>10k+ Jobs</span>
            <span>5k+ Companies</span>
            <span>15k+ Candidates</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
