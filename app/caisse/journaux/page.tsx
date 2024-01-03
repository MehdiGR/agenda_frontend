import Tabs from "../components/Tabs";
import OperationCaisse from "./components/operationcaisse";
import Tickets from "./components/tickets";
import { get_tickets } from "@/app/lib/ticket/ticketActions";
import Container from "./container";

export default async function Journaux() {
  const tickets = JSON.parse(
    (await get_tickets({
      where: `WHERE idtypedoc = 21`,
    })) as string
  );
  return (
    <div className="p-14">
      <Container tickets={tickets} />
    </div>
  );
}
