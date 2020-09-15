import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRosterContext } from "../../../Context/RosterContext";

const useRoster = () => {
  const rosterId = Number(useParams().rosterId);
  const rosterContext = useRosterContext();
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    const daysRoster = rosterContext.rosterData.filter((roster) => {
      return roster.id === rosterId;
    });
    console.log('in use roster');
    console.log(rosterContext);
    console.log(daysRoster);
    setRoster(daysRoster);
  }, [rosterId, rosterContext.rosterData]);

  return roster[0];
};

export default useRoster;
