import React from "react";
import { Badge } from "react-bootstrap";
import { EntityIdNameMap } from "./Home";
import "./Home.css";

interface UnselectedEntitiesProps {
  entities: EntityIdNameMap;
  onEntityClick: (entityId: string) => void;
}

const UnselectedEntities: React.FC<UnselectedEntitiesProps> = ({
  entities,
  onEntityClick
}) => {
  const onBadgeClick = (entityId: string) => () => onEntityClick(entityId);

  return (
    <div className="text-center m-auto" style={{ maxWidth: 800 }}>
      {Object.keys(entities).map(id => (
        <Badge variant="primary" className="mr-1" onClick={onBadgeClick(id)}>
          {entities[id]}
        </Badge>
      ))}
    </div>
  );
};

export default UnselectedEntities;
