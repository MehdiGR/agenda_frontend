import Link from "next/link";
import Home from "./home";
import { revalidatePath } from "next/cache";

export default async function CalendarPage() {
  // const clients = await fetch("http://localhost:3000/api/client", {
  //   method: "GET",
  // });
  const resClt = await fetch("http://localhost:3000/api/client", {
    cache: "no-store",
  });
  const clients = await resClt.json();

  const resVls = await fetch("http://localhost:3000/api/ville", {
    cache: "no-store",
  });
  const villes = await resVls.json();

  const resClb = await fetch("http://localhost:3000/api/collaborateur", {
    cache: "no-store",
  });
  const collaborateurs = await resClb.json();

  const resPrs = await fetch("http://localhost:3000/api/prestation", {
    cache: "no-store",
  });
  const prestations = await resPrs.json();

  const resAgPR = await fetch("http://localhost:3000/api/agenda_prestation", {
    cache: "no-store",
  });
  const agenda_prestation = await resAgPR.json();

  const resAg = await fetch("http://localhost:3000/api/agenda", {
    cache: "no-store",
  });
  const agendas = await resAg.json();

  const resPrd = await fetch("http://localhost:3000/api/periode", {
    cache: "no-store",
  });
  const periods = await resPrd.json();
  const resReservat = await fetch("http://localhost:3000/api/reservat", {
    // cache: "no-store",
  });
  const reservations = await resReservat.json();
  console.log("reservations", reservations);

  return (
    <div className="h-full  p-6">
      <Home
        clients={clients}
        villes={villes}
        collaborateurs={collaborateurs}
        prestations={prestations}
        agenda_prestation={agenda_prestation}
        agendas={agendas}
        periods={periods}
        reservations={reservations}
      />
    </div>
  );
}
