import React, {useState,useEffect} from 'react';

const useSelectedDaysShift = (roster, step) => {
    const [daysShift, setDaysShift] = useState(null);

    useEffect(() => {        
        if(roster){
            setDaysShift(roster.DaysShifts[step])
        }
    }, [roster, step])
    console.log(daysShift);
    return daysShift;
};

export default useSelectedDaysShift;