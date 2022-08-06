import Image from "next/image";


type WallpaperProps = {url: string}
export function Wallpaper({ url } : WallpaperProps) {
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
