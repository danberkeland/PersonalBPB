import React from "react";

import BuildCurrentStandingList from "./BuildCurrentStandingList";

const StandingOrderEntry = ({ standArray, setStandArray }) => {
  return (
    <React.Fragment>
      <BuildCurrentStandingList
        standArray={standArray}
        setStandArray={setStandArray}
      />
    </React.Fragment>
  );
};

export default StandingOrderEntry;
