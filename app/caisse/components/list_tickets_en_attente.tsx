export default function TicketsEnAttente() {
  return (
    <div className="absolute top-full left-0 bg-white p-4 w-[500px] z-10 rounded-lg transition cursor-pointer-opacity duration-300 leading-[30px] text-slate-900 hover:text-slate-900 shadow-md ">
      <h3 className="text-xl font-bold">Tickets en attente</h3>
      <table className="w-full overflow-auto border">
        <thead>
          <tr>
            <th>N°</th>
            <th>Client</th>
            <th>Date</th>
            <th>Etat</th>
          </tr>
        </thead>
        <tbody className="text-center">
          <tr className="p-4 hover:bg-slate-900 hover:text-white transition">
            <td>1</td>
            <td>Client 1</td>
            <td>01/01/2023</td>
            <td>En attente</td>
          </tr>
          <tr className="p-4 hover:bg-slate-900 hover:text-white transition">
            <td>2</td>
            <td>Client 2</td>
            <td>02/01/2023</td>
            <td>En attente</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
