import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "../utils/constant";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "../../hooks/useGetCompanyById";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);

  const navigate = useNavigate();

  const { singleCompany } = useSelector((store) => store.company);

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);

    if (input.file) formData.append("companyLogo", input.file);

    try {
      setLoading(true);

      const res = await axios.put(
        `${COMPANY_API_ENDPOINT}/update/${params.id}`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Company updated successfully");
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update company"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!singleCompany) return;

    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      file: null,
    });
  }, [singleCompany]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div>
              <h1 className="text-2xl font-bold">Company Setup</h1>
              <p className="text-sm text-gray-500">
                Update your company details and branding
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Company Name</Label>
                <Input
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="Microsoft"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Software company"
                />
              </div>

              <div>
                <Label>Website</Label>
                <Input
                  name="website"
                  value={input.website}
                  onChange={changeEventHandler}
                  placeholder="https://company.com"
                />
              </div>

              <div>
                <Label>Location</Label>
                <Input
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="Mumbai, India"
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-3">
              <Label>Company Logo</Label>

              <div className="flex items-center gap-4">
                {singleCompany?.logo && (
                  <img
                    src={singleCompany.logo}
                    alt="logo"
                    className="w-16 h-16 rounded-xl object-cover border"
                  />
                )}

                <Input
                  type="file"
                  name="companyLogo"
                  accept="image/*"
                  onChange={changeFileHandler}
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7209b7] hover:bg-[#5f32ad] text-white rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Company"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
