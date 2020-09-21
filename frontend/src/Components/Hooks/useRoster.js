import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRosterContext } from "../../Context/RosterContext";

const useRoster = (step) => {
  const rosterId = Number(useParams().rosterId);
  const rosterContext = useRosterContext();
  const [roster, setRoster] = useState([]);
  const [daysShift, setDaysShift] = useState(null);
  useEffect(() => {
    const daysRoster = rosterContext.rosterData.filter((roster) => {
      return roster.id === rosterId;
    });
    setRoster(daysRoster);
  }, [rosterId, rosterContext.rosterData]);

  useEffect(() => {
    if (roster.length !== 0) {
      let tempDaysShift = roster[0].DaysShifts.find(daysshift => {
        return daysshift.day === step;
      });

      console.log(tempDaysShift);
      setDaysShift(
        tempDaysShift
      );
      // setDaysShift(roster.DaysShifts[step])
    }
  }, [step, roster])

  return {roster: roster[0], selectedDaysShift: daysShift};
};

export default useRoster;
