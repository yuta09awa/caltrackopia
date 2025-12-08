import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  score: number;
  showLabel?: boolean;
  className?: string;
}

const getConfidenceLevel = (score: number) => {
  if (score >= 0.85) return { label: 'High Confidence', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-100' };
  if (score >= 0.65) return { label: 'Medium Confidence', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-100' };
  if (score >= 0.45) return { label: 'Low Confidence', color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-100' };
  return { label: 'Estimate Only', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-100' };
};

const ConfidenceBadge = ({ score, showLabel = true, className }: ConfidenceBadgeProps) => {
  const { label, color, textColor, bgLight } = getConfidenceLevel(score);
  const percentage = Math.round(score * 100);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("w-3 h-3 rounded-full", color)} />
      {showLabel && (
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", bgLight, textColor)}>
          {label} ({percentage}%)
        </span>
      )}
    </div>
  );
};

export default ConfidenceBadge;
