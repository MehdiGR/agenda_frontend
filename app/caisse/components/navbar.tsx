// components/Navbar.js
import Link from "next/link";
import { useState } from "react";
import TicketsEnAttente from "./list_tickets_en_attente";

const Navbar = () => {
  const [isTicketEnAttenteHovered, setIsTicketEnAttenteHovered] =
    useState(false);

  return (
    <>
      <nav className="bg-gray-300 h-[50px] fixed w-full z-10 top-0">
        <div className="container mx-auto">
          <div className="flex items-center justify-center">
            <div className="space-x-4">
              <div className="inline-block px-6 text-slate-900 font-semibold h-[50px] leading-[50px] hover:bg-slate-900 hover:text-white transition cursor-pointer">
                <Link href="/">Caisse</Link>
              </div>

              <div
                className="relative inline-block px-6 text-slate-900 font-semibold h-[50px] leading-[50px] hover:bg-slate-900 hover:text-white transition cursor-pointer"
                onMouseEnter={() => setIsTicketEnAttenteHovered(true)}
                onMouseLeave={() => setIsTicketEnAttenteHovered(false)}
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
                  <TicketsEnAttente />
                </div>
              </div>
              <div className="inline-block px-6 text-slate-900 font-semibold h-[50px] leading-[50px] hover:bg-slate-900 hover:text-white transition cursor-pointer">
                <Link href="/tickets_journee">
                  Journées et tickets de caisse
                </Link>
              </div>
              <div className="inline-block px-6 text-slate-900 font-semibold h-[50px] leading-[50px] hover:bg-slate-900 hover:text-white transition cursor-pointer">
                <Link href="/synthese_ventes">Synthèse des ventes</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
