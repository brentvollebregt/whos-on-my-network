import React, { useRef, useEffect, useState } from "react";
import Chart, { ChartProps } from "./Chart";

type ChartSizeWrapperProps = Omit<Omit<ChartProps, "width">, "height"> & {
  height: number;
};

const ChartSizeWrapper: React.FC<ChartSizeWrapperProps> = ({
  height,
  ...props
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (wrapperRef.current !== null) {
      setDimensions([
        wrapperRef.current.clientWidth,
        wrapperRef.current.clientHeight
      ]);
    }
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} style={{ height }}>
      <Chart {...props} width={dimensions[0]} height={dimensions[1]} />
    </div>
  );
};

export default ChartSizeWrapper;
