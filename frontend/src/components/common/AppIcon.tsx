"use client";

import Image from "next/image";
import { useThemeMode } from "@/context/ThemeContext";

type Props = {
  name: string;
  alt: string;
  size?: number;
};

export default function AppIcon({ name, alt, size = 24 }: Props) {
  const { theme } = useThemeMode();

  return (
    <div className="flex items-center justify-center overflow-hidden rounded-md">
      <Image
        src={`/assets/icons/${theme}/${name}.png`}
        alt={alt}
        width={size}
        height={size}
        className="h-auto w-auto object-contain"
      />
    </div>
  );
}