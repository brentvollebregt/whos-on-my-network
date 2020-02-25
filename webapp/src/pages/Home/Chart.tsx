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
  entityIds: string[];
  entityDiscoveryTimes: DiscoveryTimes;
  entityIdNameMap: EntityIdNameMap;
  onEntityClick: (entityId: string) => void;
  onEntityLinkClick: (entityId: string) => void;
  maxDate: DateTime;
  minDate: DateTime;
  width: number;
  height: number;
}

const margin = {
  top: 0,
  bottom: 40,
  left: 130,
  right: 0
};

const Chart: React.FC<ChartProps> = ({
  entityIds,
  entityDiscoveryTimes,
  entityIdNameMap,
  onEntityClick,
  onEntityLinkClick,
  maxDate,
  minDate,
  width,
  height
}) => {
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // Reverse entity ids in place as the values are populated bottom to top
  entityIds.reverse();

  const points = entityIds
    .map((d: string) => entityDiscoveryTimes[d].map(date => [d, date]))
    .flatMap(x => x) as [string, DateTime][];

  const xScale = scaleTime({
    range: [0, xMax],
    domain: [minDate.toJSDate(), maxDate.toJSDate()]
  });

  const yScale = scaleBand({
    range: [yMax, 0],
    domain: entityIds,
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

  const onDeviceLinkClick = (entityName: string | number | undefined) => () => {
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
      onEntityLinkClick(entityId);
    }
  };

  return (
    <svg width={width} height={height} className="home-chart">
      <Group top={margin.top} left={margin.left}>
        <Group>
          {entityIds.map(deviceId => {
            const x1 = xScale(minDate);
            const x2 = xScale(maxDate);
            const y = (yScale(deviceId) ?? 0) + yScale.bandwidth() / 2;
            return (
              <Line
                x1={x1}
                x2={x2}
                y1={y}
                y2={y}
                key={`line-${deviceId}`}
                className="horizontal-line"
              />
            );
          })}
        </Group>
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
            <text x={x} y={y} textAnchor="end" dy={3} className="entity-label">
              <tspan onClick={onDeviceNameClick(formattedValue)}>
                {formattedValue}
              </tspan>
              <tspan onClick={onDeviceLinkClick(formattedValue)}> 🔗</tspan>
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
            className: "date-label",
            textAnchor: "middle"
          })}
        />
      </Group>
    </svg>
  );
};

export default withTooltip(Chart);
