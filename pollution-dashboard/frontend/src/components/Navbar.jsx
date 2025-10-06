import React from 'react';
import { Link } from 'react-router-dom';
export default function Navbar(){
  return (
    <nav className="bg-orange-500 text-white p-4 rounded-md mb-6 flex gap-4 justify-center">
      <Link to="/">Home</Link>
      <Link to="/aqi">AQI</Link>
      <Link to="/sources">Sources</Link>
      <Link to="/forecast">Forecast</Link>
      <Link to="/policy">Policy</Link>
    </nav>
  );
}