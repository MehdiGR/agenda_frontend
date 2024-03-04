"use client";
import { useState } from "react";
import { FaCalendarAlt, FaCashRegister, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const MainMenu = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const pathname = usePathname();
  return (
    <nav className="bg-white p-2 w-full">
      <div className="flex justify-between items-center  max-w-6xl  ">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-gray-800 text-xl font-bold flex items-center cursor-pointer ml-10">
            <Image src="/logo.png" alt="" width={160} height={49} />
          </h1>
        </Link>

        {/* Mobile menu toggle icon */}
        <button
          className="text-gray-800 lg:hidden"
          onClick={() => setToggleMenu(!toggleMenu)}
        >
          {toggleMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Rest of the menu items */}
        <div
          className={`lg:flex items-center justify-center lg:space-x-4 ${
            toggleMenu
              ? "flex flex-col lg:flex-row bg-white  z-20 lg:static absolute left-0 top-[67px] w-full  shadow-md"
              : "hidden lg:flex"
          } `}
        >
          <Link href="/">
            <span
              className={`text-gray-800 flex items-center cursor-pointer my-2 w-full  ${
                pathname == "/"
                  ? "text-teal-500 font-bold"
                  : "hover:text-gray-500 text-gray-800"
              }`}
            >
              <FaCalendarAlt className="mr-2" /> Agenda
            </span>
          </Link>
          {toggleMenu && <hr className="w-full text-gray-100 my-2" />}
          <Link href="/caisse">
            <span
              className={`text-gray-800 flex items-center cursor-pointer my-2 w-full border-t-gray-800 ${
                pathname == "/caisse"
                  ? "text-teal-500 font-bold"
                  : "hover:text-gray-500 text-gray-800"
              }`}
            >
              <FaCashRegister className="mr-2" /> Caisse
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MainMenu;
