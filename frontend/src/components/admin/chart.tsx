import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const areaData = [
  { month: "Tháng 1", series1: 40, series2: 24, series3: 35 },
  { month: "Tháng 2", series1: 30, series2: 28, series3: 25 },
  { month: "Tháng 3", series1: 45, series2: 32, series3: 40 },
  { month: "Tháng 4", series1: 50, series2: 35, series3: 45 },
  { month: "Tháng 5", series1: 35, series2: 40, series3: 30 },
  { month: "Tháng 6", series1: 55, series2: 45, series3: 50 },
]

const barData = [
  { month: "Tháng 1", value1: 400, value2: 300 },
  { month: "Tháng 2", value1: 300, value2: 400 },
  { month: "Tháng 3", value1: 500, value2: 350 },
  { month: "Tháng 4", value1: 450, value2: 450 },
  { month: "Tháng 5", value1: 470, value2: 480 },
  { month: "Tháng 6", value1: 600, value2: 550 },
]

export function AreaChartComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dữ liệu 6 tháng đầu vào</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={areaData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Area type="monotone" dataKey="series1" stackId="1" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="series2" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            <Area type="monotone" dataKey="series3" stackId="1" stroke="#ffc658" fill="#ffc658" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function BarChartComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê 6 tháng doanh thu</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Bar dataKey="value1" fill="#8884d8" />
            <Bar dataKey="value2" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

