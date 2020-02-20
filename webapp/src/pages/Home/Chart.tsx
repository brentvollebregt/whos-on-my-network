import React from "react";
import { DiscoveryTimes } from "../../api/dto";
import { withTooltip, Tooltip } from "@vx/tooltip";
import { DateTime } from "luxon";
import { Group } from "@vx/group";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { scaleBand, scaleTime } from "@vx/scale";
import { Circle, Line } from "@vx/shape";

interface ChartProps {
  data: DiscoveryTimes;
  dataIndexesToNames: { [key: string]: string };
  maxDate: DateTime;
  minDate: DateTime;
}

/* 
TODO Graph
  - Dot plotting: https://vx-demo.now.sh/dots
  - Axis labels: https://vx-demo.now.sh/barstackhorizontal
If we can click to deselect, we can get rid of the bottom component and substitute it with some pill system
that shows the unselected names/devices and allows for them to be reselected (+ select/deselect all)
*/

const margin = {
  top: 0,
  bottom: 40,
  left: 100,
  right: 0
};

const Chart: React.FC<ChartProps> = ({
  data,
  dataIndexesToNames,
  maxDate,
  minDate
}) => {
  const width = 800;
  const height = 400;
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const points = Object.keys(data)
    .map((d: string) => data[d].map(date => [d, date]))
    .flatMap(x => x) as [string, DateTime][];

  const xScale = scaleTime({
    range: [0, xMax],
    domain: [minDate.toJSDate(), maxDate.toJSDate()]
  });

  const yScale = scaleBand({
    range: [yMax, 0],
    domain: Object.keys(data),
    padding: 0.2
  });

  const onDeviceNameClick = (deviceId: string | number | undefined) => () => {
    console.log("click", deviceId);
  };

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <Group top={margin.top} left={margin.left}>
          <Group>
            {points.map((point, i) => {
              const x = point[1].toJSDate();
              const y = point[0];
              const cx = xScale(x);
              const cy = (yScale(y) ?? 0) + yScale.bandwidth() / 2;
              return (
                <Circle
                  key={`point-${y}-${x.valueOf()}-${i}`}
                  className="dot"
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill="blue"
                />
              );
            })}
          </Group>
          <Group>
            {Object.keys(data).map(deviceId => {
              const x1 = xScale(minDate);
              const x2 = xScale(maxDate);
              const y = (yScale(deviceId) ?? 0) + yScale.bandwidth() / 2;
              return (
                <Line
                  x1={x1}
                  x2={x2}
                  y1={y}
                  y2={y}
                  key={`line-${y}`}
                  // className="dot"
                  stroke="blue"
                  strokeWidth={1}
                />
              );
            })}
          </Group>
          <AxisLeft
            hideAxisLine={true}
            hideTicks={true}
            scale={yScale}
            tickFormat={(value: string, tickIndex: number) =>
              dataIndexesToNames[value]
            }
            tickComponent={({ x, y, formattedValue }) => (
              <text
                x={x}
                y={y}
                fill="red"
                fontSize={11}
                textAnchor="end"
                dy={3}
                onClick={onDeviceNameClick(formattedValue)}
              >
                <tspan>{formattedValue}</tspan>
              </text>
            )}
          />
          <AxisBottom
            top={yMax}
            scale={xScale}
            numTicks={10}
            tickFormat={(value: Date, tickIndex: number) =>
              DateTime.fromJSDate(value).toFormat("d MMM")
            }
            tickLabelProps={(value, index) => ({
              fill: "red",
              fontSize: 11,
              textAnchor: "middle"
            })}
          />
        </Group>
      </svg>
    </div>
  );
};

export default withTooltip(Chart);
