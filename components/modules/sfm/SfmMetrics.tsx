import React from "react";
import { Target, TrendingUp, Award, Users } from "lucide-react";
import { StatCard } from "@/components/shared";

interface SfmMetricsProps {
  totalAssignedTarget?: number;
  totalCommitmentValue?: number;
  achievedValueToDate?: number;
  achievementRate?: string;
  totalFieldForce?: number;
}

export function SfmMetrics({
  totalAssignedTarget = 45000000,
  totalCommitmentValue = 42800000,
  achievedValueToDate = 31250000,
  achievementRate = "73.0%",
  totalFieldForce = 32,
}: SfmMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Assigned Target"
        value={`৳${(totalAssignedTarget / 1000000).toFixed(1)}M`}
        subtitle={`Across ${totalFieldForce} officers`}
        variant="indigo"
        icon={<Target className="h-5 w-5" />}
      />

      <StatCard
        title="Commitment"
        value={`৳${(totalCommitmentValue / 1000000).toFixed(1)}M`}
        subtitle="95.1% commitment ratio"
        variant="blue"
        icon={<TrendingUp className="h-5 w-5" />}
        trend={{ value: "+4.2%", isPositive: true }}
      />

      <StatCard
        title="Achieved to Date"
        value={`৳${(achievedValueToDate / 1000000).toFixed(2)}M`}
        subtitle={`${achievementRate} MTD achievement rate`}
        variant="emerald"
        icon={<Award className="h-5 w-5" />}
        trend={{ value: achievementRate, isPositive: true }}
      />

      <StatCard
        title="Field Force"
        value={`${totalFieldForce} SRs`}
        subtitle="30 checked in today"
        variant="purple"
        icon={<Users className="h-5 w-5" />}
      />
    </div>
  );
}
