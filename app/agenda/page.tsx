import Home from "./home";
import { fetchAgenda } from "@/app/lib/agenda/agendaActions";
import { fetchAgendaPrestation } from "@/app/lib/agenda_prestation/agendaPrestationActions";
import { fetchClients } from "@/app/lib/client/clientActions";
import { fetchCollaborateurs } from "@/app/lib/collaborateur/collaborateurActions";
import { fetchPeriods } from "@/app/lib/periode/periodeActions";
import { fetchPrestations } from "@/app/lib/prestation/prestationActions";
import { fetchVilles } from "@/app/lib/ville/villeActions";
import { get_resavations } from "@/app/lib/reservat/reservatActions";

export default async function CalendarPage() {
  const clients = await fetchClients();
  const villes = await fetchVilles();
  const collaborateurs = await fetchCollaborateurs();
  const prestations = await fetchPrestations();
  const agenda_prestation = await fetchAgendaPrestation();
  const agendas = await fetchAgenda();
  const periods = await fetchPeriods();
  const reservations = await get_resavations(); // Assuming this function is defined elsewhere

  return (
    <div className="h-full p-6">
      <Home
        clients={JSON.parse(clients)}
        villes={JSON.parse(villes)}
        collaborateurs={JSON.parse(collaborateurs)}
        prestations={JSON.parse(prestations)}
        agenda_prestation={JSON.parse(agenda_prestation)}
        agendas={JSON.parse(agendas)}
        periods={JSON.parse(periods)}
        reservations={JSON.parse(reservations)}
      />
    </div>
  );
}
