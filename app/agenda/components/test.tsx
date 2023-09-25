const [totalDuration, setTotalDuration] = useState(0);
const [totalPrice, setTotalPrice] = useState(0);
const handleOptionChangeAg = (selectedOption: any) => {
  setSelectedAgenda(selectedOption);

  // Calculate total duration
  const durationHour = parseInt(selectedOption?.value) || 0;
  const durationMinute = parseInt(selectedOption?.label) || 0;
  const totalDuration = durationHour * 60 + durationMinute;
  setTotalDuration(totalDuration);

  // Calculate total price
  const selectedPrestation = agenda_prestationArr.find((ag_pr) => ag_pr.intitule === selectedOption?.label);
  const totalPrice = selectedPrestation?.prixTTC || 0;
  setTotalPrice(totalPrice);
};
<th className="border-r-2 bg-slate-800 text-white">{`${Math.floor(totalDuration / 60).toString().padStart(2, "0")}:${(totalDuration % 60).toString().padStart(2, "0")}`}</th>
<th className="border-r-2 bg-slate-800 text-white">{totalPrice} DH</th>
// ...

const [totalDuration, setTotalDuration] = useState(0);
const [totalPrice, setTotalPrice] = useState(0);

// ...

const handleOptionChangeAg = (selectedOption: any) => {
  setSelectedAgenda(selectedOption);

  // Calculate total duration
  const durationHour = parseInt(selectedOption?.value) || 0;
  const durationMinute = parseInt(selectedOption?.label) || 0;
  const totalDuration = durationHour * 60 + durationMinute;
  setTotalDuration(totalDuration);

  // Calculate total price
  const selectedPrestation = agenda_prestationArr.find((ag_pr) => ag_pr.intitule === selectedOption?.label);
  const totalPrice = selectedPrestation?.prixTTC || 0;
  setTotalPrice(totalPrice);
};

// ...

<tbody>
  {/* ... */}
</tbody>
<tfoot>
  <tr>
    <th colSpan={2} className="border-r-2 bg-slate-800"></th>
    <th className="border-r-2 bg-slate-800 text-white">{`${Math.floor(totalDuration / 60).toString().padStart(2, "0")}:${(totalDuration % 60).toString().padStart(2, "0")}`}</th>
    <th className="border-r-2 bg-slate-800 text-white">{totalPrice} DH</th>
    <th className="border-r-2 bg-slate-800"></th>
  </tr>
</tfoot>

