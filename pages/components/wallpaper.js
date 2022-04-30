import Image from "next/image";

export function Wallpaper({ src: url }) {
  return (
    <Image
      className="bg-neutral-200"
      src={url}
      height={500}
      width={500}
      objectFit="cover"
      alt="picture"
    />
  );
}
