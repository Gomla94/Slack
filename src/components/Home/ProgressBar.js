import react from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ uploadStatus, uploadPercentage }) => {
  return (
    uploadStatus === "uploading" && (
      <Progress
        className="progress-bar"
        indicating
        progress
        percent={uploadPercentage}
        // size="medium"

        // inverted
      />
    )
  );
};

export default ProgressBar;
