import {
  get_synths_chiffre_affaires,
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
  console.log("searchParams", valueDate);
  // return null;
  // Check if the 'date' parameter is provided and is a valid date
  if (valueDate && isNaN(Date.parse(valueDate))) {
    console.error("Invalid or missing date parameter:", valueDate);
    return null;
  }
  // Convert the string to a Date object
  // const validDate = new Date(valueDate);
  const validDate = valueDate
    ? new Date(valueDate)
    : new Date(
        `${new Date().getFullYear()}-${String(
          new Date().getMonth() + 1
        ).padStart(2, "0")}-01`
      );
  const validType = viewType ? viewType : "monthly";
  console.log("validType", validType);

  const salesData = JSON.parse(
    (await get_synths_chiffre_affaires({
      date: validDate?.toISOString().split("T")[0],
      viewType: validType,
    })) as string
  );
  const salesByArticleType = JSON.parse(
    (await get_total_sales_by_article_type({
      date: validDate?.toISOString().split("T")[0],
    })) as string
  );
  // Format the date as a string in the 'YYYY-MM-DD' format
  const formattedValidDate = validDate.toISOString().split("T")[0];
  return (
    <div className="p-14">
      <Container
        salesData={salesData}
        salesByArticleType={salesByArticleType}
        viewType={validType}
        valueDate={formattedValidDate}
      />
    </div>
  );
}
