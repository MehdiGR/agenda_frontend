import Home from "./components/home";

export default async function CalendarPage() {
  // const clients = await fetch("http://localhost:3000/api/client", {
  //   method: "GET",
  // });
  const responseClt = await fetch("http://localhost:3000/api/client", {
    cache: "no-store",
  });
  const clients = await responseClt.json();

  const responseVls = await fetch("http://localhost:3000/api/ville", {
    cache: "no-store",
  });
  const villes = await responseVls.json();

  const responseClb = await fetch("http://localhost:3000/api/collaborateur", {
    cache: "no-store",
  });
  const collaborateurs = await responseClb.json();

  const responsePrs = await fetch("http://localhost:3000/api/prestation", {
    cache: "no-store",
  });
  const prestations = await responsePrs.json();

  const responseAgPR = await fetch(
    "http://localhost:3000/api/agenda_prestation",
    {
      cache: "no-store",
    }
  );
  const agenda_prestation = await responseAgPR.json();

  const responseAg = await fetch("http://localhost:3000/api/agenda", {
    cache: "no-store",
  });
  const agendas = await responseAg.json();

  const responsePrd = await fetch("http://localhost:3000/api/periode", {
    cache: "no-store",
  });
  const periods = await responsePrd.json();
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
      />
    </div>
  );
}
