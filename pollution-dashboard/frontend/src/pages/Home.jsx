import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function Home() {
  const [aqiData, setAqiData] = useState([]);
  const [sourcesData, setSourcesData] = useState([]);
  const [forecastData, setForecastData] = useState({ hours: [], aqi: [] });
  const [policyData, setPolicyData] = useState([]);

  useEffect(() => {
    fetch('/api/aqi').then(r => r.json()).then(json => setAqiData(json));
    fetch('/api/sources').then(r => r.json()).then(json => setSourcesData(json));
    fetch('/api/forecast').then(r => r.json()).then(json => setForecastData(json));
    fetch('/api/policy').then(r => r.json()).then(json => setPolicyData(json));
  }, []);

  const aqiChart = {
    labels: aqiData.map(d => d.location),
    datasets: [{ label: 'AQI', data: aqiData.map(d => d.aqi), backgroundColor: 'rgba(251,146,60,0.7)' }]
  };

  const sourcesChart = {
    labels: sourcesData.map(s => s.type),
    datasets: [{ data: sourcesData.map(s => s.contribution), backgroundColor: ['#fb923c','#22d3ee','#10b981','#facc15'] }]
  };

  const forecastChart = {
    labels: forecastData.hours.map(h => `+${h}h`),
    datasets: [{ label: 'Predicted AQI', data: forecastData.aqi, borderColor: '#fb923c', backgroundColor: 'rgba(251,146,60,0.3)', tension: 0.3 }]
  };

  const policyChart = {
    labels: policyData.map(p => p.policy),
    datasets: [{ label: 'Improvement (%)', data: policyData.map(p => p.improvement), backgroundColor: '#22d3ee' }]
  };

  return (
    <div className="space-y-10">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-2">Delhi-NCR Pollution Dashboard</h1>
        <p className="text-gray-700 text-lg">Overview of air quality, sources, forecasts, and policy effectiveness. AI-driven insights for citizens and policymakers.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-2">Hyperlocal AQI</h2>
          <Bar data={aqiChart} />
          <p className="mt-2 text-gray-700 text-sm">
            Shows the Air Quality Index (AQI) for key locations in Delhi-NCR. Higher values indicate more polluted air. Citizens can use this info to plan outdoor activities.
          </p>
        </div>

        <div className="card bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-2">Source Contribution</h2>
          <div className="w-48 mx-auto">
            <Pie data={sourcesChart} />
          </div>
          <p className="mt-2 text-gray-700 text-sm">
            Breakdown of pollution sources: stubble burning, vehicles, industry, and construction. Helps understand which sources contribute most to air pollution.
          </p>
        </div>

        <div className="card bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-2">48h AQI Forecast</h2>
          <Line data={forecastChart} />
          <p className="mt-2 text-gray-700 text-sm">
            Short-term predictions of AQI for the next 48 hours. Useful for planning outdoor work, travel, and public health alerts.
          </p>
        </div>

        <div className="card bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-2">Policy Effectiveness</h2>
          <Bar data={policyChart} />
          <p className="mt-2 text-gray-700 text-sm">
            Shows how various interventions like odd-even rules, construction halts, and firecracker bans improve air quality. Helps policymakers prioritize actions.
          </p>
        </div>
      </section>
    </div>
  );
}
