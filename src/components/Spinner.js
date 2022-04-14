import React from "react";
import { Loader, Dimmer } from "semantic-ui-react";

const Spinner = () => {
  return (
    <Dimmer active={true}>
      <Loader size="huge" content={"Preparing chat ...."} />
    </Dimmer>
  );
};

// const mapStateToProps = (state) => {
//   return { currentUser: state.user };
// };

// export default connect(mapStateToProps, { setUserAction })(Loader);

export default Spinner;
