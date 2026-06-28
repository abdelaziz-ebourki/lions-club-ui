import { cn } from "@/lib/utils";
import { LION_SVG_PATH } from "./lion-path";

interface LionMarkProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "outline" | "filled" | "watermark";
  className?: string;
}

const sizeMap = {
  sm: "size-4",
  md: "size-6",
  lg: "size-10",
  xl: "size-16",
};

export function LionMark({ size = "md", variant = "outline", className }: LionMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        sizeMap[size],
        variant === "watermark" && "opacity-5",
        "transition-all duration-300",
        className
      )}
      aria-hidden="true"
    >
      {variant === "filled" ? (
        <path
          d={LION_SVG_PATH}
          className="fill-current"
        />
      ) : (
        <path
          d={LION_SVG_PATH}
          className="stroke-current fill-none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
