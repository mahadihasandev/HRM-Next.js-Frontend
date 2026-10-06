import React from "react";
import { Store, Building2, ShoppingCart, Target } from "lucide-react";
import { StatCard } from "@/components/shared";

interface SndMetricsProps {
  totalCustomers?: number;
  activeDepots?: number;
  todayOrdersCount?: number;
  todayOrderValue?: number;
  monthlyCoverage?: number;
}

export function SndMetrics({
  totalCustomers = 1240,
  activeDepots = 18,
  todayOrdersCount = 84,
  todayOrderValue = 745000,
  monthlyCoverage = 92.4,
}: SndMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Customers"
        value={totalCustomers.toLocaleString()}
        subtitle="+18 new outlets this week"
        variant="blue"
        icon={<Store className="h-5 w-5" />}
        trend={{ value: "+3.2%", isPositive: true }}
      />

      <StatCard
        title="Active Depots"
        value={activeDepots}
        subtitle="Across 5 regional hubs"
        variant="indigo"
        icon={<Building2 className="h-5 w-5" />}
      />

      <StatCard
        title="Today's Orders"
        value={`${todayOrdersCount} Orders`}
        subtitle={`৳${todayOrderValue.toLocaleString()} booked today`}
        variant="emerald"
        icon={<ShoppingCart className="h-5 w-5" />}
        trend={{ value: "+12%", isPositive: true }}
      />

      <StatCard
        title="Monthly Coverage"
        value={`${monthlyCoverage}%`}
        subtitle="Territory reach on track"
        variant="purple"
        icon={<Target className="h-5 w-5" />}
      />
    </div>
  );
}
