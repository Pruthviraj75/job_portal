import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { Job_API_ENDPOINT } from "../utils/constant";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { Loader2 } from "lucide-react";

const PostJob = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { companies } = useSelector((store) => store.company);

  
  const { id } = useParams(); // edit mode
  const navigate = useNavigate();

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });

  const [loading, setLoading] = useState(false);

  // form change

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  // SUBMIT (CREATE + EDIT)

  const submitHandler = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    let res;

    if (id) {
      // EDIT
      res = await axios.put(`${Job_API_ENDPOINT}/update/${id}`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    } else {
      // CREATE
      res = await axios.post(`${Job_API_ENDPOINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    }

    if (res.data.success) {
      toast.success(res.data.message);
      navigate("/admin/jobs");
    }
  } catch (error) {
    toast.error(error.response?.data?.message);
  } finally {
    setLoading(false);
  }
};


  // PREFILL WHEN EDITING

  useEffect(() => {
    if (!singleJob) return;

    setInput({
      title: singleJob.title || "",
      description: singleJob.description || "",
      requirements: singleJob.requirements || "",
      salary: singleJob.salary || "",
      location: singleJob.location || "",
      jobType: singleJob.jobType || "",
      experience: singleJob.experienceLevel || "",
      position: singleJob.position || 0,
      companyId: singleJob.company || "",
    });
  }, [singleJob]);

  // UI

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex items-center justify-center py-16 px-4">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl w-full bg-white rounded-2xl shadow-md border"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input name="title" value={input.title} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Description</Label>
              <Input name="description" value={input.description} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Requirements</Label>
              <Input name="requirements" value={input.requirements} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Salary</Label>
              <Input type="number" name="salary" value={input.salary} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Location</Label>
              <Input name="location" value={input.location} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Job Type</Label>
              <Input name="jobType" value={input.jobType} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Experience Level</Label>
              <Input name="experience" value={input.experience} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>No of Position</Label>
              <Input type="number" name="position" value={input.position} onChange={changeEventHandler} />
            </div>

            {companies.length > 0 && (
              <Select onValueChange={selectChangeHandler}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company._id} value={company.name.toLowerCase()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {loading ? (
            <Button className="w-full mt-6">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button type="submit" className="w-full mt-6">
              {id ? "Update Job" : "Post New Job"}
            </Button>
          )}

          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center mt-4">
              Please register a company first, before posting a job
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
