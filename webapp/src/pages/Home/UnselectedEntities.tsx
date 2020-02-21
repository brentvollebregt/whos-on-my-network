import React from "react";
import { Badge } from "react-bootstrap";
import { EntityIdNameMap } from "./Home";
import "./Home.css";

interface UnselectedEntitiesProps {
  entityIds: string[];
  entityIdNameMap: EntityIdNameMap;
  onEntityClick: (entityId: string) => void;
}

const UnselectedEntities: React.FC<UnselectedEntitiesProps> = ({
  entityIds,
  entityIdNameMap,
  onEntityClick
}) => {
  const onBadgeClick = (entityId: string) => () => onEntityClick(entityId);

  return (
    <div className="text-center m-auto" style={{ maxWidth: 800 }}>
      {entityIds.map(id => (
        <Badge
          key={id}
          variant="primary"
          className="mr-1"
          onClick={onBadgeClick(id)}
        >
          {entityIdNameMap[id]}
        </Badge>
      ))}
    </div>
  );
};

export default UnselectedEntities;
