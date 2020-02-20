import React, { useState, useEffect } from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import DateRangeSelector from "../../components/DateRangeSelector";
import { DateTime } from "luxon";
import { DiscoveryTimes } from "../../api/dto";
import { getDeviceDiscoveryTimes, getPersonDiscoveryTimes } from "../../api";
import UnselectedEntities from "./UnselectedEntities";
import ChartSizeWrapper from "./ChartSizeWrapper";
import {
  ButtonToolbar,
  DropdownButton,
  ButtonGroup,
  Dropdown,
  Button
} from "react-bootstrap";
import useStoredDatePair from "../../hooks/useStoredDatePair";
import useAllPeople from "../../hooks/useAllPeople";
import useAllDevices from "../../hooks/useAllDevices";

export type EntityIdNameMap = { [key: string]: string };

const defaultStartDate = DateTime.local()
  .minus({ weeks: 1 })
  .startOf("day");
const defaultEndDate = DateTime.local().endOf("day");

const Home: React.FunctionComponent = () => {
  useTitle(`Home - ${Constants.title}`);

  const { devices } = useAllDevices();
  const { people } = useAllPeople();
  const {
    getStartDate,
    getEndDate,
    getStartAndEndDates,
    setStartAndEndDates,
    storedStartAndEndDates
  } = useStoredDatePair("home", defaultStartDate, defaultEndDate);
  const [entityType, setEntityType] = useState<"device" | "person">("device");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [discoveryTimes, setDiscoveryTimes] = useState<DiscoveryTimes>({});

  // Fetch discovery times for selected entity type
  useEffect(() => {
    if (entityType === "device") {
      getDeviceDiscoveryTimes(undefined, getStartDate(), getEndDate()).then(d =>
        setDiscoveryTimes(d)
      );
    } else if (entityType === "person") {
      getPersonDiscoveryTimes(undefined, getStartDate(), getEndDate()).then(d =>
        setDiscoveryTimes(d)
      );
    }
  }, [entityType, storedStartAndEndDates]);

  const selectAllEntities = () => {
    if (entityType === "device" && devices !== undefined) {
      setSelectedIds(devices.map(d => d.id + ""));
    } else if (entityType === "person" && people !== undefined) {
      setSelectedIds(people.map(p => p.id + ""));
    }
  };
  const deselectAllEntities = () => setSelectedIds([]);

  // When devices and people load, reset the selection
  useEffect(() => {
    selectAllEntities();
  }, [devices, people]);

  // Reset the selection on an entity type change
  useEffect(() => {
    selectAllEntities();
  }, [entityType]);

  const entitiesReady = (): boolean =>
    (entityType === "device" && devices !== undefined) ||
    (entityType === "person" && people !== undefined);

  const onEntityClick = (entityId: string) => {
    if (selectedIds.indexOf(entityId) === -1) {
      setSelectedIds([...selectedIds, entityId]);
    } else {
      setSelectedIds([...selectedIds.filter(id => id !== entityId)]);
    }
  };

  const areEntitiesReady = entitiesReady();

  const filteredDiscoveryTimes = Object.keys(discoveryTimes)
    .filter(
      entityId => areEntitiesReady && selectedIds.indexOf(entityId) !== -1
    )
    .reduce((acc: DiscoveryTimes, currentEntityId: string) => {
      return {
        ...acc,
        [currentEntityId]: discoveryTimes[currentEntityId]
      };
    }, {});

  const {
    selectedEntityIdNameMap,
    unselectedEntityIdNameMap
  }: {
    selectedEntityIdNameMap: EntityIdNameMap;
    unselectedEntityIdNameMap: EntityIdNameMap;
  } = Object.keys(discoveryTimes)
    .filter(entityId => areEntitiesReady)
    .reduce(
      (
        acc: {
          selectedEntityIdNameMap: EntityIdNameMap;
          unselectedEntityIdNameMap: EntityIdNameMap;
        },
        entityId
      ) => {
        let entityName = "";
        if (entityType === "device") {
          entityName =
            devices?.find(d => d.id + "" === entityId)?.name ?? "Not Found";
        } else if (entityType === "person") {
          entityName =
            people?.find(d => d.id + "" === entityId)?.name ?? "Not Found";
        }

        const groupName =
          selectedIds.indexOf(entityId) !== -1
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

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Overview of Scans</h1>

      <DateRangeSelector
        startAndEndDates={getStartAndEndDates()}
        setStartAndEndDates={setStartAndEndDates}
      />

      {!entitiesReady() ? (
        "Loading"
      ) : (
        <div className="mb-4">
          <ChartSizeWrapper
            entityDiscoveryTimes={filteredDiscoveryTimes}
            entityIdNameMap={selectedEntityIdNameMap}
            onEntityClick={onEntityClick}
            minDate={getStartDate()}
            maxDate={getEndDate()}
          />

          <ButtonToolbar className="mb-2 text-center d-block">
            <DropdownButton
              as={ButtonGroup}
              id="entity-selection"
              title={`Entity Type: ${
                entityType === "device" ? "Device" : "People"
              }`}
            >
              <Dropdown.Item onClick={() => setEntityType("device")}>
                Device
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setEntityType("person")}>
                People
              </Dropdown.Item>
            </DropdownButton>
            <ButtonGroup className="ml-2">
              <Button variant="primary" onClick={selectAllEntities}>
                Select All
              </Button>
              <Button variant="primary" onClick={deselectAllEntities}>
                Deselect All
              </Button>
            </ButtonGroup>
          </ButtonToolbar>

          <UnselectedEntities
            entities={unselectedEntityIdNameMap}
            onEntityClick={onEntityClick}
          />
        </div>
      )}
    </PageSizeWrapper>
  );
};

export default Home;
