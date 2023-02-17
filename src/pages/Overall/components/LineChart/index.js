import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const LineChartComponent = ({ data, title, dataKey = "uv" }) => {
  const [lineChartContainerWidth, setLineChartContainerWidth] = useState();
  const lineChartContainerRef = useRef();

  useEffect(() => {
    if (!lineChartContainerRef.current) return;

    setLineChartContainerWidth(lineChartContainerRef.current.offsetWidth);
  }, [lineChartContainerRef.current]);

  return (
    <div className="line__chart" ref={lineChartContainerRef}>
      <h2 style={{ padding: "0px 32px", fontWeight: "bolder" }}>{title}</h2>
      {lineChartContainerWidth && (
        <LineChart
          width={lineChartContainerWidth - 32}
          height={400}
          data={data}
          margin={{
            right: 30,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {/* <Legend /> */}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      )}
    </div>
  );
};

export default LineChartComponent;
