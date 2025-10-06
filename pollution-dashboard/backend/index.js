import express from "express";
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

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`✅ Server running on port ${PORT}`));
