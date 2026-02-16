import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User2 } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Link, useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_ENDPOINT } from "../utils/constant";
import { setUser } from "../../redux/authSlice";

const Navbar = ({ transparent = false }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/login";
  const isSignup = location.pathname === "/signup";

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  /* nav link with underline */
  const navLink =
    "relative text-sm font-medium text-gray-600 transition-all duration-200 " +
    "hover:text-[#6A38C2] " +
    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 " +
    "after:bg-[#6A38C2] after:transition-all after:duration-300 " +
    "hover:after:w-full";

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300
        ${
          transparent
            ? "bg-transparent"
            : "bg-white/80 backdrop-blur-md border-b shadow-sm"
        }
      `}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-th.png" alt="logo" className="h-5 w-auto" />
        <span className="text-[#6A38C2] font-medium">JobConnect</span>
        </Link>

        <div className="flex items-center gap-8">
          {/* Navigation */}
          <ul className="hidden md:flex items-center gap-6">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/admin/companies" className={navLink}>
                    Companies
                  </Link>
                </li>
                <li>
                  <Link to="/admin/jobs" className={navLink}>
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className={navLink}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className={navLink}>
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/browse" className={navLink}>
                    Browse
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Auth */}
          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button
                  // variant={isLogin ? "default" : "ghost"}
                  variant={"secondary"}
                  className={`${isLogin ? "cursor-pointer rounded-xl text-[#6A38C2]" : "cursor-pointer rounded-xl"}`}
                >
                  Login
                </Button>
              </Link>

              <Link to="/signup">
                <Button className="cursor-pointer rounded-xl px-5 bg-[#6A38C2] hover:bg-[#5b30a6] text-white">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar
                  className="
                    h-9 w-9 cursor-pointer
                    ring-2 ring-[#6A38C2]/30
                    hover:ring-[#6A38C2]
                    hover:shadow-[0_0_12px_#6A38C2]
                    transition
                  "
                >
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      "https://github.com/shadcn.png"
                    }
                    alt="Profile"
                  />
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-80 rounded-2xl shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          user?.profile?.profilePhoto ||
                          "https://github.com/shadcn.png"
                        }
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{user?.fullname}</h4>
                      <p className="text-xs text-muted-foreground">
                        {user?.profile?.bio}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {user?.role === "student" && (
                      <Link to="/profile">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 hover:text-[#6A38C2]"
                        >
                          <User2 size={16} />
                          View Profile
                        </Button>
                      </Link>
                    )}

                    <Button
                      onClick={logoutHandler}
                      variant="ghost"
                      className="w-full justify-start gap-2 text-red-500 hover:text-red-600"
                    >
                      <LogOut size={16} />
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
