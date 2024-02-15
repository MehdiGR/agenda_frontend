import {
  get_synths_chiffre_affaires,
  get_synths_detail_tva,
  get_synths_fonds_caisse,
  get_synths_reglement,
  get_tickets,
  get_total_sales_by_article_type,
} from "@/app/lib/ticket/ticketActions";
import Container from "./container";
import { revalidatePath } from "next/cache";

export default async function Journaux({
  searchParams,
}: {
  searchParams: any;
}) {
  const valueDate = searchParams?.date;
  const viewType = searchParams?.viewType;
  // return null;
  // Check if the 'date' parameter is provided and is a valid date
  if (valueDate && isNaN(Date.parse(valueDate))) {
    console.error("Invalid or missing date parameter:", valueDate);
    return null;
  }
  // Convert the string to a Date object
  const validDate = valueDate
    ? new Date(valueDate)
    : new Date(
        `${new Date().getFullYear()}-${String(
          new Date().getUTCMonth() + 1
        ).padStart(2, "0")}-01`
      );
  const validType = viewType ? viewType : "monthly";
  const year = validDate?.getUTCFullYear(); // Assuming validDate is a Date object
  const month = validDate?.getUTCMonth() + 1; // Assuming validDate is a Date object
  const salesData = JSON.parse(
    (await get_synths_chiffre_affaires({
      date: validDate?.toISOString().split("T")[0],
      viewType: validType,
    })) as string
  );
  const salesByArticleType = JSON.parse(
    (await get_total_sales_by_article_type({
      // date: validDate?.toISOString().split("T")[0],
      where:
        viewType === "yearly"
          ? "WHERE YEAR(dce.date_doc)=? "
          : `WHERE YEAR(dce.date_doc) = ? AND MONTH(dce.date_doc) = ? 
             `,
      params: viewType === "yearly" ? [year, year] : [year, month, year, month],
    })) as string
  );

  const ticketsData = JSON.parse(
    (await get_tickets({
      where:
        viewType === "yearly"
          ? "WHERE YEAR(dce.date_doc)=?"
          : "WHERE YEAR(dce.date_doc)=? AND MONTH(dce.date_doc)=?",
      params: viewType === "yearly" ? [year] : [year, month],
    })) as string
  );
  const reglementsData = JSON.parse(
    (await get_synths_reglement({
      date: validDate?.toISOString().split("T")[0],
      viewType: validType,
    })) as string
  );
  const fondsCaisseData = JSON.parse(
    (await get_synths_fonds_caisse({
      date: validDate?.toISOString().split("T")[0],
      viewType: validType,
    })) as string
  );
  const detailTvaData = JSON.parse(
    (await get_synths_detail_tva({
      date: validDate?.toISOString().split("T")[0],
      viewType: validType,
    })) as string
  );
  // Format the date as a string in the 'YYYY-MM-DD' format
  return (
    <div className="p-14">
      <Container
        salesData={salesData}
        salesByArticleType={salesByArticleType}
        ticketsData={ticketsData}
        reglementsData={reglementsData}
        fondsCaisseData={fondsCaisseData}
        detailTvaData={detailTvaData}
        viewType={validType}
      />
    </div>
  );
}
