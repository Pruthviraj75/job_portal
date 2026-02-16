import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { APPLICATION_API_ENDPOINT } from "../utils/constant";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "../../redux/applicationSlice";

const Applicants = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_ENDPOINT}/${id}/applicants`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setAllApplicants(res.data.job.applications));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllApplicants();
  }, [id, dispatch]); // important fix

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-20">

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <h1 className="text-xl font-semibold">
            Applicants
            <span className="text-gray-500 ml-2">
              ({applicants?.length || 0})
            </span>
          </h1>
        </div>

        {/* Table/Card List */}
        <ApplicantsTable />
      </div>
    </div>
  );
};

export default Applicants;
