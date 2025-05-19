export interface Location {
  latitude: number
  longitude: number
  name: string
}

export interface SensorData {
  timestamp: string
  temperature: number
  humidity: number
  airQualityIndex: number
  windSpeed: number
  precipitation?: number
  uvIndex?: number
  co2?: number
  pm25?: number
  alerts?: string[]
}

export interface Device {
  id: string
  name: string
  type: string
  status: "online" | "offline"
  batteryLevel: number
  signalStrength: number
  location: Location
  lastUpdate: string
  currentReading: SensorData
}

export interface Alert {
  id: string
  deviceId: string
  deviceName: string
  type: string
  severity: "info" | "warning" | "critical"
  title: string
  description: string
  timestamp: string
  acknowledged: boolean
}
