import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import type { DistributionItem } from "../types/adminDashboard.types"
import DashboardPanel from "./DashboardPanel"
import { useTranslation } from "react-i18next"

function DistributionChart({
  data,
  centerLabel,
}: {
  data: DistributionItem[]
  centerLabel: string
}) {
  const { t } = useTranslation("adminDashboard")
  const total = data.reduce((sum, item) => sum + item.value, 0)

  if (total === 0) {
    return (
      <div className="flex h-60 items-center justify-center text-sm text-text-muted">
        {t("noChartData")}
      </div>
    )
  }

  return (
    <div className="relative h-60">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={88}
            paddingAngle={3}
            stroke="var(--color-background-card)"
            strokeWidth={2}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              borderColor: "var(--color-border)",
              background: "var(--color-background-card)",
              color: "var(--color-text-primary)",
            }}
            labelStyle={{ color: "var(--color-text-primary)" }}
            itemStyle={{ color: "var(--color-text-primary)" }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{
              color: "var(--color-text-secondary)",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-x-0 top-[88px] text-center">
        <p className="text-2xl font-bold text-text-primary">{total.toLocaleString()}</p>
        <p className="text-[10px] uppercase tracking-wide text-text-muted">{centerLabel}</p>
      </div>
    </div>
  )
}

interface AdminDistributionChartsProps {
  roles: DistributionItem[]
  companies: DistributionItem[]
  sampledUsers: boolean
  sampledCompanies: boolean
}

export default function AdminDistributionCharts({
  roles,
  companies,
  sampledUsers,
  sampledCompanies,
}: AdminDistributionChartsProps) {
  const { t } = useTranslation("adminDashboard")
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <DashboardPanel
        title={t("usersByRole")}
        subtitle={
          sampledUsers
            ? t("loadedSample")
            : t("platformDistribution")
        }
      >
        <DistributionChart data={roles} centerLabel={t("usersLoaded")} />
      </DashboardPanel>
      <DashboardPanel
        title={t("companyApprovals")}
        subtitle={
          sampledCompanies
            ? t("statusSample")
            : t("companyOutcomes")
        }
      >
        <DistributionChart data={companies} centerLabel={t("companiesLoaded")} />
      </DashboardPanel>
    </div>
  )
}
