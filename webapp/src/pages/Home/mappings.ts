import { EntityIdNameMap, EntityType } from "./Home";
import { DiscoveryTimes, DeviceSummary, PersonSummary } from "../../api/dto";

interface SelectedAndUnselectedEntityIdNameMap {
  selectedEntityIdNameMap: EntityIdNameMap;
  unselectedEntityIdNameMap: EntityIdNameMap;
}

export const filterDiscoveryTimes = (
  discoveryTimes: DiscoveryTimes,
  selectedEntityIds: string[]
): DiscoveryTimes => {
  return Object.keys(discoveryTimes)
    .filter(entityId => selectedEntityIds.indexOf(entityId) !== -1)
    .reduce((acc: DiscoveryTimes, currentEntityId: string) => {
      return {
        ...acc,
        [currentEntityId]: discoveryTimes[currentEntityId]
      };
    }, {});
};

export const mapToSelectedAndUnselectedEntityIdNameMap = (
  discoveryTimes: DiscoveryTimes,
  entityType: EntityType,
  devices: DeviceSummary[] | undefined,
  people: PersonSummary[] | undefined,
  selectedEntityIds: string[]
): SelectedAndUnselectedEntityIdNameMap => {
  if (
    (entityType === "device" && devices === undefined) ||
    (entityType === "person" && people === undefined)
  ) {
    return {
      selectedEntityIdNameMap: {},
      unselectedEntityIdNameMap: {}
    };
  }

  return Object.keys(discoveryTimes).reduce(
    (acc: SelectedAndUnselectedEntityIdNameMap, entityId) => {
      let entityName = "";
      if (entityType === "device") {
        const device = devices?.find(d => d.id + "" === entityId);
        entityName =
          device === undefined
            ? "Not Found"
            : device.name !== ""
            ? device.name
            : device.mac_address.toUpperCase();
      } else if (entityType === "person") {
        const person = people?.find(d => d.id + "" === entityId);
        entityName = person === undefined ? "Not Found" : person.name;
      }

      const groupName =
        selectedEntityIds.indexOf(entityId) !== -1
          ? "selectedEntityIdNameMap"
          : "unselectedEntityIdNameMap";

      return {
        ...acc,
        [groupName]: {
          ...acc[groupName],
          [entityId]: entityName
        }
      };
    },
    { selectedEntityIdNameMap: {}, unselectedEntityIdNameMap: {} }
  );
};
