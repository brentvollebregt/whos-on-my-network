import { EntityIdNameMap, EntityType } from "./Home";
import { DiscoveryTimes, DeviceSummary, PersonSummary } from "../../api/dto";

interface SelectedAndUnselectedDiscoveryTimes {
  selectedDiscoveryTimes: DiscoveryTimes;
  unselectedDiscoveryTimes: DiscoveryTimes;
}

export const mapToSelectedAndUnselectedDiscoveryTimes = (
  discoveryTimes: DiscoveryTimes,
  selectedEntityIds: string[]
): SelectedAndUnselectedDiscoveryTimes => {
  return Object.keys(discoveryTimes).reduce(
    (acc: SelectedAndUnselectedDiscoveryTimes, entityId: string) => {
      const groupName: keyof SelectedAndUnselectedDiscoveryTimes =
        selectedEntityIds.indexOf(entityId) !== -1
          ? "selectedDiscoveryTimes"
          : "unselectedDiscoveryTimes";

      return {
        ...acc,
        [groupName]: {
          ...acc[groupName],
          [entityId]: discoveryTimes[entityId]
        }
      };
    },
    { selectedDiscoveryTimes: {}, unselectedDiscoveryTimes: {} }
  );
};

export const mapToEntityIdNameMap = (
  discoveryTimes: DiscoveryTimes,
  entityType: EntityType,
  devices: DeviceSummary[] | undefined,
  people: PersonSummary[] | undefined
): EntityIdNameMap => {
  if (
    (entityType === "device" && devices === undefined) ||
    (entityType === "person" && people === undefined)
  ) {
    return {};
  }

  return Object.keys(discoveryTimes).reduce((acc: EntityIdNameMap, entityId) => {
    if (entityType === "device") {
      const device = devices?.find(d => d.id + "" === entityId);
      const entityName =
        device === undefined
          ? "Not Found"
          : device.name !== ""
          ? device.name
          : device.mac_address.toUpperCase();
      return { ...acc, [entityId]: entityName };
    } else if (entityType === "person") {
      const person = people?.find(d => d.id + "" === entityId);
      const entityName = person === undefined ? "Not Found" : person.name;
      return { ...acc, [entityId]: entityName };
    } else {
      return { ...acc };
    }
  }, {});
};
