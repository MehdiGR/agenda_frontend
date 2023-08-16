import Home from "./components/home";

export default async function CalendarPage() {
  // const clients = await fetch("http://localhost:3000/api/client", {
  //   method: "GET",
  // });
  const response = await fetch("http://localhost:3000/api/client");
  const clients = await response.json();
  // const clients = ["ss"];
  console.log(clients);
  return (
    <>
      <Home clients={clients} />
    </>
  );
}
