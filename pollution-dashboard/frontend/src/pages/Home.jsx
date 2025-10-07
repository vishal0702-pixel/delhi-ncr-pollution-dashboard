
import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [aqiData, setAqiData] = useState([]);
  const [sourcesData, setSourcesData] = useState([]);
  const [forecastData, setForecastData] = useState({ hours: [], aqi: [] });
  const [policyData, setPolicyData] = useState([]);

  // ✅ Fetch from backend if available, otherwise use dummy fallback
  useEffect(() => {
    const backend = 'https://delhi-ncr-backend.vercel.app';

    const safeFetch = async (url, setState, fallback) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        setState(data);
      } catch {
        setState(fallback);
      }
    };

    safeFetch(`${backend}/api/aqi`, setAqiData, [
      { location: 'Delhi', aqi: 220 },
      { location: 'Noida', aqi: 180 },
      { location: 'Gurugram', aqi: 150 },
      { location: 'Faridabad', aqi: 200 },
      { location: 'Ghaziabad', aqi: 190 }
    ]);

    safeFetch(`${backend}/api/sources`, setSourcesData, [
      { type: 'Vehicles', contribution: 40 },
      { type: 'Industry', contribution: 25 },
      { type: 'Construction', contribution: 20 },
      { type: 'Stubble Burning', contribution: 15 }
    ]);

    safeFetch(`${backend}/api/forecast`, setForecastData, {
      hours: [0, 6, 12, 18, 24, 30, 36, 42, 48],
      aqi: [210, 205, 190, 170, 160, 165, 180, 190, 200]
    });

    safeFetch(`${backend}/api/policy`, setPolicyData, [
      { policy: 'Odd-Even Rule', improvement: 15 },
      { policy: 'Firecracker Ban', improvement: 10 },
      { policy: 'Construction Halt', improvement: 12 },
      { policy: 'Industrial Control', improvement: 18 }
    ]);
  }, []);

  // ✅ Chart data configurations
  const aqiChart = {
    labels: aqiData.map((d) => d.location),
    datasets: [
      {
        label: 'AQI',
        data: aqiData.map((d) => d.aqi),
        backgroundColor: 'rgba(251,146,60,0.7)'
      }
    ]
  };

  const sourcesChart = {
    labels: sourcesData.map((s) => s.type),
    datasets: [
      {
        data: sourcesData.map((s) => s.contribution),
        backgroundColor: ['#fb923c', '#22d3ee', '#10b981', '#facc15']
      }
    ]
  };

  const forecastChart = {
    labels: forecastData.hours.map((h) => `+${h}h`),
    datasets: [
      {
        label: 'Predicted AQI',
        data: forecastData.aqi,
        borderColor: '#fb923c',
        backgroundColor: 'rgba(251,146,60,0.3)',
        tension: 0.3
      }
    ]
  };

  const policyChart = {
    labels: policyData.map((p) => p.policy),
    datasets: [
      {
        label: 'Improvement (%)',
        data: policyData.map((p) => p.improvement),
        backgroundColor: '#22d3ee'
      }
    ]
  };

  return (
    <div className="space-y-10 px-6 py-10 bg-gray-50 min-h-screen">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Delhi-NCR Pollution Dashboard</h1>
        <p className="text-gray-700 text-lg">
          Overview of air quality, sources, forecasts, and policy effectiveness. AI-driven insights for
          citizens and policymakers.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AQI Bar Chart */}
        <div className="card bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Hyperlocal AQI</h2>
          <Bar data={aqiChart} />
          <p className="mt-3 text-gray-600 text-sm">
            Shows the Air Quality Index (AQI) for key locations in Delhi-NCR. Higher values indicate more
            polluted air.
          </p>
        </div>

        {/* Source Pie Chart */}
        <div className="card bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Source Contribution</h2>
          <div className="w-56 mx-auto">
            <Pie data={sourcesChart} />
          </div>
          <p className="mt-3 text-gray-600 text-sm">
            Breakdown of pollution sources: vehicles, industry, construction, and stubble burning.
          </p>
        </div>

        {/* Forecast Line Chart */}
        <div className="card bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">48h AQI Forecast</h2>
          <Line data={forecastChart} />
          <p className="mt-3 text-gray-600 text-sm">
            Short-term predictions of AQI for the next 48 hours. Useful for planning outdoor work and
            health alerts.
          </p>
        </div>

        {/* Policy Effectiveness Bar Chart */}
        <div className="card bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Policy Effectiveness</h2>
          <Bar data={policyChart} />
          <p className="mt-3 text-gray-600 text-sm">
            Shows how interventions like odd-even rules, bans, and halts improve air quality.
          </p>
        </div>
      </section>
    </div>
  );
}

