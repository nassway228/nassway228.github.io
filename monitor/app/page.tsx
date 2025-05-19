import Dashboard from "@/components/dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">Система мониторинга окружающей среды</h1>
        <p className="text-gray-600 mb-8">Мониторинг и анализ данных с IoT-устройств в реальном времени</p>
        <Dashboard />
      </div>
    </main>
  )
}
