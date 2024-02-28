import Image from "next/image";

export default function Prestation({
  prestation,
  addPrestation,
  vendeur,
}: any) {
  const image = prestation.img != null ? prestation.img : "no-image-icon.png";
  const data = {
    line_id: "",
    idproduit: prestation.id_art,
    Designation: prestation.intitule,
    total_ttc: prestation.prixTTC,
    prix: prestation.prixVente,
    pUnet: prestation.prixVente,
    tva_id: prestation.tva_id,
    tva_valeur: prestation.tva_valeur,
    qte: 1,
    qte_retour: 0,
    remise: 0,
    vendeur: vendeur.label,
    vendeurId: vendeur.value,
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
