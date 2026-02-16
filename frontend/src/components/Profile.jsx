import React, { useState, useMemo } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Contact,
  Pen,
  Upload,
  FileText,
  Briefcase,
  Bookmark,
  User,
  Search,
} from "lucide-react";

import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";

import { useSelector, useDispatch } from "react-redux";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";
import useGetSavedJobs from "../hooks/useGetSavedJobs";
import Job from "./Job";

import axios from "axios";
import { USER_API_ENDPOINT } from "./utils/constant";
import { setUser } from "../redux/authSlice";
import { toast } from "sonner";


const Profile = () => {
  useGetAppliedJobs();
  useGetSavedJobs();

  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const allSavedJobs =
    useSelector((store) => store.savedJob?.allSavedJobs) || [];

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ================= ONLY SEARCH (saved jobs) ================= */
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    if (!search) return allSavedJobs;

    return allSavedJobs.filter((item) =>
      item.job.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [allSavedJobs, search]);

  /* ================= Resume Upload ================= */

  const uploadResumeToServer = async (file) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/update`,
        formData,
        { withCredentials: true },
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Resume uploaded successfully");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
      toast.error("Only PDF / DOC / DOCX allowed");
      return;
    }

    uploadResumeToServer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };


  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-4 flex gap-8">
        {/* ================= SIDEBAR ================= */}
        <div className="w-60 hidden md:block">
          <div className="sticky top-28 bg-white rounded-2xl border shadow-sm p-3 space-y-2">
            <SidebarBtn
              icon={<User size={16} />}
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </SidebarBtn>

            <SidebarBtn
              icon={<Briefcase size={16} />}
              active={activeTab === "applied"}
              onClick={() => setActiveTab("applied")}
            >
              Applied Jobs
            </SidebarBtn>

            <SidebarBtn
              icon={<Bookmark size={16} />}
              active={activeTab === "saved"}
              onClick={() => setActiveTab("saved")}
            >
              Saved Jobs
            </SidebarBtn>
          </div>
        </div>

        {/* ================= MAIN ================= */}
        <div className="flex-1 space-y-6">
          {/* =============  PROFILE TAB ==================== */}
          {activeTab === "profile" && (
            <>
              {/* HEADER */}
              <div className="bg-white rounded-2xl shadow-sm border p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-28 w-28 ring-4 ring-[#6A38C2]/20 hover:ring-[#6A38C2]/40">
                      <AvatarImage src={user?.profile?.profilePhoto} />
                    </Avatar>

                    <div>
                      <h1 className="text-2xl font-semibold">
                        {user?.fullname}
                      </h1>

                      <p className="text-gray-600 mt-1">
                        {user?.profile?.bio || "No bio added"}
                      </p>

                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Mail size={15} /> {user?.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <Contact size={15} /> {user?.phoneNumber || "NA"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="hover:bg-[#6A38C2]"
                    onClick={() => setOpen(true)}
                  >
                    <Pen size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Saved Jobs" value={allSavedJobs.length} />
                <StatCard
                  title="Skills"
                  value={user?.profile?.skills?.length || 0}
                />
                <StatCard
                  title="Resume"
                  value={user?.profile?.resume ? "Uploaded" : "Missing"}
                />
              </div>

              {/* SKILLS */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="font-semibold mb-4">Skills</h2>

                {user?.profile?.skills?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.map((s, i) => (
                      <Badge key={i}>{s}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No skills added</p>
                )}
              </div>

              {/* RESUME */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex items-center gap-5 mb-4 ml-5">
                  <h2 className="font-semibold ">Resume - </h2>
                  {user?.profile?.resume && (
                    <a
                      href={user.profile.resume}
                      target="_blank"
                      className="flex items-center gap-2 text-[#6A38C2] hover:underline "
                    >
                      <FileText size={16}/>
                      {user.profile.resumeOriginalName}
                    </a>
                  )}
                </div>

                <label
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="flex flex-col items-center justify-center border-2 hover:border-[#6A38C2] border-dashed rounded-xl p-10 cursor-pointer"
                >
                  <Upload className="w-6 h-6 mb-2 text-[#6A38C2]" />
                  {uploading
                    ? "Uploading..."
                    : "Drag & Drop or Click to Upload"}

                  <input
                    hidden
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </label>
              </div>
            </>
          )}

          {activeTab === "applied" && <AppliedJobTable />}

          {/* ============ SAVED (Search only + icon) ===================== */}
          {activeTab === "saved" && (
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              {/* Search with icon */}
              <div className="relative mb-6 w-full md:w-72">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search job title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/30"
                />
              </div>

              {filteredJobs.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No jobs found</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredJobs.map((item) => (
                    <Job key={item.job._id} job={item.job} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};


const SidebarBtn = ({ children, active, icon, ...props }) => (
  <button
    {...props}
    className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl ${
      active ? "bg-[#6A38C2] text-white" : "hover:bg-gray-100"
    }`}
  >
    {icon}
    {children}
  </button>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white border rounded-2xl shadow-sm p-6 text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-semibold mt-1">{value}</p>
  </div>
);

export default Profile;
