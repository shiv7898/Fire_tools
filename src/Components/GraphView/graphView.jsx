import { useState } from "react";
import "./graphView.css";
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
  const chartData = panels.map((panel) => ({
    panel: panel.name,
    fire: panel.fireCount,
    fault: panel.faultCount,
    sysFault: panel.sysfaultCount,
    type: panel.type,
  }));

  const MIN_HEIGHT = 150;
  const ROW_HEIGHT = 38;
  const chartHeight = Math.max(MIN_HEIGHT, panels.length * ROW_HEIGHT);

  // 🔥 Dynamic width (important for scroll)
  const chartWidth = Math.max(800, panels.length * 50);

  return (
    <div className="graph-main">
      <h3>Panel Status Overview</h3>

      {/* 👇 Horizontal scroll wrapper */}
      <div className="graph-scroll-x">
        <BarChart
          width={chartWidth}
          height={chartHeight}
          data={chartData}
          layout="vertical"
          margin={{ left: -30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis type="number" domain={[0, 60]} tickCount={7} />
          <YAxis type="category" dataKey="panel" width={120}  tick={{ fill: "#295bfd", }}/>

          <Tooltip />
          <Legend />

          <Bar dataKey="fire" stackId="a" fill="#ff4848" barSize={100}>
            <LabelList
              dataKey="type"
              position="right"
              offset={100}
              style={{
                fontSize: 13,
                fontWeight: 600,
              }}
            />
          </Bar>

          <Bar dataKey="fault" stackId="a" fill="#faad14" barSize={25} />
          <Bar dataKey="sysFault" stackId="a" fill="#1890ff" barSize={25} />
        </BarChart>
      </div>
    </div>
  );
}
