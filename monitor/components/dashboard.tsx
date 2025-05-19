"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DeviceMap from "@/components/device-map"
import SensorReadings from "@/components/sensor-readings"
import AirQualityChart from "@/components/air-quality-chart"
import TemperatureHumidityChart from "@/components/temperature-humidity-chart"
import DeviceList from "@/components/device-list"
import { fetchDeviceData, fetchHistoricalData } from "@/lib/api"
import type { Device, SensorData } from "@/lib/types"
import AlertsPanel from "@/components/alerts-panel"

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [currentData, setCurrentData] = useState<SensorData | null>(null)
  const [historicalData, setHistoricalData] = useState<SensorData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial device list
    const initialDevices = fetchDeviceData()
    setDevices(initialDevices)

    if (initialDevices.length > 0) {
      setSelectedDevice(initialDevices[0].id)
    }

    setLoading(false)

    // Set up interval to refresh data
    const interval = setInterval(() => {
      const updatedDevices = fetchDeviceData()
      setDevices(updatedDevices)
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedDevice) {
      // Get current data for selected device
      const deviceData = devices.find((d) => d.id === selectedDevice)
      if (deviceData) {
        setCurrentData(deviceData.currentReading)
      }

      // Get historical data for selected device
      const history = fetchHistoricalData(selectedDevice)
      setHistoricalData(history)
    }
  }, [selectedDevice, devices])

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Загрузка данных...</div>
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Карта устройств</CardTitle>
            <CardDescription>Расположение IoT-устройств мониторинга</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <DeviceMap devices={devices} selectedDevice={selectedDevice} onSelectDevice={handleDeviceSelect} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Устройства</CardTitle>
            <CardDescription>Статус и информация</CardDescription>
          </CardHeader>
          <CardContent>
            <DeviceList devices={devices} selectedDevice={selectedDevice} onSelectDevice={handleDeviceSelect} />
          </CardContent>
        </Card>
      </div>

      {selectedDevice && currentData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Текущие показания</CardTitle>
              <CardDescription>Устройство: {devices.find((d) => d.id === selectedDevice)?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <SensorReadings data={currentData} />
            </CardContent>
          </Card>

          <Tabs defaultValue="temperature" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="temperature">Температура и влажность</TabsTrigger>
              <TabsTrigger value="air">Качество воздуха</TabsTrigger>
              <TabsTrigger value="alerts">Оповещения</TabsTrigger>
            </TabsList>

            <TabsContent value="temperature">
              <Card>
                <CardHeader>
                  <CardTitle>Температура и влажность</CardTitle>
                  <CardDescription>Данные за последние 24 часа</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <TemperatureHumidityChart data={historicalData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="air">
              <Card>
                <CardHeader>
                  <CardTitle>Качество воздуха</CardTitle>
                  <CardDescription>Концентрация загрязняющих веществ</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <AirQualityChart data={historicalData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle>Оповещения</CardTitle>
                  <CardDescription>Предупреждения о превышении пороговых значений</CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertsPanel deviceId={selectedDevice} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
