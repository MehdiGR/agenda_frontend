"use client";
import React, { useState } from "react";
import CircumIcon from "@klarr-agency/circum-icons-react";
import Prestation from "./prestation";

export default function Prestations({ prestations }) {
  const [showSubfolders, setShowSubfolders] = useState(true);

  const toggleSubfolders = () => {
    setShowSubfolders(!showSubfolders);
  };
  return (
    <div className="bg-gray-200 border border-r-2 p-2 flex gap-2">
      {!showSubfolders ? (
        <>
          <div
            className="flex flex-col items-center gap-2 w-fit h-fit  rounded-md text-md font-bold uppercase p-16 cursor-pointer hover:bg-slate-800 hover:text-white  "
            onClick={toggleSubfolders}
          >
            <CircumIcon name="folder_on" />
            <span>Prestations</span>
          </div>
          <div className=" flex flex-col items-center gap-2 w-fit h-fit  rounded-md text-md font-bold uppercase p-16 cursor-pointer hover:bg-slate-800 hover:text-white  ">
            <CircumIcon name="folder_on" />
            <span>Produits</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-2">
            <div className="cursor-pointer " onClick={toggleSubfolders}>
              <CircumIcon name="circle_chev_left" />
            </div>
            <div className="bg-slate-800 w-fit h-fit p-2 text-white rounded-md">
              Prestations
            </div>
          </div>
          <div className="flex gap-2 w-fit h-fit rounded-md text-md font-bold uppercase p-16 cursor-pointer ">
            {/* Render Subfolders here */}

            {prestations.map((prestation: any) => (
              <Prestation key={prestation.id} prestation={prestation} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
