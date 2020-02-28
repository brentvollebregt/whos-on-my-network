import { useState, useEffect } from "react";

import { PersonSummary } from "../api/dto";
import { getPeopleByFilter } from "../api";
import { genericApiErrorMessage } from "../utils/toasts";

const useAllPeople = () => {
  const [people, setPeople] = useState<PersonSummary[] | undefined>(undefined);

  const refresh = () => {
    getPeopleByFilter()
      .then(p => setPeople(p))
      .catch(err => genericApiErrorMessage("people"));
  };

  useEffect(() => {
    refresh();
  }, []);

  return { people, refresh };
};

export default useAllPeople;
