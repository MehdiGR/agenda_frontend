// components/Navbar.js
import Link from "next/link";
import { useState } from "react";
import TicketsEnAttente from "./list_tickets_en_attente";

const Navbar = () => {
  const [isTicketEnAttenteHovered, setIsTicketEnAttenteHovered] =
    useState(false);

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="space-x-4">
              <Link href="/" className="text-white ">
                Caisse
              </Link>
              <div
                className="relative text-white inline-block h-full bg-red-300  "
                onMouseEnter={() => setIsTicketEnAttenteHovered(true)}
                onMouseLeave={() => setIsTicketEnAttenteHovered(false)}
              >
                <Link href="javascript:void(0)">Tickets en attente</Link>
                {/* Hidden content for TicketsEnAttente */}
                <div
                  className={`${
                    isTicketEnAttenteHovered
                      ? "block opacity-100 pointer-events-auto"
                      : "hidden opacity-0 pointer-events-none"
                  } absolute top-full left-0 bg-red-500 p-4 w-64 z-10 rounded-lg transition-opacity duration-300`}
                >
                  <TicketsEnAttente />
                </div>
              </div>

              <Link href="/tickets_journee" className="text-white">
                Journées et tickets de caisse
              </Link>
              <Link href="/synthese_ventes" className="text-white">
                Synthèse des ventes
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
