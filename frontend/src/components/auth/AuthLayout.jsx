// import React, { useEffect, useRef } from "react";
// import { Link, useLocation } from "react-router";
// import Navbar from "../shared/Navbar";

// const AuthLayout = ({ children }) => {
//   const location = useLocation();
//   const isLogin = location.pathname === "/login";
//   const formRef = useRef(null);

//   // Auto focus first input
//   useEffect(() => {
//     const input = formRef.current?.querySelector("input");
//     input?.focus();
//   }, [isLogin]);

//   return (
//     <>
//     <Navbar transparent/>
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 pt-16">
//       <div
//         className="relative w-full max-w-5xl h-[520px] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/70 flex shadow-xl"
//         style={{
//           boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
//         }}
//       >
//         {/* FORM SECTION */}
//         <div
//           ref={formRef}
//           aria-live="polite"
//           className={`absolute top-0 h-full w-full md:w-1/2 flex items-center justify-center p-8 transition-all duration-700 ease-in-out
//           ${isLogin ? "md:left-0 opacity-100" : "md:left-1/2 opacity-0 md:opacity-100"}
//           `}
//         >
//           <div className="w-full max-w-sm animate-fadeIn">
//             {children}
//           </div>
//         </div>

//         {/* SLIDING PANEL */}
//         <div
//           className={`absolute top-0 h-full w-full md:w-1/2 text-white flex flex-col items-center justify-center text-center px-8 transition-all duration-700 ease-in-out
//           ${isLogin ? "md:left-1/2" : "md:left-0"}
//           `}
//           style={{
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           }}
//         >
//           <h1 className="text-3xl font-bold mb-4 drop-shadow-lg">
//             {isLogin ? "Hey There!" : "Welcome Back!"}
//           </h1>

//           <p className="text-sm mb-6 leading-relaxed max-w-sm opacity-90">
//             {isLogin
//               ? "Enter your personal details and start your journey with us."
//               : "To stay connected with us, please login with your personal information."}
//           </p>

//           <Link
//             to={isLogin ? "/signup" : "/login"}
//             className="border-2 border-white px-10 py-3 rounded-full font-semibold tracking-wide
//             hover:bg-white hover:text-purple-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/40"
//             aria-label={isLogin ? "Go to signup page" : "Go to login page"}
//           >
//             {isLogin ? "SIGN UP" : "SIGN IN"}
//           </Link>
//         </div>
//       </div>

//       {/* Animation */}
//       <style>
//         {`
//           @keyframes fadeIn {
//             from {
//               opacity: 0;
//               transform: translateY(10px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//           .animate-fadeIn {
//             animation: fadeIn 0.6s ease-in-out;
//           }
//         `}
//       </style>
//     </div>
//     </>

//   );
// };

// export default AuthLayout;


import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import Navbar from "../shared/Navbar";

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const formRef = useRef(null);

  useEffect(() => {
    const input = formRef.current?.querySelector("input");
    input?.focus();
  }, [isLogin]);

  return (
    <>
      <Navbar transparent />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-20 md:py-16">
        <div
          className="
            relative w-full max-w-5xl rounded-2xl overflow-hidden
            backdrop-blur-xl bg-white/70 shadow-xl
            flex flex-col
            md:flex-row md:h-[540px]
            lg:h-[560px]
          "
          style={{ boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)" }}
        >

          {/*
            ── COLORED PANEL ────────────────────────────────────────────
            Mobile  : full width, stacked (order controlled by isLogin)
            md+     : absolutely positioned half-panel that slides
          */}
          <div
            className={`
              w-full py-10 px-6 sm:px-10
              md:absolute md:top-0 md:h-full md:w-1/2 md:py-0 md:px-8
              text-white flex flex-col items-center justify-center text-center
              transition-all duration-700 ease-in-out
              ${isLogin
                ? "order-2 md:order-none md:left-1/2"
                : "order-1 md:order-none md:left-0"
              }
            `}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 drop-shadow-lg">
              {isLogin ? "Hey There!" : "Welcome Back!"}
            </h1>

            <p className="text-sm mb-6 leading-relaxed max-w-xs sm:max-w-sm opacity-90">
              {isLogin
                ? "Enter your personal details and start your journey with us."
                : "To stay connected with us, please login with your personal information."}
            </p>

            <Link
              to={isLogin ? "/signup" : "/login"}
              className="
                border-2 border-white px-8 py-2.5 rounded-full
                font-semibold tracking-wide text-sm sm:text-base
                hover:bg-white hover:text-purple-600
                transition-all duration-300
                focus:outline-none focus:ring-4 focus:ring-white/40
              "
              aria-label={isLogin ? "Go to signup page" : "Go to login page"}
            >
              {isLogin ? "SIGN UP" : "SIGN IN"}
            </Link>
          </div>

          {/*
            ── FORM SECTION ─────────────────────────────────────────────
            Mobile  : full width, stacked below / above the panel
            md+     : absolutely positioned half-panel that slides
          */}
          <div
            ref={formRef}
            aria-live="polite"
            className={`
              w-full px-6 py-10 sm:px-10
              md:absolute md:top-0 md:h-full md:w-1/2 md:p-8
              flex items-center justify-center
              transition-all duration-700 ease-in-out
              ${isLogin
                ? "order-1 md:order-none md:left-0 opacity-100"
                : "order-2 md:order-none md:left-1/2 opacity-100"
              }
            `}
          >
            <div className="w-full max-w-sm animate-fadeIn">
              {children}
            </div>
          </div>

        </div>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
              animation: fadeIn 0.6s ease-in-out;
            }
          `}
        </style>
      </div>
    </>
  );
};

export default AuthLayout;