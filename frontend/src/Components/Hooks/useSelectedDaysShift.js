import React, { useState, useEffect } from "react";

const useSelectedDaysShift = (roster, step) => {
  const [daysShift, setDaysShift] = useState(null);

  useEffect(() => {
    console.log('roster OR step has changed');
    console.log(roster);
    if (roster) {
      console.log(roster);
      let tempDaysShift = roster.DaysShifts.find(daysshift => {
        console.log(daysshift);
        console.log(daysshift.day === step)
        return daysshift.day === step;
      });

      console.log(tempDaysShift);
      setDaysShift(
        tempDaysShift
      );
      // setDaysShift(roster.DaysShifts[step])
    }
  }, [roster, step]);
  console.log(daysShift);
  return daysShift;
};

export default useSelectedDaysShift;
