import React, { useState, useEffect } from "react";
import Constants from "../../constants";
import { useTitle, navigate } from "hookrouter";
import PageSizeWrapper from "../../components/PageSizeWrapper";
import DateRangeSelector from "../../components/DateRangeSelector";
import { DateTime } from "luxon";
import { DiscoveryTimes } from "../../api/dto";
import { getDeviceDiscoveryTimes, getPersonDiscoveryTimes } from "../../api";
import UnselectedEntities from "./UnselectedEntities";
import EntityPlot from "../../components/EntityPlot";
import { ButtonToolbar, DropdownButton, ButtonGroup, Dropdown, Button } from "react-bootstrap";
import useStoredDatePair from "../../hooks/useStoredDatePair";
import useAllPeople from "../../hooks/useAllPeople";
import useAllDevices from "../../hooks/useAllDevices";
import { mapToSelectedAndUnselectedDiscoveryTimes, mapToEntityIdNameMap } from "./mappings";
import "./Home.css";
import { sortDevices, sortPeople } from "../../utils/sorting";

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
      setSelectedEntityIds([...selectedEntityIds.filter(id => id !== entityId)]);
    }
  };

  const onEntityLinkClick = (entityId: string) => {
    if (entityType === "device") {
      navigate(`/devices/${entityId}`);
    } else {
      navigate(`/people/${entityId}`);
    }
  };

  const {
    selectedDiscoveryTimes,
    unselectedDiscoveryTimes
  } = mapToSelectedAndUnselectedDiscoveryTimes(discoveryTimes, selectedEntityIds);
  let sortedEntityIds;
  if (entityType === "device") {
    sortedEntityIds = sortDevices(devices)?.map(d => d.id + "");
  } else {
    sortedEntityIds = sortPeople(people)?.map(p => p.id + "");
  }
  const sortedSelectedEntityIds = (sortedEntityIds ?? []).filter(
    id => id in selectedDiscoveryTimes
  );
  const sortedUnselectedEntityIds = (sortedEntityIds ?? []).filter(
    id => id in unselectedDiscoveryTimes
  );

  const entityIdNameMap = mapToEntityIdNameMap(discoveryTimes, entityType, devices, people);

  return (
    <PageSizeWrapper>
      <h1 className="text-center">Overview of Scans</h1>

      <DateRangeSelector
        startAndEndDates={getStartAndEndDates()}
        setStartAndEndDates={setStartAndEndDates}
      />

      <div className="mb-4">
        <EntityPlot
          entityIds={sortedSelectedEntityIds}
          entityDiscoveryTimes={selectedDiscoveryTimes}
          entityIdNameMap={entityIdNameMap}
          onEntityClick={onEntityClick}
          onEntityLinkClick={onEntityLinkClick}
          minDate={getStartDate()}
          maxDate={getEndDate()}
          height={500}
        />

        <ButtonToolbar className="mb-2 text-center d-block">
          <DropdownButton
            as={ButtonGroup}
            id="entity-selection"
            title={`Entity Type: ${entityType === "device" ? "Device" : "People"}`}
          >
            <Dropdown.Item onClick={() => setEntityType("device")}>Device</Dropdown.Item>
            <Dropdown.Item onClick={() => setEntityType("person")}>People</Dropdown.Item>
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
          entityIds={sortedUnselectedEntityIds}
          entityIdNameMap={entityIdNameMap}
          onEntityClick={onEntityClick}
        />
      </div>
    </PageSizeWrapper>
  );
};

export default Home;
