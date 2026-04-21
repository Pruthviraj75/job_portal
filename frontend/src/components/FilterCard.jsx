// import React, { useEffect, useState } from "react";
// import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
// import { Label } from "./ui/label";
// import { useDispatch } from "react-redux";
// import { setSearchedQuery } from "../redux/jobSlice";

// const filterData = [
//   {
//     filterType: "Location",
//     array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
//   },
//   {
//     filterType: "Industry",
//     array: [
//       "Frontend Developer",
//       "Backend Developer",
//       "FullStack Developer",
//       "Java Developer",
//       "Cloud Engineer",
//       "UI/UX Designer",
//       "Data Analyst",
//       "DevOps Engineer",
//     ],
//   },
//   {
//     filterType: "Salary",
//     array: ["0–40k", "40k–1L", "1L–5L", "5L+"],
//   },
// ];

// const FilterCard = () => {
//   const [selectedValue, setSelectedValue] = useState("");
//   const dispatch = useDispatch();

//   const changeHandler = (value) => {
//     setSelectedValue(value);
//   };

//   useEffect(() => {
//     dispatch(setSearchedQuery(selectedValue));
//   }, [selectedValue, dispatch]);

//   return (
//     <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
//       {/* Header */}
//       <div className="p-6 border-b border-gray-100">
//         <h1 className="text-lg font-semibold text-gray-800">Filter Jobs</h1>
//       </div>

//       {/* Scrollable content */}
//       <div className="p-6 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-[#6A38C2]">
//         <RadioGroup value={selectedValue} onValueChange={changeHandler}>
//           {filterData.map((data, index) => (
//             <div key={index} className="mb-6">
//               {/* Section Title */}
//               <h2 className="text-sm font-semibold text-[#6A38C2] mb-3 uppercase tracking-wide">
//                 {data.filterType}
//               </h2>

//               {/* Options */}
//               <div className="space-y-2">
//                 {data.array.map((item, idx) => {
//                   const itemId = `id${index}-${idx}`;

//                   return (
//                     <div
//                       key={idx}
//                       className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition cursor-pointer"
//                     >
//                       <RadioGroupItem
//                         value={item}
//                         id={itemId}
//                         className="border-gray-300 text-[#6A38C2]"
//                       />
//                       <Label
//                         htmlFor={itemId}
//                         className="text-sm text-gray-700 cursor-pointer w-full"
//                       >
//                         {item}
//                       </Label>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </RadioGroup>
//       </div>
//     </div>
//   );
// };

// export default FilterCard;




import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "FullStack Developer",
      "Java Developer",
      "Cloud Engineer",
      "UI/UX Designer",
      "Data Analyst",
      "DevOps Engineer",
    ],
  },
  {
    filterType: "Salary",
    array: ["0–40k", "40k–1L", "1L–5L", "5L+"],
  },
];

/*
  onSelect — optional callback passed by Jobs.jsx (mobile drawer)
  so the drawer can close automatically when a filter is tapped on mobile.
*/
const FilterCard = ({ onSelect }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
    onSelect?.(); // close drawer on mobile if callback provided
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="w-full bg-white rounded-2xl flex flex-col">

      {/* Header — shown only when used as a standalone sidebar (lg+).
          Inside the drawer, Jobs.jsx renders its own header. */}
      <div className="hidden lg:block px-5 py-4 border-b border-gray-100">
        <h1 className="text-base font-semibold text-gray-800">Filter Jobs</h1>
      </div>

      {/* Scrollable filter options */}
      <div
        className="
          p-4 sm:p-5
          overflow-y-auto
          lg:max-h-[70vh]
          scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-[#6A38C2]
        "
      >
        <RadioGroup value={selectedValue} onValueChange={changeHandler}>
          {filterData.map((data, index) => (
            <div key={index} className="mb-5 last:mb-0">

              {/* Section title */}
              <h2 className="text-xs font-semibold text-[#6A38C2] mb-2.5 uppercase tracking-wider">
                {data.filterType}
              </h2>

              {/* Options */}
              <div className="space-y-1">
                {data.array.map((item, idx) => {
                  const itemId = `id${index}-${idx}`;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem
                        value={item}
                        id={itemId}
                        className="border-gray-300 text-[#6A38C2] shrink-0"
                      />
                      <Label
                        htmlFor={itemId}
                        className="text-sm text-gray-700 cursor-pointer w-full leading-snug"
                      >
                        {item}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </RadioGroup>

        {/* Clear filter */}
        {selectedValue && (
          <button
            onClick={() => {
              setSelectedValue("");
              onSelect?.();
            }}
            className="mt-4 w-full text-xs text-center text-red-400 hover:text-red-500 transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterCard;