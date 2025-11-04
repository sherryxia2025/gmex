import type { FC, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import "./index.css";

export interface ClipTextProps {
  className?: string;
  image: string;
  strokeColor?: string;
}

export const ClipText: FC<PropsWithChildren<ClipTextProps>> = ({
  children,
  className,
  image,
  strokeColor = "#F7C600",
}) => {
  return (
    <span
      style={{ backgroundImage: `url(${image})`, lineHeight: 1.4 }}
      className={cn(
        `clip-text-selection block relative text-4xl bg-center bg-no-repeat bg-cover font-bold text-transparent bg-clip-text`,
        className,
      )}
    >
      {children}
      <span
        style={{ WebkitTextStroke: `1px ${strokeColor}` }}
        className="clip-text-stroke absolute left-[2px] right-0 -top-[2px]"
      >
        {children}
      </span>
    </span>
  );
};
