"use client";

import { Queue } from "@/types/queue";
import StatCard from "@/components/ui/StatCard";
import ChartCard from "@/components/ui/ChartCard";
import {
  Users,
  Clock,
  CheckCircle2,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  calculateQueueStats,
  getHourlyQueueData,
  getStatusDistribution,
  calculateAverageWaitTime,
  getBusiestService,
  getPeakHour,
} from "@/lib/dashboardUtils";

interface DashboardViewProps {
  queues: Queue[];
  currentQueue: Queue | null;
}

const COLORS = {
  Menunggu: "#3b82f6", // blue
  Dipanggil: "#10b981", // green
  Selesai: "#6366f1", // indigo
  Dilewati: "#f59e0b", // amber
};

export default function DashboardView({ queues, currentQueue }: DashboardViewProps) {
  const stats = calculateQueueStats(queues);
  const hourlyData = getHourlyQueueData(queues);
  const statusData = getStatusDistribution(queues);
  const avgWaitTime = calculateAverageWaitTime(queues);
  const busiestService = getBusiestService(queues);
  const peakHour = getPeakHour(queues);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Antrian Hari Ini"
          value={stats.totalToday}
          icon={Users}
          gradient="from-blue-500 to-indigo-600"
          trend={{ value: 12, label: "vs kemarin" }}
        />
        <StatCard
          title="Sedang Dilayani"
          value={stats.inService}
          icon={Activity}
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Menunggu"
          value={stats.waiting}
          icon={Clock}
          gradient="from-amber-500 to-orange-600"
        />
        <StatCard
          title="Selesai"
          value={stats.completed}
          icon={CheckCircle2}
          gradient="from-purple-500 to-indigo-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Hourly Queue Chart */}
        <ChartCard
          title="Antrian Harian"
          subtitle="Distribusi antrian per jam hari ini"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="hour"
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Jumlah Antrian"
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Status Distribution Chart */}
        <ChartCard
          title="Status Antrian"
          subtitle="Distribusi status antrian hari ini"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name as keyof typeof COLORS] || "#94a3b8"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ChartCard title="Rata-rata Waktu Tunggu">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{avgWaitTime} menit</p>
              <p className="text-sm text-gray-500">Per antrian</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Poli Terpadat">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-3">
              <Activity className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{busiestService}</p>
              <p className="text-sm text-gray-500">Hari ini</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Jam Sibuk">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-3">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{peakHour}</p>
              <p className="text-sm text-gray-500">Peak hour</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Current Queue Card */}
      {currentQueue && (
        <ChartCard
          title="Antrian Saat Ini"
          subtitle="Sedang dilayani"
        >
          <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Kode Antrian</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {currentQueue.queue_code}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {currentQueue.service_name} • {currentQueue.name}
              </p>
            </div>
            <div className="rounded-full bg-emerald-500 p-4">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
        </ChartCard>
      )}
    </div>
  );
}

