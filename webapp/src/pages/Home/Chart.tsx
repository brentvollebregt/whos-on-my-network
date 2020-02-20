import React from "react";
import { DiscoveryTimes } from "../../api/dto";
import { withTooltip, Tooltip } from "@vx/tooltip";
import { DateTime } from "luxon";
import { Group } from "@vx/group";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { scaleBand, scaleTime } from "@vx/scale";
import { Circle, Line } from "@vx/shape";
import { EntityIdNameMap } from "./Home";

export interface ChartProps {
  entityDiscoveryTimes: DiscoveryTimes;
  entityIdNameMap: EntityIdNameMap;
  onEntityClick: (entityId: string) => void;
  maxDate: DateTime;
  minDate: DateTime;
  width: number;
  height: number;
}

const margin = {
  top: 0,
  bottom: 40,
  left: 100,
  right: 0
};

const Chart: React.FC<ChartProps> = ({
  entityDiscoveryTimes,
  entityIdNameMap,
  onEntityClick,
  maxDate,
  minDate,
  width,
  height
}) => {
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const points = Object.keys(entityDiscoveryTimes)
    .map((d: string) => entityDiscoveryTimes[d].map(date => [d, date]))
    .flatMap(x => x) as [string, DateTime][];

  const xScale = scaleTime({
    range: [0, xMax],
    domain: [minDate.toJSDate(), maxDate.toJSDate()]
  });

  const yScale = scaleBand({
    range: [yMax, 0],
    domain: Object.keys(entityDiscoveryTimes),
    padding: 0.2
  });

  const onDeviceNameClick = (entityName: string | number | undefined) => () => {
    const entityId = Object.keys(entityIdNameMap).reduce(
      (acc: undefined | string, currentEntityId) => {
        return acc !== undefined
          ? acc
          : entityIdNameMap[currentEntityId] === entityName
          ? currentEntityId
          : undefined;
      },
      undefined
    );
    if (entityId !== undefined) {
      onEntityClick(entityId);
    }
  };

  return (
    <div>
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
                  r={4}
                  fill="blue"
                />
              );
            })}
          </Group>
          <Group>
            {Object.keys(entityDiscoveryTimes).map(deviceId => {
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
                  stroke="black"
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
              entityIdNameMap[value]
            }
            tickComponent={({ x, y, formattedValue }) => (
              <text
                x={x}
                y={y}
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
