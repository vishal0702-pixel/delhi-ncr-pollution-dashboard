import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Sources() {
  const [sources, setSources] = useState([]);

  // Function to simulate dynamic changes in data
  function generateRandomData() {
    return [
      { type: 'Stubble Burning', contribution: 40 + Math.floor(Math.random() * 10) },
      { type: 'Vehicular', contribution: 25 + Math.floor(Math.random() * 10) },
      { type: 'Industrial', contribution: 15 + Math.floor(Math.random() * 5) },
      { type: 'Construction', contribution: 10 + Math.floor(Math.random() * 3) },
      { type: 'Household Emissions', contribution: 5 + Math.floor(Math.random() * 3) },
      { type: 'Waste Burning', contribution: 5 + Math.floor(Math.random() * 2) },
    ];
  }

  useEffect(() => {
    // Initially set data
    setSources(generateRandomData());

    // Update data every 10 seconds
    const interval = setInterval(() => {
      setSources(generateRandomData());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: sources.map(s => s.type),
    datasets: [
      {
        data: sources.map(s => s.contribution),
        backgroundColor: ['#fb923c', '#22d3ee', '#10b981', '#facc15', '#a78bfa', '#f87171'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-sky-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">
          Source Contribution to Pollution
        </h2>

        {/* Pie Chart */}
        <div className="w-full md:w-96 h-96 mx-auto">
          <Pie data={chartData} />
        </div>

        {/* Info Boxes */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sources.map((s, idx) => (
            <div key={idx} className="bg-orange-50 p-4 rounded-md shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-orange-500 mb-2">{s.type}</h3>
              <p className="text-gray-700">
                Contribution: <span className="font-bold">{s.contribution}%</span>
              </p>
              <p className="text-gray-600 mt-1 text-sm">
                {s.type === 'Stubble Burning' && 'Major regional contributor during harvest season.'}
                {s.type === 'Vehicular' && 'Significant impact due to traffic congestion and peak hours.'}
                {s.type === 'Industrial' && 'Local hotspots around factories and industrial zones.'}
                {s.type === 'Construction' && 'Dust and particulate matter from ongoing projects.'}
                {s.type === 'Household Emissions' && 'Cooking and heating-related pollutants.'}
                {s.type === 'Waste Burning' && 'Open waste burning increases particulate matter in air.'}
              </p>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="mt-8 text-gray-700">
          <h3 className="text-xl font-semibold mb-2">Key Insights:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Stubble burning and vehicular emissions are the largest contributors.</li>
            <li>Industrial and construction emissions affect specific areas more.</li>
            <li>Household emissions and waste burning have minor contributions but still impact local air quality.</li>
            <li>Dynamic monitoring helps citizens and policymakers focus interventions effectively.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
