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

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-800">Filter Jobs</h1>
      </div>

      {/* Scrollable content */}
      <div className="p-6 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-[#6A38C2]">
        <RadioGroup value={selectedValue} onValueChange={changeHandler}>
          {filterData.map((data, index) => (
            <div key={index} className="mb-6">
              {/* Section Title */}
              <h2 className="text-sm font-semibold text-[#6A38C2] mb-3 uppercase tracking-wide">
                {data.filterType}
              </h2>

              {/* Options */}
              <div className="space-y-2">
                {data.array.map((item, idx) => {
                  const itemId = `id${index}-${idx}`;

                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition cursor-pointer"
                    >
                      <RadioGroupItem
                        value={item}
                        id={itemId}
                        className="border-gray-300 text-[#6A38C2]"
                      />
                      <Label
                        htmlFor={itemId}
                        className="text-sm text-gray-700 cursor-pointer w-full"
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
      </div>
    </div>
  );
};

export default FilterCard;
