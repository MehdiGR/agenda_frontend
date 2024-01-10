import Tabs from "../components/Tabs";
import OperationCaisse from "./components/operationcaisse";
import Tickets from "./components/tickets";
import {
  get_encaissements,
  get_operation_caisse,
  get_synths_paiements,
  get_tickets,
} from "@/app/lib/ticket/ticketActions";
import Container from "./container";

export default async function Journaux() {
  const tickets = JSON.parse(
    (await get_tickets({
      where: `WHERE idtypedoc = 21`,
    })) as string
  );
  const id_caisse = 1;
  const operationCaisse = JSON.parse(
    (await get_operation_caisse({
      where: `WHERE id_caisse = 1`,
    })) as string
  );
  const encaissements = JSON.parse(
    (await get_encaissements({
      where: `WHERE idtypedoc = 21`,
    })) as string
  );
  const synths = JSON.parse(
    (await get_synths_paiements({
      having: ``,
    })) as string
  );
  console.log(synths, "synths");
  return (
    <div className="p-14">
      <Container
        tickets={tickets}
        operationCaisse={operationCaisse}
        encaissements={encaissements}
        synths={synths}
      />
    </div>
  );
}
