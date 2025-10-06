/**
 * run this with: node create_sih_project.js
 * It will scaffold the full SIH Pollution Dashboard project
 */
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(process.cwd(), "pollution-dashboard");
const backendPath = path.join(projectRoot, "backend");
const frontendPath = path.join(projectRoot, "frontend");

// Utility to create folders recursively
function mkdirp(folder) {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
}

// Utility to write file with content
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, { encoding: "utf8" });
}

// 1️⃣ Create folders
mkdirp(projectRoot);
mkdirp(backendPath);
mkdirp(frontendPath);
mkdirp(path.join(frontendPath, "src", "pages"));
mkdirp(path.join(frontendPath, "src", "components"));
mkdirp(path.join(frontendPath, "public"));

// 2️⃣ Backend files
writeFile(
  path.join(backendPath, "package.json"),
  `{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  }
}`
);

writeFile(
  path.join(backendPath, "index.js"),
`import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/aqi", (req,res)=>res.json([
  { location:"Connaught Place", aqi:178 },
  { location:"Noida", aqi:162 },
  { location:"Ghaziabad", aqi:189 },
  { location:"Rohini", aqi:151 }
]));

app.get("/api/sources", (req,res)=>res.json([
  { type:"Stubble Burning", contribution:45 },
  { type:"Vehicular", contribution:30 },
  { type:"Industrial", contribution:15 },
  { type:"Construction", contribution:10 }
]));

app.get("/api/forecast", (req,res)=>res.json({
  hours:Array.from({length:48},(_,i)=>i+1),
  aqi:Array.from({length:48},()=>150+Math.floor(Math.random()*50))
}));

app.get("/api/policy", (req,res)=>res.json([
  { policy:"Odd-Even", improvement:12 },
  { policy:"Firecracker Ban", improvement:8 },
  { policy:"Construction Halt", improvement:15 }
]));

// Serve frontend build
app.use(express.static(path.join(__dirname,"../frontend/dist")));
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"../frontend/dist/index.html")));

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>console.log(\`✅ Server running on port \${PORT}\`));
`
);

// 3️⃣ Frontend package.json
writeFile(
  path.join(frontendPath, "package.json"),
  `{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.1",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.3",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.15",
    "vite": "^5.0.4"
  }
}`
);

// 4️⃣ Tailwind config
writeFile(
  path.join(frontendPath, "tailwind.config.js"),
`/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
};`
);

writeFile(
  path.join(frontendPath, "postcss.config.js"),
`export default {
  plugins: { tailwindcss: {}, autoprefixer: {} }
};`
);

// 5️⃣ index.css
mkdirp(path.join(frontendPath,"src"));
writeFile(
  path.join(frontendPath,"src","index.css"),
`@tailwind base;
@tailwind components;
@tailwind utilities;`
);

// 6️⃣ React main files
writeFile(
  path.join(frontendPath,"src","main.jsx"),
`import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter><App /></BrowserRouter>
);`
);

writeFile(
  path.join(frontendPath,"src","App.jsx"),
`import React from 'react';
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
}`
);

// 7️⃣ Components Navbar.jsx
writeFile(
  path.join(frontendPath,"src","components","Navbar.jsx"),
`import React from 'react';
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
}`
);

// 8️⃣ Pages
const pages = ["Home","AQI","Sources","Forecast","Policy"];
pages.forEach(p=>{
  let content = "";
  switch(p){
    case "Home": content = `import React from 'react'; export default function Home(){ return (<div className="text-center"><h1 className="text-3xl font-bold mb-4">Delhi-NCR Pollution Dashboard</h1><p className="text-gray-700">AI-driven insights, source attribution, forecasts, and policy effectiveness for SIH Hackathon.</p></div>); }`; break;
    case "AQI": content = `import React,{useEffect,useState} from 'react'; import {Bar} from 'react-chartjs-2'; import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend} from 'chart.js'; ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend); export default function AQI(){ const [data,setData]=useState([]); useEffect(()=>{fetch('/api/aqi').then(r=>r.json()).then(json=>setData(json));},[]); const chartData={ labels:data.map(d=>d.location), datasets:[{label:'AQI',data:data.map(d=>d.aqi),backgroundColor:'rgba(251,146,60,0.7)'}]}; return (<div className="card bg-white p-6 rounded-md shadow"><h2 className="text-xl font-semibold mb-4">Hyperlocal AQI in Delhi</h2><Bar data={chartData}/></div>); }`; break;
    case "Sources": content = `import React,{useEffect,useState} from 'react'; import {Pie} from 'react-chartjs-2'; import {Chart as ChartJS,ArcElement,Tooltip,Legend} from 'chart.js'; ChartJS.register(ArcElement,Tooltip,Legend); export default function Sources(){ const [sources,setSources]=useState([]); useEffect(()=>{fetch('/api/sources').then(r=>r.json()).then(json=>setSources(json));},[]); const chartData={ labels:sources.map(s=>s.type), datasets:[{data:sources.map(s=>s.contribution),backgroundColor:['#fb923c','#22d3ee','#10b981','#facc15']}]}; return (<div className="card bg-white p-6 rounded-md shadow"><h2 className="text-xl font-semibold mb-4">Source Contribution</h2><Pie data={chartData}/></div>); }`; break;
    case "Forecast": content = `import React,{useEffect,useState} from 'react'; import {Line} from 'react-chartjs-2'; import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend} from 'chart.js'; ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend); export default function Forecast(){ const [forecast,setForecast]=useState({hours:[],aqi:[]}); useEffect(()=>{fetch('/api/forecast').then(r=>r.json()).then(json=>setForecast(json));},[]); const chartData={ labels:forecast.hours.map(h=>\`+\${h}h\`), datasets:[{label:'Predicted AQI',data:forecast.aqi,borderColor:'#fb923c',backgroundColor:'rgba(251,146,60,0.3)',tension:0.3}]}; return (<div className="card bg-white p-6 rounded-md shadow"><h2 className="text-xl font-semibold mb-4">48h AQI Forecast</h2><Line data={chartData}/></div>); }`; break;
    case "Policy": content = `import React,{useEffect,useState} from 'react'; import {Bar} from 'react-chartjs-2'; export default function Policy(){ const [policy,setPolicy]=useState([]); useEffect(()=>{fetch('/api/policy').then(r=>r.json()).then(json=>setPolicy(json));},[]); const chartData={ labels:policy.map(p=>p.policy), datasets:[{label:'Improvement (%)',data:policy.map(p=>p.improvement),backgroundColor:'#22d3ee'}]}; return (<div className="card bg-white p-6 rounded-md shadow"><h2 className="text-xl font-semibold mb-4">Policy Effectiveness</h2><Bar data={chartData}/></div>); }`; break;
  }
  writeFile(path.join(frontendPath,"src","pages",`${p}.jsx`),content);
});

// 9️⃣ README.md
writeFile(path.join(projectRoot,"README.md"),
`# AI-Driven Delhi-NCR Pollution Dashboard
Prototype for SIH Hackathon 2025

## Setup
1. Backend:
   cd backend
   npm install
   node index.js

2. Frontend:
   cd frontend
   npm install
   npm run dev
   npm run build

3. Deployment:
   Push to GitHub and deploy backend to Render/Railway/Vercel.
`);

// Done
console.log("✅ Project scaffolded successfully at", projectRoot);
console.log("Next: cd into frontend & backend, run npm install, build frontend, then run backend.");  
