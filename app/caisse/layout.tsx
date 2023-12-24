import TicketsEnAttente from "./components/list_tickets_en_attente";
import Navbar from "./components/navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar>
        <TicketsEnAttente />
        {/* <p>sls</p> */}
      </Navbar>
      <main className="p-6">{children}</main>
    </>
  );
}
