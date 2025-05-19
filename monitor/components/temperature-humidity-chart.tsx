"use client"

import { useState } from "react"
import type { SensorData } from "@/lib/types"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TemperatureHumidityChartProps {
  data: SensorData[]
}

export default function TemperatureHumidityChart({ data }: TemperatureHumidityChartProps) {
  const [timeRange, setTimeRange] = useState("24h")

  // Format data for the chart
  const formatData = (data: SensorData[]) => {
    return data.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temperature: item.temperature,
      humidity: item.humidity,
    }))
  }

  // Filter data based on selected time range
  const getFilteredData = () => {
    if (timeRange === "24h") return formatData(data)
    if (timeRange === "12h") return formatData(data.slice(-12))
    if (timeRange === "6h") return formatData(data.slice(-6))
    return formatData(data)
  }

  const chartData = getFilteredData()

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="combined" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="combined">Комбинированный</TabsTrigger>
            <TabsTrigger value="temperature">Температура</TabsTrigger>
            <TabsTrigger value="humidity">Влажность</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Выберите период" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6h">Последние 6 часов</SelectItem>
            <SelectItem value="12h">Последние 12 часов</SelectItem>
            <SelectItem value="24h">Последние 24 часа</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" orientation="left" domain={[-10, 50]} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              name="Температура (°C)"
              stroke="#ff7300"
              activeDot={{ r: 8 }}
            />
            <Line yAxisId="right" type="monotone" dataKey="humidity" name="Влажность (%)" stroke="#0088fe" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
