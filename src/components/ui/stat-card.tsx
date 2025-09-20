import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
  style?: React.CSSProperties;
}

export function StatCard({ title, value, icon: Icon, trend, className, style }: StatCardProps) {
  return (
    <Card className={`hover:shadow-hover transition-all duration-300 group ${className}`} style={style}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={`text-xs ${trend.positive ? 'text-agricultural-green' : 'text-destructive'}`}>
                {trend.positive ? '↗' : '↘'} {trend.value}
              </p>
            )}
          </div>
          <div className="bg-gradient-primary p-3 rounded-lg shadow-card group-hover:shadow-glow transition-all duration-300">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}