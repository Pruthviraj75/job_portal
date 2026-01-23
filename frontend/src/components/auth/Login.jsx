import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { USER_API_ENDPOINT } from "../utils/constant";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";
import AuthLayout from "./AuthLayout";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_ENDPOINT}/login`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    } else if (user?.role === "student") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <AuthLayout>
      <form onSubmit={submitHandler} className="space-y-4">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="xyz@gmail.com"
            value={input.email}
            onChange={changeEventHandler}
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
          />
        </div>

        <RadioGroup className="flex gap-6 mt-2">
          <label className="flex items-center gap-2">
            <Input
              type="radio"
              name="role"
              value="student"
              checked={input.role === "student"}
              onChange={changeEventHandler}
            />
            Student
          </label>
          <label className="flex items-center gap-2">
            <Input
              type="radio"
              name="role"
              value="recruiter"
              checked={input.role === "recruiter"}
              onChange={changeEventHandler}
            />
            Recruiter
          </label>
        </RadioGroup>

        <Button className="w-full" disabled={loading || !input.role}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Login"
          )}
        </Button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium">
            Signup
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
