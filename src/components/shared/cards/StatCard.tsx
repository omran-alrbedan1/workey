interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  sub: string
  change?: number
}
const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon }) => {
  return (
    <div className="relative w-full min-h-40 rounded-[28px] bg-background-card overflow-hidden group">
      <div
        className={
          "absolute inset-0 flex flex-col justify-between p-6 transition-all duration-200 group-hover:scale-[1.01]"
        }
      >
        {/* Top Section */}
        <div className="flex flex-col gap-1">
          <h3 className="text-[18px] font-bold text-primary tracking-[-0.3px] leading-tight m-0">
            {label}
          </h3>
          {sub && <p className="text-[12px] font-medium text-subtitle m-0">{sub}</p>}
        </div>

        <div className="flex items-end justify-between w-full">
          <p className="text-3xl font-bold tracking-[-0.5px] leading-none m-0">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
      </div>

      {/* Icon positioned correctly for RTL/LTR */}
      <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-16 h-16 flex items-center justify-center pointer-events-none">
        <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center pointer-events-auto shadow-sm ltr:translate-x-1 rtl:-translate-x-1 ltr:translate-y-1 rtl:translate-y-1 transition-transform group-hover:scale-105">
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatCard
