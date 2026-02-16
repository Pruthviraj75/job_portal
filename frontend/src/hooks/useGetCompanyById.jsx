import axios from "axios";
import React, { useEffect } from "react";
import { COMPANY_API_ENDPOINT } from "../components/utils/constant";
import { useParams } from "react-router";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "../redux/companySlice";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_ENDPOINT}/get/${companyId}`,
          { withCredentials: true },
        );
        if (res.data.success) {
          dispatch(
            setSingleCompany({
              ...res.data.company,
              jobsCount: res.data.jobsCount,
              applicantsCount: res.data.applicantsCount,
            }),
          );
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleCompany();
  }, [companyId, dispatch]);
};

export default useGetCompanyById;
