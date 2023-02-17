import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BarChartComponent = ({ data, title }) => {
  const [lineChartContainerWidth, setLineChartContainerWidth] = useState();
  const lineChartContainerRef = useRef();

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    if (!lineChartContainerRef.current) return;

    setLineChartContainerWidth(lineChartContainerRef.current.offsetWidth);
  }, [lineChartContainerRef.current]);

  return (
    <div className="line__chart" ref={lineChartContainerRef}>
      <h2 style={{ padding: "0px 32px", fontWeight: "bolder" }}>{title}</h2>
      {lineChartContainerWidth && (
        <BarChart
          width={lineChartContainerWidth}
          height={400}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="uv" fill="#82ca9d" barSize={30} />
        </BarChart>
      )}
    </div>
  );
};

export default BarChartComponent;
