import React from "react";
import { DiscoveryTimes } from "../../api/dto";
import { withTooltip, Tooltip } from "@vx/tooltip";
import { DateTime } from "luxon";
import { Group } from "@vx/group";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { scaleBand, scaleTime } from "@vx/scale";
import { Circle } from "@vx/shape";

interface ChartProps {
  data: DiscoveryTimes;
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

const Chart: React.FC<ChartProps> = ({ data, maxDate, minDate }) => {
  const width = 800;
  const height = 400;
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const points = Object.keys(data)
    .map((d: string) =>
      data[parseInt(d)].map(date => [parseInt(d), date as DateTime])
    )
    .flatMap(x => x) as [number, DateTime][];

  const xScale = scaleTime({
    range: [0, xMax],
    domain: [minDate.toJSDate(), maxDate.toJSDate()]
  });

  const yScale = scaleBand({
    range: [yMax, 0],
    domain: Object.keys(data).map(id => `Device ${id}`),
    padding: 0.2
  });

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <Group top={margin.top} left={margin.left}>
          <Group>
            {points.map((point, i) => {
              const x = point[1].toJSDate();
              const y = `Device ${point[0]}`;
              const cx = xScale(x);
              const cy = yScale(y);
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
          <AxisLeft
            hideAxisLine={true}
            hideTicks={true}
            scale={yScale}
            tickFormat={(value: string, tickIndex: number) => value}
            tickLabelProps={(value, index) => ({
              fill: "red",
              fontSize: 11,
              textAnchor: "end"
            })}
          />
          <AxisBottom
            top={yMax}
            scale={xScale}
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
