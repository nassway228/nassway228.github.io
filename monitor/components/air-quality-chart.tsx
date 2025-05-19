"use client"

import { useState } from "react"
import type { SensorData } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface AirQualityChartProps {
  data: SensorData[]
}

export default function AirQualityChart({ data }: AirQualityChartProps) {
  const [pollutant, setPollutant] = useState("all")

  // Format data for the chart
  const formatData = (data: SensorData[]) => {
    return data.map((item) => {
      const time = new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      return {
        time,
        AQI: item.airQualityIndex,
        "PM2.5": item.pm25 || 0,
        "CO₂": item.co2 ? item.co2 / 10 : 0, // Scale down CO2 for better visualization
      }
    })
  }

  const chartData = formatData(data)

  const getAirQualityColor = (aqi: number) => {
    if (aqi <= 50) return "#10b981" // Green
    if (aqi <= 100) return "#f59e0b" // Yellow
    if (aqi <= 150) return "#f97316" // Orange
    if (aqi <= 200) return "#ef4444" // Red
    if (aqi <= 300) return "#8b5cf6" // Purple
    return "#e11d48" // Dark red
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">Данные о качестве воздуха за последние 24 часа</div>

        <Select value={pollutant} onValueChange={setPollutant}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Выберите показатель" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все показатели</SelectItem>
            <SelectItem value="aqi">Индекс качества воздуха</SelectItem>
            <SelectItem value="pm25">PM2.5</SelectItem>
            <SelectItem value="co2">CO₂</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
            <YAxis />
            <Tooltip />
            <Legend />
            {(pollutant === "all" || pollutant === "aqi") && (
              <Bar dataKey="AQI" name="Индекс качества воздуха" fill="#8884d8" />
            )}
            {(pollutant === "all" || pollutant === "pm25") && (
              <Bar dataKey="PM2.5" name="PM2.5 (мкг/м³)" fill="#82ca9d" />
            )}
            {(pollutant === "all" || pollutant === "co2") && <Bar dataKey="CO₂" name="CO₂ (ppm/10)" fill="#ffc658" />}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Индекс качества воздуха (AQI):</h4>
        <div className="grid grid-cols-6 gap-1 text-xs">
          <div className="flex flex-col items-center">
            <div className="w-full h-2 bg-green-500 rounded"></div>
            <span>0-50</span>
            <span className="text-green-600">Хороший</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-2 bg-yellow-500 rounded"></div>
            <span>51-100</span>
            <span className="text-yellow-600">Умеренный</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-2 bg-orange-500 rounded"></div>
            <span>101-150</span>
            <span className="text-orange-600">Вредный*</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-2 bg-red-500 rounded"></div>
            <span>151-200</span>
            <span className="text-red-600">Вредный</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-2 bg-purple-500 rounded"></div>
            <span>201-300</span>
            <span className="text-purple-600">Очень вредный</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-2 bg-rose-600 rounded"></div>
            <span>301+</span>
            <span className="text-rose-600">Опасный</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">* Вредный для чувствительных групп</p>
      </div>
    </div>
  )
}
