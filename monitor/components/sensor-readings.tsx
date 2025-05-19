"use client"

import type { SensorData } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { ThermometerIcon, Droplets, Wind, Gauge, CloudRain, Sun, Leaf } from "lucide-react"

interface SensorReadingsProps {
  data: SensorData
}

export default function SensorReadings({ data }: SensorReadingsProps) {
  const getAirQualityLabel = (aqi: number) => {
    if (aqi <= 50) return { label: "Хорошее", color: "text-green-600" }
    if (aqi <= 100) return { label: "Умеренное", color: "text-yellow-600" }
    if (aqi <= 150) return { label: "Вредное для чувствительных групп", color: "text-orange-600" }
    if (aqi <= 200) return { label: "Вредное", color: "text-red-600" }
    if (aqi <= 300) return { label: "Очень вредное", color: "text-purple-600" }
    return { label: "Опасное", color: "text-rose-600" }
  }

  const airQuality = getAirQualityLabel(data.airQualityIndex)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <ThermometerIcon className="h-8 w-8 text-orange-500 mb-2" />
          <h3 className="text-sm font-medium text-gray-500">Температура</h3>
          <p className="text-2xl font-bold">{data.temperature}°C</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Droplets className="h-8 w-8 text-blue-500 mb-2" />
          <h3 className="text-sm font-medium text-gray-500">Влажность</h3>
          <p className="text-2xl font-bold">{data.humidity}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Gauge className="h-8 w-8 text-purple-500 mb-2" />
          <h3 className="text-sm font-medium text-gray-500">Качество воздуха</h3>
          <p className="text-2xl font-bold">{data.airQualityIndex}</p>
          <p className={`text-xs ${airQuality.color}`}>{airQuality.label}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Wind className="h-8 w-8 text-teal-500 mb-2" />
          <h3 className="text-sm font-medium text-gray-500">Скорость ветра</h3>
          <p className="text-2xl font-bold">{data.windSpeed} м/с</p>
        </CardContent>
      </Card>

      {data.precipitation !== undefined && (
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <CloudRain className="h-8 w-8 text-blue-400 mb-2" />
            <h3 className="text-sm font-medium text-gray-500">Осадки</h3>
            <p className="text-2xl font-bold">{data.precipitation} мм</p>
          </CardContent>
        </Card>
      )}

      {data.uvIndex !== undefined && (
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Sun className="h-8 w-8 text-yellow-500 mb-2" />
            <h3 className="text-sm font-medium text-gray-500">УФ-индекс</h3>
            <p className="text-2xl font-bold">{data.uvIndex}</p>
          </CardContent>
        </Card>
      )}

      {data.co2 !== undefined && (
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Leaf className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="text-sm font-medium text-gray-500">CO₂</h3>
            <p className="text-2xl font-bold">{data.co2} ppm</p>
          </CardContent>
        </Card>
      )}

      {data.pm25 !== undefined && (
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="h-8 w-8 flex items-center justify-center text-gray-500 mb-2 font-bold">
              PM<span className="text-xs align-bottom">2.5</span>
            </div>
            <h3 className="text-sm font-medium text-gray-500">PM2.5</h3>
            <p className="text-2xl font-bold">{data.pm25} мкг/м³</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
