import Image from "next/image";

export default function Prestation({ prestation, addPrestation }) {
  const image = prestation.img != null ? prestation.img : "no-image-icon.png";

  const data = {
    id: "",
    idClient: "",
    client: "",
    dateRes: "",
    heurDB: "",
    note: "",
    prest_heurDB: "",
    prest_idAgenda: "",
    prest_agenda: "",
    ligne_id: "",
    duree: prestation.duree,
    prest_title: prestation.intitule,
    prest_prix_ttc: prestation.prixTTC,
    prest_id: prestation.id,
    prest_duree: prestation.prest_duree,
  };
  return (
    //  addPrestation(prestation)
    <div
      className="relative w-[200px] h-[200px] border border-gray-700  "
      onClick={() => addPrestation(data)}
    >
      <Image
        src={`http://localhost/agenda/backend/upload/images_articles/${image}`}
        alt={""}
        width={200}
        height={200}
      />

      <div className="absolute bottom-0 left-0 p-3 w-full  bg-[rgba(0,0,0,.39)] text-white">
        <p>{prestation.intitule}</p>
        <p></p>
      </div>
    </div>
  );
}
