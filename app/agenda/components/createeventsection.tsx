"use client";
import React from "react";

export default async function CreateEventSection({ active, setActive }) {
  const cancelCreationEvent = () => {
    setActive(false);
  };

  // console.log(clients)

  return (
    <div className={`"bg-slate-900 w-full" ${!active ? "hidden" : ""}`}>
      <form action="">
        <input type="text" className=" p-3 border border-gray-300" />
        <textarea
          name=""
          id=""
          className=" rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        ></textarea>
        <button
          className="p-3 bg-gray-800 text-white rounded-md "
          onClick={cancelCreationEvent}
          type="button"
        >
          Annuler
        </button>
      </form>
    </div>
  );
}
