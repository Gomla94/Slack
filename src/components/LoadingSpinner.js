import React from "react";
import { Loader, Dimmer } from "semantic-ui-react";

const LoadingSpinner = () => {
  return (
    <Dimmer active={true}>
      <Loader size="huge" content={"Loading ...."} />
    </Dimmer>
  );
};

export default LoadingSpinner;
