import { ReactNode } from "react";
import TicketsEnAttente from "./components/list_tickets_en_attente";
import Navbar from "./components/navbar";
import MainMenu from "../components/navbar";
interface LayoutProps {
  children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <MainMenu />
      <Navbar>
        <TicketsEnAttente />
        {/* <p>sls</p> */}
      </Navbar>
      <main className="p-6 ">
        {" "}
        <div className=" bg-white shadow-sm rounded-md">{children}</div>
      </main>
    </>
  );
}
