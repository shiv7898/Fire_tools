
import { useState } from "react";
import "./graphView.css"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function PanelBarGraph({ panels }) {
    const [activePanel, setActivePanel] = useState(null);
  const chartData = panels.map((panel) => ({
    panel: panel.name,
    fire: panel.fireCount,
    fault: panel.faultCount,
    sysFault: panel.sysfaultCount,
    type: panel.type,
  }));
  const chartHeight = Math.max(280, panels.length * 20);

  return (
    <div className="graph-main"
      
    >
      <h3
       
      >
        Panel Status Overview
      </h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          width={800} // 👈 LOCK GRAPH WIDTH
          height={chartHeight}
          data={chartData}
          layout="vertical"
          margin={{ left: -30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            type="number"
            domain={[0, 60]}
            tickCount={7}
            stroke="#2355f9"
          />
          <YAxis type="category" dataKey="panel" width={120} stroke="#2355f9" />

          <Tooltip />
          <Legend />

          {/* 🔥 Fire (main bar with label at end) */}
          <Bar dataKey="fire" stackId="a" fill="#ff4d4f" barSize={25}>
            
            <LabelList
              dataKey="type"
              position="right"
              offset={90}
              style={{
                fill: activePanel ? "#ff9b9b" : "#2f70cbff",
                fontSize: 13,
                fontWeight: 600,
                // fill={activePanel ? "#ff9b9b" : "#ff4d4f"},
              }}
            />
          </Bar>

          {/* ⚠ Fault */}
          <Bar dataKey="fault" stackId="a" fill="#faad14" barSize={25} />

          {/* 🛠 System Fault */}
          <Bar dataKey="sysFault" stackId="a" fill="#1890ff" barSize={25} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
