import Tabs from "../components/Tabs";
import TodayTicket from "./components/todayticket";

export default async function Journaux() {
  return (
    <div className="p-14">
      <Tabs className="w-full">
        <div label="Tickets aujourd’hui" className="w-full">
          <TodayTicket />
        </div>
        <div label="Journaux" className="w-full">
          <p>slsls</p>
        </div>
      </Tabs>
    </div>
  );
}
