import Image from "next/image";
import type { ImageBlockValue } from "../../types";
import { urlFor } from "../../services/image";

interface ImageBlockProps {
  value: ImageBlockValue;
}

export default function ImageBlock({ value }: ImageBlockProps) {
  const imageUrl = urlFor(value.image).width(1400).fit("max").auto("format").url();

  return (
    <figure className="my-10">
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-slate-800 shadow-sm">
        <Image
          src={imageUrl}
          alt={value.alt}
          width={1400}
          height={0}
          style={{ width: "100%", height: "auto" }}
          className="rounded-xl"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      {value.caption && (
        <figcaption className="text-center text-sm text-gray-400 dark:text-slate-500 mt-3 italic">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}
