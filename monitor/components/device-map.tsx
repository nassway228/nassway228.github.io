"use client"

import { useState, useEffect } from "react"
import { MapPin, AlertTriangle } from "lucide-react"
import type { Device } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DeviceMapProps {
  devices: Device[]
  selectedDevice: string | null
  onSelectDevice: (deviceId: string) => void
}

export default function DeviceMap({ devices, selectedDevice, onSelectDevice }: DeviceMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!mapLoaded) {
    return <div className="flex justify-center items-center h-full">Загрузка карты...</div>
  }

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-md overflow-hidden">
      {/* Simplified map background */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=800')] bg-cover bg-center opacity-50"></div>

      {/* Map grid lines */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="border border-gray-200 opacity-30"></div>
        ))}
      </div>

      {/* Device markers */}
      {devices.map((device) => {
        const isSelected = device.id === selectedDevice
        const hasAlert = device.currentReading.alerts && device.currentReading.alerts.length > 0

        // Calculate position based on device coordinates
        // This is a simplified example - in a real app, you would use proper map coordinates
        const left = `${((device.location.longitude + 180) / 360) * 100}%`
        const top = `${((90 - device.location.latitude) / 180) * 100}%`

        return (
          <TooltipProvider key={device.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${isSelected ? "z-10 scale-125" : "z-0"}`}
                  style={{ left, top }}
                  onClick={() => onSelectDevice(device.id)}
                >
                  <div className="relative">
                    <MapPin
                      className={`h-8 w-8 ${isSelected ? "text-green-600" : "text-gray-600"} ${device.status === "offline" ? "opacity-50" : "opacity-100"}`}
                      fill={isSelected ? "rgba(22, 163, 74, 0.2)" : "rgba(75, 85, 99, 0.2)"}
                    />
                    {hasAlert && <AlertTriangle className="absolute -top-2 -right-2 h-4 w-4 text-red-500" />}
                    {isSelected && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="p-1">
                  <p className="font-medium">{device.name}</p>
                  <p className="text-xs text-gray-500">{device.location.name}</p>
                  <div className="flex items-center mt-1">
                    <Badge variant={device.status === "online" ? "success" : "destructive"} className="text-xs">
                      {device.status}
                    </Badge>
                    {hasAlert && (
                      <Badge variant="destructive" className="ml-1 text-xs">
                        {device.currentReading.alerts?.length}{" "}
                        {device.currentReading.alerts?.length === 1 ? "оповещение" : "оповещений"}
                      </Badge>
                    )}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}

      {/* Map controls - simplified */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="bg-white p-2 rounded-md shadow-md">
          <span className="text-xl">+</span>
        </button>
        <button className="bg-white p-2 rounded-md shadow-md">
          <span className="text-xl">−</span>
        </button>
      </div>
    </div>
  )
}
