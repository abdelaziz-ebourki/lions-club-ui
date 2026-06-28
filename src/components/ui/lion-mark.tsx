import { cn } from "@/lib/utils";

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
          d="M24 4C13.5 4 4 13.5 4 24s9.5 20 20 20 20-9.5 20-20S34.5 4 24 4zm0 36c-8.8 0-16-7.2-16-16S15.2 8 24 8s16 7.2 16 16-7.2 16-16 16zm-5-18l-3-2 2-6 6 2s-2 4-2 6h-3zm10 0l3-2-2-6-6 2s2 4 2 6h3zm-5 2c-2.2 0-4 1.8-4 4h8c0-2.2-1.8-4-4-4z"
          className="fill-current"
        />
      ) : (
        <path
          d="M24 4C13.5 4 4 13.5 4 24s9.5 20 20 20 20-9.5 20-20S34.5 4 24 4zm0 36c-8.8 0-16-7.2-16-16S15.2 8 24 8s16 7.2 16 16-7.2 16-16 16zm-5-18l-3-2 2-6 6 2s-2 4-2 6h-3zm10 0l3-2-2-6-6 2s2 4 2 6h3zm-5 2c-2.2 0-4 1.8-4 4h8c0-2.2-1.8-4-4-4z"
          className="stroke-current fill-none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
