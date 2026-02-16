import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_ENDPOINT } from "./utils/constant";
import { setUser } from "../redux/authSlice";
import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.profile?.avatar || ""
  );

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    avatar: null,
  });

  /* ------------------ TEXT INPUT ------------------ */
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  /* ------------------ FILE SELECT ------------------ */
  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only images allowed");
      return;
    }

    setInput({ ...input, avatar: file });

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  /* ------------------ DRAG DROP ------------------ */
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  /* ------------------ SUBMIT ------------------ */
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);

    if (input.avatar) {
      formData.append("avatar", input.avatar); 
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/update`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile updated successfully 🎉");
        setOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4">

            {/* ---------- PHOTO DRAG DROP ---------- */}
            <div className="flex flex-col items-center gap-3">
              <Label className="font-semibold">Profile Photo</Label>

              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="w-32 h-32 rounded-full border-2 border-dashed cursor-pointer flex items-center justify-center overflow-hidden"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-400">Drop / Click</span>
                )}

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </label>
            </div>

            {/* ---------- FIELDS ---------- */}

            <Input name="fullname" value={input.fullname} onChange={changeEventHandler} placeholder="Full Name *" required />

            <Input name="email" type="email" value={input.email} onChange={changeEventHandler} placeholder="Email *" required />

            <Input name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} placeholder="Phone Number" />

            <Input name="bio" value={input.bio} onChange={changeEventHandler} placeholder="Bio" />

            <Input name="skills" value={input.skills} onChange={changeEventHandler} placeholder="Skills (comma separated)" />

          </div>

          <DialogFooter>
            {loading ? (
              <Button className="w-full">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Updating...
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
