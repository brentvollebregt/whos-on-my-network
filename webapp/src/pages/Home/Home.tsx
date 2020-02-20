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
import {
  filterDiscoveryTimes,
  mapToSelectedAndUnselectedEntityIdNameMap
} from "./mappings";
import "./Home.css";

export type EntityType = "device" | "person";
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
  const [entityType, setEntityType] = useState<EntityType>("device");
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>([]);
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
      setSelectedEntityIds(devices.map(d => d.id + ""));
    } else if (entityType === "person" && people !== undefined) {
      setSelectedEntityIds(people.map(p => p.id + ""));
    }
  };
  const deselectAllEntities = () => setSelectedEntityIds([]);

  // When devices and people load, reset the selection
  useEffect(() => {
    selectAllEntities();
  }, [devices, people]);

  // Reset the selection on an entity type change
  useEffect(() => {
    selectAllEntities();
  }, [entityType]);

  const onEntityClick = (entityId: string) => {
    if (selectedEntityIds.indexOf(entityId) === -1) {
      setSelectedEntityIds([...selectedEntityIds, entityId]);
    } else {
      setSelectedEntityIds([
        ...selectedEntityIds.filter(id => id !== entityId)
      ]);
    }
  };

  const filteredDiscoveryTimes = filterDiscoveryTimes(
    discoveryTimes,
    selectedEntityIds
  );
  const {
    selectedEntityIdNameMap,
    unselectedEntityIdNameMap
  } = mapToSelectedAndUnselectedEntityIdNameMap(
    discoveryTimes,
    entityType,
    devices,
    people,
    selectedEntityIds
  );

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Overview of Scans</h1>

      <DateRangeSelector
        startAndEndDates={getStartAndEndDates()}
        setStartAndEndDates={setStartAndEndDates}
      />

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
    </PageSizeWrapper>
  );
};

export default Home;
