import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Policy() {
  const [policy, setPolicy] = useState([]);
  const [description, setDescription] = useState("");

  // Function to generate dynamic policy data
  function generatePolicyData() {
    return [
      { policy: 'Odd-Even', improvement: 10 + Math.floor(Math.random() * 5), description: 'Reduces vehicular emissions by alternating driving days.' },
      { policy: 'Firecracker Ban', improvement: 5 + Math.floor(Math.random() * 3), description: 'Reduces short-term spike in particulate matter during festivals.' },
      { policy: 'Construction Halt', improvement: 12 + Math.floor(Math.random() * 5), description: 'Minimizes dust and PM from ongoing construction sites.' },
      { policy: 'Stubble Control', improvement: 20 + Math.floor(Math.random() * 5), description: 'Targets major seasonal contributor from crop residue burning.' },
    ];
  }

  // Function to generate text summary based on policy data
  function generateDescription(data) {
    const topPolicy = data.reduce((prev, curr) => (curr.improvement > prev.improvement ? curr : prev), data[0]);
    const lowPolicy = data.reduce((prev, curr) => (curr.improvement < prev.improvement ? curr : prev), data[0]);
    return `Currently, the most effective policy is "${topPolicy.policy}" with estimated improvement of ${topPolicy.improvement}%. 
The least effective is "${lowPolicy.policy}" with ${lowPolicy.improvement}%. 
Overall, implementing these policies together can significantly reduce air pollution in Delhi-NCR.`;
  }

  useEffect(() => {
    // Initial load
    const data = generatePolicyData();
    setPolicy(data);
    setDescription(generateDescription(data));

    // Update every 10 seconds without page refresh
    const interval = setInterval(() => {
      const newData = generatePolicyData();
      setPolicy(newData);
      setDescription(generateDescription(newData));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: policy.map(p => p.policy),
    datasets: [
      {
        label: 'Improvement (%)',
        data: policy.map(p => p.improvement),
        backgroundColor: ['#22d3ee', '#fbbf24', '#10b981', '#f87171'],
      },
    ],
  };

  return (
    <div className="bg-sky-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">
          Policy Effectiveness Dashboard
        </h2>

        {/* Bar Chart */}
        <div className="w-full h-96 mb-6">
          <Bar 
            data={chartData} 
            options={{
              responsive: true,
              animation: { duration: 1000 },
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }} 
          />
        </div>

        {/* Dynamic Text Description */}
        <div className="mb-8 text-gray-700 bg-blue-50 p-4 rounded-md shadow">
          <h3 className="text-lg font-semibold mb-2">Chart Summary:</h3>
          <p>{description}</p>
        </div>

        {/* Policy Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {policy.map((p, idx) => (
            <div key={idx} className="bg-blue-50 p-4 rounded-md shadow hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-blue-500 mb-2">{p.policy}</h3>
              <p className="text-gray-700">Estimated Improvement: <span className="font-bold">{p.improvement}%</span></p>
              <p className="text-gray-600 mt-1 text-sm">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
