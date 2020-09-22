import React, {useState, useEffect} from 'react';
import moment from 'moment';

const useWeekSplit = (rosters) => {
    const [current, setCurrent] = useState([]);
    const [future, setFuture] = useState([]);
    const [previous, setPrevious] = useState([]);
    const startOfWeek = moment().startOf("week");
    console.log(rosters);
    useEffect(() => {
      let tempCurrent = rosters.filter((roster) => {
        return startOfWeek.isSame(moment(roster.weekStart));
      });
      setCurrent(tempCurrent);
      let tempFuture = rosters.filter((roster) => {
        return startOfWeek.isBefore(moment(roster.weekStart));
      });
      setFuture(tempFuture);
      let tempPrevious = rosters.filter((roster) => {
        return startOfWeek.isAfter(moment(roster.weekStart));
      });
      setPrevious(tempPrevious);
      console.log(moment(tempCurrent[0].weekStart).valueOf());
    }, [rosters]);
  
    console.log(current, future, previous);
  
    return [current, future, previous];
  };

  export default useWeekSplit;