import type { Device, SensorData, Alert } from "./types"

// Mock data for devices
const mockDevices: Device[] = [
  {
    id: "device-001",
    name: "Метеостанция №1",
    type: "weather",
    status: "online",
    batteryLevel: 87,
    signalStrength: 92,
    location: {
      latitude: 55.7558,
      longitude: 37.6173,
      name: "Центральный парк",
    },
    lastUpdate: new Date().toISOString(),
    currentReading: {
      timestamp: new Date().toISOString(),
      temperature: 22.5,
      humidity: 65,
      airQualityIndex: 42,
      windSpeed: 3.2,
      precipitation: 0,
      uvIndex: 3,
      co2: 420,
      pm25: 12,
      alerts: [],
    },
  },
  {
    id: "device-002",
    name: "Метеостанция №2",
    type: "weather",
    status: "online",
    batteryLevel: 54,
    signalStrength: 78,
    location: {
      latitude: 55.7439,
      longitude: 37.6282,
      name: "Городской сквер",
    },
    lastUpdate: new Date().toISOString(),
    currentReading: {
      timestamp: new Date().toISOString(),
      temperature: 23.1,
      humidity: 58,
      airQualityIndex: 87,
      windSpeed: 2.1,
      precipitation: 0,
      uvIndex: 4,
      co2: 480,
      pm25: 28,
      alerts: ["air_quality"],
    },
  },
  {
    id: "device-003",
    name: "Метеостанция №3",
    type: "weather",
    status: "offline",
    batteryLevel: 12,
    signalStrength: 23,
    location: {
      latitude: 55.7522,
      longitude: 37.6156,
      name: "Промышленная зона",
    },
    lastUpdate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    currentReading: {
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      temperature: 24.8,
      humidity: 45,
      airQualityIndex: 132,
      windSpeed: 1.5,
      precipitation: 0,
      uvIndex: 2,
      co2: 620,
      pm25: 45,
      alerts: ["air_quality", "temperature"],
    },
  },
  {
    id: "device-004",
    name: "Метеостанция №4",
    type: "weather",
    status: "online",
    batteryLevel: 92,
    signalStrength: 95,
    location: {
      latitude: 55.7614,
      longitude: 37.6089,
      name: "Жилой район",
    },
    lastUpdate: new Date().toISOString(),
    currentReading: {
      timestamp: new Date().toISOString(),
      temperature: 21.7,
      humidity: 62,
      airQualityIndex: 56,
      windSpeed: 2.8,
      precipitation: 0.2,
      uvIndex: 2,
      co2: 450,
      pm25: 18,
      alerts: [],
    },
  },
]

// Generate random historical data
const generateHistoricalData = (deviceId: string): SensorData[] => {
  const device = mockDevices.find((d) => d.id === deviceId)
  if (!device) return []

  const data: SensorData[] = []
  const now = new Date()

  // Generate data for the last 24 hours
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString()
    const baseTemp = device.currentReading.temperature
    const baseHumidity = device.currentReading.humidity
    const baseAQI = device.currentReading.airQualityIndex

    // Add some random variation
    const temp = baseTemp + (Math.random() * 6 - 3)
    const humidity = Math.max(30, Math.min(95, baseHumidity + (Math.random() * 20 - 10)))
    const aqi = Math.max(20, Math.min(300, baseAQI + (Math.random() * 40 - 20)))
    const windSpeed = Math.max(0.5, Math.min(8, device.currentReading.windSpeed + (Math.random() * 2 - 1)))

    // Time-based variations
    const hourOfDay = new Date(timestamp).getHours()
    const tempAdjustment = hourOfDay > 12 && hourOfDay < 18 ? 2 : hourOfDay < 6 ? -2 : 0

    data.push({
      timestamp,
      temperature: Number.parseFloat((temp + tempAdjustment).toFixed(1)),
      humidity: Math.round(humidity),
      airQualityIndex: Math.round(aqi),
      windSpeed: Number.parseFloat(windSpeed.toFixed(1)),
      precipitation: Math.random() > 0.8 ? Number.parseFloat((Math.random() * 0.5).toFixed(1)) : 0,
      uvIndex: hourOfDay > 10 && hourOfDay < 16 ? Math.round(Math.random() * 5 + 1) : Math.round(Math.random() * 2),
      co2: Math.round(400 + Math.random() * 300),
      pm25: Math.round(10 + Math.random() * 50),
      alerts: [],
    })
  }

  return data
}

// Mock alerts
const mockAlerts: Alert[] = [
  {
    id: "alert-001",
    deviceId: "device-002",
    deviceName: "Метеостанция №2",
    type: "air_quality",
    severity: "warning",
    title: "Повышенный уровень загрязнения воздуха",
    description:
      "Индекс качества воздуха превысил пороговое значение 80. Рекомендуется ограничить пребывание на открытом воздухе.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-002",
    deviceId: "device-003",
    deviceName: "Метеостанция №3",
    type: "temperature",
    severity: "critical",
    title: "Критическая температура",
    description: "Зафиксирована аномально высокая температура 24.8°C. Возможно неисправность датчика.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    acknowledged: true,
  },
  {
    id: "alert-003",
    deviceId: "device-003",
    deviceName: "Метеостанция №3",
    type: "air_quality",
    severity: "critical",
    title: "Опасный уровень загрязнения воздуха",
    description:
      "Индекс качества воздуха достиг критического значения 132. Рекомендуется избегать пребывания на открытом воздухе.",
    timestamp: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-004",
    deviceId: "device-004",
    deviceName: "Метеостанция №4",
    type: "humidity",
    severity: "info",
    title: "Повышенная влажность",
    description: "Уровень влажности превысил 60%. Возможны осадки.",
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    acknowledged: true,
  },
]

// API functions
export const fetchDeviceData = (): Device[] => {
  // In a real app, this would be an API call
  // Simulate some random changes to the data
  return mockDevices.map((device) => {
    if (device.status === "offline") return device

    const temp = device.currentReading.temperature + (Math.random() * 0.6 - 0.3)
    const humidity = Math.max(30, Math.min(95, device.currentReading.humidity + (Math.random() * 4 - 2)))
    const aqi = Math.max(20, Math.min(300, device.currentReading.airQualityIndex + (Math.random() * 6 - 3)))

    return {
      ...device,
      batteryLevel: Math.max(0, device.batteryLevel - Math.random() * 0.1),
      lastUpdate: new Date().toISOString(),
      currentReading: {
        ...device.currentReading,
        timestamp: new Date().toISOString(),
        temperature: Number.parseFloat(temp.toFixed(1)),
        humidity: Math.round(humidity),
        airQualityIndex: Math.round(aqi),
      },
    }
  })
}

export const fetchHistoricalData = (deviceId: string): SensorData[] => {
  // In a real app, this would be an API call
  return generateHistoricalData(deviceId)
}

export const fetchAlerts = (deviceId: string): Alert[] => {
  // In a real app, this would be an API call
  return mockAlerts.filter((alert) => alert.deviceId === deviceId)
}
