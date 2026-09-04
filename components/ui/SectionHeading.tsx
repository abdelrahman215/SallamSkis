import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  light?: boolean;
}

export function SectionHeading({
  label,
  title,
  description,
  className,
  light,
}: SectionHeadingProps) {
  return (
    <div className={cn("text-center max-w-3xl mx-auto mb-14", className)}>
      {label && (
        <span className="inline-block text-orange-400 text-sm font-semibold tracking-widest uppercase mb-3">
          {label}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl sm:text-4xl lg:text-5xl font-bold mb-4",
          light ? "text-white" : "text-white"
        )}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {description && (
        <p className="text-white/60 text-lg leading-relaxed">{description}</p>
      )}
    </div>
  );
}
