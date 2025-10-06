import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AQI from './pages/AQI';
import Sources from './pages/Sources';
import Forecast from './pages/Forecast';
import Policy from './pages/Policy';

export default function App(){
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/aqi" element={<AQI/>}/>
          <Route path="/sources" element={<Sources/>}/>
          <Route path="/forecast" element={<Forecast/>}/>
          <Route path="/policy" element={<Policy/>}/>
        </Routes>
      </div>
    </div>
  );
}