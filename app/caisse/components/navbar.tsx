"use client";
// components/Navbar.js
import Link from "next/link";
import { useState } from "react";
import TicketsEnAttente from "./list_tickets_en_attente";
import { RxHamburgerMenu } from "react-icons/rx";
import { usePathname } from "next/navigation";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const [isTicketEnAttenteHovered, setIsTicketEnAttenteHovered] =
    useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const pathname = usePathname();

  return (
    <>
      <nav className="bg-gray-300 h-[50px] w-full">
        <div
          className={`lg:flex items-center justify-center lg:space-x-4 ${
            isMenuOpen
              ? "block lg:bg-gray-300 bg-white z-20 lg:static absolute top-12 w-full lg:shadow-none shadow-md"
              : "hidden"
          }`}
        >
          <Link href="/caisse">
            <div
              className={`px-6 text-slate-900 font-semibold h-[50px] leading-[50px]  hover:text-white transition cursor-pointer  ${
                pathname == "/caisse"
                  ? "bg-slate-900 text-white font-bold"
                  : "hover:text-gray-500 text-gray-800 hover:bg-slate-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Caisse
            </div>
          </Link>

          <div
            className="relative  px-6 text-slate-900 font-semibold h-[50px] leading-[50px] hover:bg-slate-600 hover:text-white transition cursor-pointer"
            onMouseEnter={() => setIsTicketEnAttenteHovered(true)}
            onMouseLeave={() => setIsTicketEnAttenteHovered(false)}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className=" ">Tickets en attente</span>
            {/* Hidden content for TicketsEnAttente */}
            <div
              className={`${
                isTicketEnAttenteHovered
                  ? "block opacity-100 pointer-events-auto"
                  : "hidden opacity-0 pointer-events-none"
              }  `}
            >
              {/* <TicketsEnAttente /> */}
              {children}
            </div>
          </div>
          <Link href="/caisse/journaux">
            <div
              className={`px-6 text-slate-900 font-semibold h-[50px] leading-[50px]  hover:text-white transition cursor-pointer ${
                pathname == "/caisse/journaux"
                  ? "bg-slate-900 text-white font-bold"
                  : "hover:text-gray-500 text-gray-800 hover:bg-slate-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Journées et tickets de caisse
            </div>
          </Link>
          <Link href="/caisse/synthese_ventes">
            <div
              className={`px-6 text-slate-900 font-semibold h-[50px] leading-[50px]  hover:text-white transition cursor-pointer ${
                pathname == "/caisse/synthese_ventes"
                  ? "bg-slate-900 text-white font-bold "
                  : "hover:text-gray-500 text-gray-800 hover:bg-slate-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Synthèse des ventes
            </div>
          </Link>
        </div>
        <div className="lg:hidden flex item-center px-4 h-full">
          {/* Hamburger menu for mobile view */}
          <button
            className="text-slate-900 focus:outline-none"
            onClick={toggleMenu}
          >
            <RxHamburgerMenu size={30} />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

// components/Navbar.js

// import { useState } from 'react';
// import Link from 'next/link';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <nav className="bg-gray-800 p-4">
//       <div className="container mx-auto flex items-center justify-between">
//         <Link href="/">
//           <a className="text-white text-xl font-bold">Your Logo</a>
//         </Link>
//         <div className={`lg:flex items-center space-x-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
//           {/* Links are now shown/hidden based on isMenuOpen state */}
//           <Link href="/">
//             <a className="text-white" onClick={() => setIsMenuOpen(false)}>Home</a>
//           </Link>
//           <Link href="/about">
//             <a className="text-white" onClick={() => setIsMenuOpen(false)}>About</a>
//           </Link>
//           {/* Add more navigation links as needed */}
//         </div>
//         <div className="lg:hidden">
//           {/* Hamburger menu for mobile view */}
//           <button className="text-white focus:outline-none" onClick={toggleMenu}>
//             <i className="fas fa-bars"></i>
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
