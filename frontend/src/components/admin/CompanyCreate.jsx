// import React, { useState } from "react";
// import Navbar from "../shared/Navbar";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { useNavigate } from "react-router";
// import axios from "axios";
// import { COMPANY_API_ENDPOINT } from "../utils/constant";
// import { toast } from "sonner";
// import { useDispatch } from "react-redux";
// import { setSingleCompany } from "../../redux/companySlice";
// import { Loader2 } from "lucide-react";

// const CompanyCreate = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [companyName, setCompanyName] = useState("");
//   const [loading, setLoading] = useState(false);

//   const registerNewCompany = async () => {
//     if (!companyName.trim()) {
//       toast.error("Company name is required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         `${COMPANY_API_ENDPOINT}/register`,
//         { companyName },
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         dispatch(setSingleCompany(res.data.company));
//         toast.success("Company created successfully");

//         const companyId = res?.data?.company?._id;
//         navigate(`/admin/companies/${companyId}`);
//       }
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message || "Failed to create company"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Navbar />

//       <div className="max-w-4xl mx-auto px-4 py-30">
//         {/* Card */}
//         <div className="bg-white rounded-2xl shadow-md border p-8 max-w-xl mx-auto">
//           {/* Header */}
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold mb-2">Create Company</h1>
//             <p className="text-gray-500 text-sm">
//               Enter your company name to get started. You can update this later.
//             </p>
//           </div>

//           {/* Input */}
//           <div className="space-y-2">
//             <Label>Company Name</Label>
//             <Input
//               type="text"
//               value={companyName}
//               onChange={(e) => setCompanyName(e.target.value)}
//               placeholder="Microsoft, Google, JobHunt..."
//               className="h-11"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-3 mt-8">
//             <Button
//               variant="outline"
//               onClick={() => navigate("/admin/companies")}
//             >
//               Cancel
//             </Button>

//             <Button
//               onClick={registerNewCompany}
//               disabled={loading}
//               className="bg-[#7209b7] hover:bg-[#5f32ad] text-white rounded-xl px-6"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating...
//                 </>
//               ) : (
//                 "Continue"
//               )}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanyCreate;



import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "../utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "../../redux/companySlice";
import { Loader2 } from "lucide-react";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${COMPANY_API_ENDPOINT}/register`,
        { companyName },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success("Company created successfully");
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* py-20 on mobile, py-28 on sm+ to clear navbar */}
      <div className="max-w-4xl mx-auto px-3 sm:px-5 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-10">

        {/* Card — full width on mobile, max-w-xl centred on sm+ */}
        <div className="bg-white rounded-2xl shadow-md border p-5 sm:p-7 lg:p-8 w-full sm:max-w-xl sm:mx-auto">

          {/* Header */}
          <div className="mb-5 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">Create Company</h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Enter your company name to get started. You can update this later.
            </p>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Label className="text-sm">Company Name</Label>
            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Microsoft, Google, JobHunt..."
              className="h-10 sm:h-11 text-sm"
            />
          </div>

          {/* Buttons — stacked on mobile, row on sm+ */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-6 sm:mt-8">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="w-full sm:w-auto rounded-xl text-sm"
            >
              Cancel
            </Button>

            <Button
              onClick={registerNewCompany}
              disabled={loading}
              className="w-full sm:w-auto bg-[#7209b7] hover:bg-[#5f32ad] text-white rounded-xl px-6 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;