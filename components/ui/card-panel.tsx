import { cn } from "@/lib/utils/utils";

export function CardPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-sm p-4 text-ananta-text bg-ananta-surface/50 backdrop-blur-lg border border-ananta-border/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {children}
    </div>
  );
}
