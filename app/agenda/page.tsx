import Home from "./components/home";

export default async function CalendarPage() {
  // const clients = await fetch("http://localhost:3000/api/client", {
  //   method: "GET",
  // });
  const responseClt = await fetch("http://localhost:3000/api/client", {
    cache: "no-cache",
  });
  const clients = await responseClt.json();

  const responseVls = await fetch("http://localhost:3000/api/ville", {
    cache: "no-cache",
  });
  const villes = await responseVls.json();

  const responseClb = await fetch("http://localhost:3000/api/collaborateur", {
    cache: "no-cache",
  });
  const collaborateurs = await responseClb.json();

  const responsePrs = await fetch("http://localhost:3000/api/prestation", {
    cache: "no-cache",
  });
  const prestations = await responsePrs.json();

  const responseAgPR = await fetch("http://localhost:3000/api/prestation", {
    cache: "no-cache",
  });
  const agenda_prestation = await responseAgPR.json();

  return (
    <div className="h-screen  p-6">
      <Home
        clients={clients}
        villes={villes}
        collaborateurs={collaborateurs}
        prestations={prestations}
        agenda_prestation={agenda_prestation}
      />
    </div>
  );
}
