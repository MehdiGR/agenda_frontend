import Image from "next/image";
import { addPrestation } from "@/app/js/agenda_fn";
export default function Prestation({ prestation }: any) {
  const image = prestation.img != null ? prestation.img : "no-image-icon.png";
  return (
    <div
      className="relative w-[200px] h-[200px]"
      onClick={() => addPrestation(prestation)}
    >
      <Image
        src={`http://localhost/agenda/backend/upload/images_articles/${image}`}
        alt={""}
        width={200}
        height={200}
      />

      <div className="absolute bottom-0 p-3 w-full  bg-[rgba(0,0,0,.39)] text-white">
        <p>{prestation.intitule}</p>
        <p></p>
      </div>
    </div>
  );
}
