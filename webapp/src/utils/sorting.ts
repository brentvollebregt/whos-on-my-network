import { DeviceSummary, PersonSummary } from "../api/dto";

export const sortDevices = (devices: DeviceSummary[] | undefined) =>
  devices
    ?.slice() // Do not modify the original list
    .sort((a, b) => -a.last_seen.diff(b.last_seen).as("milliseconds")) // Initially sort by last seen time
    .sort((a, b) => {
      if (a.name === b.name) {
        return 0;
      } else if (a.name === "") {
        return 1;
      } else if (b.name === "") {
        return -1;
      } else {
        return a.name > b.name ? 1 : -1;
      }
    }); // Then sort by names (empty names are lowest)

export const sortPeople = (people: PersonSummary[] | undefined) =>
  people?.sort((a, b) => (a.name === b.name ? 0 : a.name > b.name ? 1 : -1));
