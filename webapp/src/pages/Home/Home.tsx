import React, { useState } from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import Chart from "./Chart";
import EntitySelection from "./EntitySelection";

const Home: React.FunctionComponent = () => {
  useTitle(`Home - ${Constants.title}`);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [entityType, setEntityType] = useState<"device" | "person">("device");

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Overview of Scans</h1>

      <Chart entityType={entityType} selectedIds={selectedIds} />

      <div className="mt-3">
        <EntitySelection
          entityType={entityType}
          setEntityType={setEntityType}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </div>
    </PageSizeWrapper>
  );
};

export default Home;
