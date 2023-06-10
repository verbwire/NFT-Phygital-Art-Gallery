import React from "react";
import { Link } from "react-router-dom";

function GalleryCard(props) {
  return (
    <>
      <Link to={`/gallery/${props.address}`} className="relative block group">
        <img
            src="https://res.cloudinary.com/dlvmyc0x3/image/upload/v1686525125/fotor-ai-2023061244133_gqbdgk.png"
            alt=""
            className="h-[250px] w-full object-cover transition duration-500 opacity-50 group-hover:opacity-40 sm:h-[300px]"
        />

        <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
          <h3 className="text-2xl font-medium text-white">{props.name}</h3>
          <p className="mt-1 text-md text-gray-300">
            {props.share}% Platform Share
          </p>
        </div>
      </Link>
    </>
  );
}

export default GalleryCard;
