"use client"

import { useState, useEffect } from "react"
import { fetchAlerts } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, ThermometerIcon, Droplets, Gauge, Wind } from "lucide-react"

interface AlertsPanelProps {
  deviceId: string
}

export default function AlertsPanel({ deviceId }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true)
      const data = fetchAlerts(deviceId)
      setAlerts(data)
      setLoading(false)
    }

    loadAlerts()

    // Set up interval to refresh alerts
    const interval = setInterval(() => {
      loadAlerts()
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [deviceId])

  if (loading) {
    return <div className="flex justify-center items-center h-32">Загрузка оповещений...</div>
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <AlertTriangle className="h-8 w-8 text-gray-400" />
        </div>
        <p>Нет активных оповещений</p>
      </div>
    )
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return <ThermometerIcon className="h-5 w-5" />
      case "humidity":
        return <Droplets className="h-5 w-5" />
      case "air_quality":
        return <Gauge className="h-5 w-5" />
      case "wind":
        return <Wind className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getAlertVariant = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "warning":
        return "warning"
      default:
        return "default"
    }
  }

  return (
    <ScrollArea className="h-[350px] pr-4">
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Alert key={alert.id} variant={getAlertVariant(alert.severity)}>
            <div className="flex items-start">
              {getAlertIcon(alert.type)}
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <AlertTitle>{alert.title}</AlertTitle>
                  <Badge variant={getAlertVariant(alert.severity)}>{alert.severity}</Badge>
                </div>
                <AlertDescription>
                  <p>{alert.description}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>Устройство: {alert.deviceName}</span>
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ))}
      </div>
    </ScrollArea>
  )
}
