import Tabs from "../components/Tabs";
import OperationCaisse from "./components/operationcaisse";
import Tickets from "./components/tickets";
import {
  get_synths_chiffre_affaires_jr,
  get_encaissements,
  get_synths_montant_en_caisse_jr,
  get_operation_caisse,
  get_tickets,
  get_synths_paiements_jr,
} from "@/app/lib/ticket/ticketActions";
import Container from "./container";
import { revalidatePath } from "next/cache";

export default async function Journaux({
  searchParams,
}: {
  searchParams: any;
}) {
  const valueDate = searchParams?.date;
  console.log("searchParams", valueDate);
  // return null;
  // Check if the 'date' parameter is provided and is a valid date
  if (valueDate && isNaN(Date.parse(valueDate))) {
    console.error("Invalid or missing date parameter:", valueDate);
    return null;
  }
  // Convert the string to a Date object
  // const validDate = new Date(valueDate);
  const validDate = valueDate ? new Date(valueDate) : new Date();
  const tickets = JSON.parse(
    (await get_tickets({
      where: `WHERE idtypedoc = 21 ${
        validDate ? `AND DATE(dce.date_doc)=?` : ""
      }`,
      params: validDate ? [validDate.toISOString().split("T")[0]] : [],
    })) as string
  );
  console.log("validDate", validDate.toISOString().split("T")[0]);

  const encaissements = JSON.parse(
    (await get_encaissements({
      where: `WHERE idtypedoc = 21 ${
        validDate ? `AND DATE(dce.date_doc)=?` : ""
      }`,
      params: validDate ? [validDate.toISOString().split("T")[0]] : [],
    })) as string
  );

  const operation_caisse = JSON.parse(
    (await get_operation_caisse({
      where: `WHERE id_caisse = 1 ${
        validDate ? `AND DATE(date_et_heur)=?` : ""
      }`,
      params: validDate ? [validDate.toISOString().split("T")[0]] : [],
    })) as string
  );
  const montant_en_caisse = JSON.parse(
    (await get_synths_montant_en_caisse_jr({
      having: validDate ? `HAVING DATE(synths_date)=?` : "",
      params: validDate ? [validDate.toISOString().split("T")[0]] : [],
    })) as string
  );
  const paiements = JSON.parse(
    (await get_synths_paiements_jr({
      having: validDate
        ? `HAVING SUM(pmt.montant) <> 0 AND DATE(synths_date)=?`
        : "HAVING SUM(pmt.montant) <> 0",
      params: validDate ? [validDate.toISOString().split("T")[0]] : [],
    })) as string
  );
  const chiffre_affaires = JSON.parse(
    (await get_synths_chiffre_affaires_jr({
      having: validDate ? `HAVING DATE(synths_date)=?` : "",
      params: validDate ? [validDate.toISOString().split("T")[0]] : [],
    })) as string
  );
  const synths = {
    ...montant_en_caisse[0],
    ...chiffre_affaires[0],
    paiements: [...paiements],
  };
  console.log("synths", synths);
  return (
    <div className="p-14">
      <Container
        tickets={tickets}
        encaissements={encaissements}
        operation_caisse={operation_caisse}
        synths={synths}
        valueDate={valueDate}
      />
    </div>
  );
}
