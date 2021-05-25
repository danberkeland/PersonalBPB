import React from "react";

import BuildCurrentStandingList from "./BuildCurrentStandingList";

const StandingOrderEntry = ({ standArray, setStandArray, database, setDatabase }) => {

  return (
    <React.Fragment>
      <BuildCurrentStandingList
        standArray={standArray}
        setStandArray={setStandArray}
        database={database}
        setDatabase={setDatabase}
      />
    </React.Fragment>
  );
};

export default StandingOrderEntry;
