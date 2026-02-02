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
const CustomTooltip = ({ active, payload, label, hoveredKey }) => {
  if (!active || !payload || !payload.length) return null;

  const colors = {
    fire: "#E11D48",
    fault: "#CA8A04",
    sysFault: "#4F46E5",
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "10px 14px",
        borderRadius: "8px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
      }}
    >
      <p style={{ marginBottom: 6, fontWeight: 600 }}>{label}</p>

      {payload.map((item) => {
        const activeItem = item.dataKey === hoveredKey;

        return (
          <p
            key={item.dataKey}
            style={{
              margin: "4px 0",
              color: colors[item.dataKey],
              fontSize: activeItem ? "16px" : "12px",
              fontWeight: activeItem ? 700 : 500,
              transition: "all 0.2s ease",
            }}
          >
            {item.dataKey}: {item.value}
          </p>
        );
      })}
    </div>
  );
};




export default function PanelBarGraph({ panels }) {
  const [hoveredKey, setHoveredKey] = useState(null);

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
  const chartWidth = Math.max(700, panels.length * 50);

  return (
    <div className="graph-main">
      <h3>Panel Status Overview</h3>

      <div className="graph-scroll-x" onMouseDown={(e) => e.preventDefault()}>
        <BarChart
          width={chartWidth}
          height={chartHeight}
          data={chartData}
          layout="vertical"
          margin={{ left: -30, right: 40 }}
          tabIndex={-1}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis type="number" domain={[0, 50]} tickCount={10} />

          <YAxis
            type="category"
            dataKey="panel"
            width={window.innerWidth > 425 ? 160 : 132}
            tick={{ fill: "#295bfd" }}
          />

          {/* ✅ CUSTOM TOOLTIP HERE */}
          <Tooltip content={<CustomTooltip hoveredKey={hoveredKey} />} />


          <Legend
            wrapperStyle={{
              marginLeft:
                window.innerWidth < 480
                  ? 20
                  : window.innerWidth < 768
                    ? 0
                    : 90,
            }}
          />

          <Bar
            dataKey="fire"
            stackId="a"
            fill="#ff6b74ff"
            // stroke="#FB7185"
            barSize={100}
            onMouseOver={() => setHoveredKey("fire")}
            onMouseOut={() => setHoveredKey(null)}
          >
            <LabelList
              fill="#232323"
              dataKey="type"
              position="right"
              offset={50}
              style={{ fontSize: 13, fontWeight: 600 }}

            />
          </Bar>

          <Bar
            dataKey="fault"
            stackId="a"
            fill="#ffe88dff"
            // stroke="#FACC15"
            barSize={25}
            onMouseOver={() => setHoveredKey("fault")}
            onMouseOut={() => setHoveredKey(null)}
          />

          <Bar
            dataKey="sysFault"
            stackId="a"
            fill="#a6a1ffff"
            // stroke="#60A5FA"
            barSize={25}
            onMouseOver={() => setHoveredKey("sysFault")}
            onMouseOut={() => setHoveredKey(null)}
          />
        </BarChart>
      </div>
    </div>
  );
}