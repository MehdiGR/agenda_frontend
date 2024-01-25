import { get_synths_chiffre_affaires } from "@/app/lib/ticket/ticketActions";
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
  console.log("validDate", validDate);
  const chiffre_affaires = JSON.parse(
    (await get_synths_chiffre_affaires({
      date: validDate?.toISOString().split("T")[0],
    })) as string
  );
  console.log(chiffre_affaires);

  return (
    <div className="p-14">
      <Container chiffre_affaires={chiffre_affaires} />
    </div>
  );
}
