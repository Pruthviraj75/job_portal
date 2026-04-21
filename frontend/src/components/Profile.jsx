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

/* ── Shared tab config ──────────────────────────────────────────────── */
const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "applied", label: "Applied Jobs", icon: Briefcase },
  { key: "saved", label: "Saved Jobs", icon: Bookmark },
];

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
  const [search, setSearch] = useState("");

  /* ── Saved jobs search ──────────────────────────────────────────── */
  // const filteredJobs = useMemo(() => {
  //   if (!search) return allSavedJobs;
  //   return allSavedJobs.filter((item) =>
  //     item.job.title.toLowerCase().includes(search.toLowerCase())
  //   );
  // }, [allSavedJobs, search]);

  const filteredJobs = useMemo(() => {
    const validJobs = allSavedJobs.filter((item) => item?.job !== null);

    if (!search) return validJobs;

    return validJobs.filter((item) =>
      item?.job?.title?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [allSavedJobs, search]);
  /* ── Resume upload ──────────────────────────────────────────────── */
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

      {/* ── Mobile horizontal tab bar (hidden on md+) ────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5
                text-xs font-medium transition-colors
                ${
                  activeTab === key
                    ? "text-[#6A38C2]"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              <Icon
                size={18}
                className={
                  activeTab === key ? "text-[#6A38C2]" : "text-gray-400"
                }
              />
              <span className="leading-tight">{label}</span>
              {activeTab === key && (
                <span className="absolute bottom-0 w-1/3 h-0.5 bg-[#6A38C2] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Page content ─────────────────────────────────────────────── */}
      <div className="pt-20 sm:pt-24 pb-20 md:pb-8 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 flex gap-6 xl:gap-8">
        {/* ── Desktop sidebar (hidden on mobile) ───────────────────────── */}
        <aside className="hidden md:block w-52 lg:w-60 shrink-0">
          <div className="sticky top-28 bg-white rounded-2xl border shadow-sm p-3 space-y-1.5">
            {TABS.map(({ key, label, icon: Icon }) => (
              <SidebarBtn
                key={key}
                icon={<Icon size={16} />}
                active={activeTab === key}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </SidebarBtn>
            ))}
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
          {/* ======== PROFILE TAB ======================================= */}
          {activeTab === "profile" && (
            <>
              {/* Profile header card */}
              <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    {/* Avatar */}
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 ring-4 ring-[#6A38C2]/20 hover:ring-[#6A38C2]/40 shrink-0">
                      <AvatarImage src={user?.profile?.profilePhoto} />
                    </Avatar>

                    {/* Info */}
                    <div className="text-center sm:text-left">
                      <h1 className="text-xl sm:text-2xl font-semibold">
                        {user?.fullname}
                      </h1>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        {user?.profile?.bio || "No bio added"}
                      </p>
                      <div className="mt-2 sm:mt-3 space-y-1 text-sm text-gray-600">
                        <p className="flex items-center justify-center sm:justify-start gap-2">
                          <Mail size={14} className="shrink-0" />
                          <span className="truncate">{user?.email}</span>
                        </p>
                        <p className="flex items-center justify-center sm:justify-start gap-2">
                          <Contact size={14} className="shrink-0" />
                          {user?.phoneNumber || "NA"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Edit button */}
                  <Button
                    className="hover:bg-[#6A38C2] w-full sm:w-auto shrink-0"
                    onClick={() => setOpen(true)}
                  >
                    <Pen size={15} className="mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                <StatCard title="Saved Jobs" value={allSavedJobs.length} />
                <StatCard
                  title="Skills"
                  value={user?.profile?.skills?.length || 0}
                />
                <StatCard
                  title="Resume"
                  value={user?.profile?.resume ? "✓" : "—"}
                />
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6">
                <h2 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                  Skills
                </h2>
                {user?.profile?.skills?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.map((s, i) => (
                      <Badge key={i} className="text-xs sm:text-sm">
                        {s}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No skills added</p>
                )}
              </div>

              {/* Resume */}
              <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h2 className="font-semibold text-sm sm:text-base">Resume</h2>
                  {user?.profile?.resume && (
                    <a
                      href={user.profile.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-[#6A38C2] hover:underline text-sm"
                    >
                      <FileText size={14} />
                      <span className="truncate max-w-[180px] sm:max-w-xs">
                        {user.profile.resumeOriginalName}
                      </span>
                    </a>
                  )}
                </div>

                <label
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="flex flex-col items-center justify-center border-2 hover:border-[#6A38C2] border-dashed rounded-xl p-6 sm:p-10 cursor-pointer transition-colors"
                >
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 mb-2 text-[#6A38C2]" />
                  <span className="text-xs sm:text-sm text-gray-500 text-center">
                    {uploading
                      ? "Uploading..."
                      : "Drag & Drop or Click to Upload"}
                  </span>
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

          {/* ======== APPLIED JOBS TAB ================================== */}
          {activeTab === "applied" && (
            <div className="overflow-x-auto rounded-2xl">
              <AppliedJobTable />
            </div>
          )}

          {/* ======== SAVED JOBS TAB ==================================== */}
          {activeTab === "saved" && (
            <div className="bg-white rounded-2xl border shadow-sm p-4 sm:p-6">
              {/* Search */}
              <div className="relative mb-4 sm:mb-6 w-full sm:w-72">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search job title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-xl pl-9 pr-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/30"
                />
              </div>

              {filteredJobs.length === 0 ? (
                <p className="text-gray-400 text-center py-10 text-sm">
                  No saved jobs found
                </p>
              ) : (
                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {/* {filteredJobs.map((item) => (
                    <Job key={item?.job?._id} job={item.job} />
                  ))} */}

                  {filteredJobs.map((item) => {
                    if (!item?.job?._id) return null; // 🔥 safety

                    return (
                      <Job
                        key={item._id || item.job._id} // ✅ unique key
                        job={item.job}
                      />
                    );
                  })}
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

/* ── Sub-components ─────────────────────────────────────────────────── */

const SidebarBtn = ({ children, active, icon, ...props }) => (
  <button
    {...props}
    className={`
      w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
      ${active ? "bg-[#6A38C2] text-white" : "hover:bg-gray-100 text-gray-700"}
    `}
  >
    {icon}
    {children}
  </button>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white border rounded-2xl shadow-sm p-3 sm:p-4 md:p-6 text-center">
    <p className="text-xs sm:text-sm text-gray-500 leading-tight">{title}</p>
    <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-1">{value}</p>
  </div>
);

export default Profile;
