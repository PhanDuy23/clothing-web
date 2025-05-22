import { StatsCards } from "../../components/admin/stats-carts"
import { AreaChartComponent, BarChartComponent } from "../../components/admin/chart"

export default function Dashboard() {
  return (
    <div className=" flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-4 h-fit">
        <StatsCards />
        {/* <div className="grid gap-4 md:grid-cols-2">
          <AreaChartComponent />
          <BarChartComponent />
        </div> */}
      </div>
    </div>
  )
}

