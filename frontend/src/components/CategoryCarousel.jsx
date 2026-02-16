import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setSearchedQuery } from "../redux/jobSlice";

const CategoryCarousel = () => {
  const categories = [
    "Frontend",
    "Backend",
    "FullStack",
    "Data Science",
    "DevOps",
    "UI/UX",
    "Graphic Design",
    "Mobile Dev",
    "Cloud",
    "AI/ML",
    "Testing",
    "Cyber Security",
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">
            Explore by <span className="text-[#6A38C2]">Category</span>
          </h2>
        </div>

        {/* Compact Carousel */}
        <Carousel className="w-full relative">
          <CarouselContent className="py-2">
            {categories.map((cat, index) => (
              <CarouselItem
                key={index}
                className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <button
                  onClick={() => searchJobHandler(cat)}
                  className="
                    w-full
                    bg-white
                    border border-gray-200
                    rounded-full
                    px-4 py-2
                    text-xs sm:text-sm font-medium
                    whitespace-nowrap
                    shadow-sm
                    transition-all duration-200
                    hover:text-[#6A38C2]
                    hover:border-[#6A38C2]
                    hover:shadow-md
                  "
                >
                  {cat}
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Smaller arrows */}
          <CarouselPrevious className="h-8 w-8 hidden md:flex" />
          <CarouselNext className="h-8 w-8 hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;
