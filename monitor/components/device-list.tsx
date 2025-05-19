"use client"

import type { Device } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Battery, Signal, AlertTriangle, ThermometerIcon, Droplets } from "lucide-react"

interface DeviceListProps {
  devices: Device[]
  selectedDevice: string | null
  onSelectDevice: (deviceId: string) => void
}

export default function DeviceList({ devices, selectedDevice, onSelectDevice }: DeviceListProps) {
  return (
    <ScrollArea className="h-[350px] pr-4">
      <div className="space-y-4">
        {devices.map((device) => {
          const isSelected = device.id === selectedDevice
          const hasAlert = device.currentReading.alerts && device.currentReading.alerts.length > 0

          return (
            <div
              key={device.id}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? "bg-green-50 border border-green-200"
                  : "bg-white border border-gray-100 hover:border-gray-200"
              }`}
              onClick={() => onSelectDevice(device.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{device.name}</h3>
                  <p className="text-xs text-gray-500">{device.location.name}</p>
                </div>
                <Badge variant={device.status === "online" ? "success" : "destructive"}>{device.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Battery className="h-4 w-4" />
                  <span>{device.batteryLevel}%</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Signal className="h-4 w-4" />
                  <span>{device.signalStrength}%</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <ThermometerIcon className="h-4 w-4" />
                  <span>{device.currentReading.temperature}°C</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Droplets className="h-4 w-4" />
                  <span>{device.currentReading.humidity}%</span>
                </div>
              </div>

              {hasAlert && (
                <div className="mt-2 p-1.5 bg-red-50 rounded border border-red-100 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-red-600">
                    {device.currentReading.alerts?.length}{" "}
                    {device.currentReading.alerts?.length === 1 ? "оповещение" : "оповещений"}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
