import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { USER_API_ENDPOINT } from "../utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";
import AuthLayout from "./AuthLayout";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_ENDPOINT}/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <AuthLayout>
      <form onSubmit={submitHandler} className="space-y-4">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

        <Input name="fullname" placeholder="Full Name" onChange={changeEventHandler} />
        <Input name="email" type="email" placeholder="Email" onChange={changeEventHandler} />
        <Input name="phoneNumber" placeholder="Phone Number" onChange={changeEventHandler} />
        <Input name="password" type="password" placeholder="Password" onChange={changeEventHandler} />

        <RadioGroup className="flex gap-6">
          <label className="flex items-center gap-2">
            <Input type="radio" name="role" value="student" onChange={changeEventHandler} />
            Student
          </label>
          <label className="flex items-center gap-2">
            <Input type="radio" name="role" value="recruiter" onChange={changeEventHandler} />
            Recruiter
          </label>
        </RadioGroup>

        <div>
          <Label>Profile Image</Label>
          <Input type="file" accept="image/*" onChange={changeFileHandler} />
        </div>

        <Button className="w-full" disabled={loading || !input.role}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
