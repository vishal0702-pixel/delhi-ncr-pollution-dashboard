import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Forecast() {
  const [forecast, setForecast] = useState({ hours: [], aqi: [] });
  const [description, setDescription] = useState("");
  const [stats, setStats] = useState({ max: 0, min: 0, avg: 0 });

  // Function to generate mock AQI forecast data
  function generateForecast() {
    const hours = Array.from({ length: 48 }, (_, i) => i + 1);
    const aqi = hours.map(() => 140 + Math.floor(Math.random() * 60));
    return { hours, aqi };
  }

  // Generate descriptive text
  function generateDescription(aqiData) {
    if (!aqiData.length) return "";
    const maxVal = Math.max(...aqiData);
    const minVal = Math.min(...aqiData);
    const avgVal = Math.round(aqiData.reduce((a, b) => a + b, 0) / aqiData.length);
    setStats({ max: maxVal, min: minVal, avg: avgVal });

    return `Over the next 48 hours, the predicted AQI fluctuates between ${minVal} and ${maxVal}, with an average around ${avgVal}. 
Periods of higher AQI indicate poor air quality; lower AQI represents cleaner air. 
Take precautions during high AQI hours.`;
  }

  useEffect(() => {
    // Initial load
    const data = generateForecast();
    setForecast(data);
    setDescription(generateDescription(data.aqi));

    // Update every 10 seconds
    const interval = setInterval(() => {
      const newData = generateForecast();
      setForecast(newData);
      setDescription(generateDescription(newData.aqi));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: forecast.hours.map(h => `+${h}h`),
    datasets: [
      {
        label: 'Predicted AQI',
        data: forecast.aqi,
        borderColor: '#fb923c',
        backgroundColor: 'rgba(251,146,60,0.3)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="bg-sky-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">
          48h AQI Forecast
        </h2>

        {/* Line Chart */}
        <div className="w-full h-96 mb-6">
          <Line
            data={chartData}
            options={{
              responsive: true,
              animation: { duration: 1000 },
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: false } }
            }}
          />
        </div>

        {/* Dynamic Text Description */}
        <div className="mb-6 text-gray-700 bg-blue-50 p-4 rounded-md shadow">
          <h3 className="text-lg font-semibold mb-2">Chart Summary:</h3>
          <p>{description}</p>
        </div>

        {/* AQI Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-md shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-blue-500 mb-2">Maximum AQI</h3>
            <p className="text-gray-700 font-bold">{stats.max}</p>
            <p className="text-gray-600 text-sm mt-1">Highest predicted pollution level in next 48h</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-blue-500 mb-2">Minimum AQI</h3>
            <p className="text-gray-700 font-bold">{stats.min}</p>
            <p className="text-gray-600 text-sm mt-1">Lowest predicted pollution level in next 48h</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-blue-500 mb-2">Average AQI</h3>
            <p className="text-gray-700 font-bold">{stats.avg}</p>
            <p className="text-gray-600 text-sm mt-1">Mean air quality level in next 48h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
