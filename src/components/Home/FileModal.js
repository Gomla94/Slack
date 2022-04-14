import React, { useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "../../firebase";

const FileModal = (props) => {
  const [file, setFile] = useState(null);
  const [authorized, setAuthorized] = useState(["png", "jpeg", "jpg"]);

  const changeModalHandler = () => {
    props.setOpenFileModal(false);
  };

  const fileIsAuthorized = (file) => {
    const { name } = file;
    const fileExtension = name.split(".");
    return authorized.includes(fileExtension.pop());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (file !== null) {
      if (fileIsAuthorized(file)) {
        props.uploadFile(file);
      }
    }
  };

  const inputFileChangeHandler = (e) => {
    setFile(e.target.files[0]);
  };

  return props.openFileModal ? (
    <div>
      <div className="modal-container"></div>
      <div className="modal-wrapper">
        <div className="close-modal-wrapper" onClick={changeModalHandler}>
          <i className="fa-solid fa-xmark fa-2x"></i>
        </div>
        <div className="add-channel-header">Upload Media File (png, jpg)</div>
        <div className="modal-form-wrapper">
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div className="form-group">
              <label htmlFor="channel-name">Media</label>
              <div className="media-input-wrapper">
                <div className="media-input-type-wrapper">
                  <span>File Types: PNG, JPG</span>
                </div>
                <input
                  type="file"
                  className="form-control file-input"
                  name="channelName"
                  placeholder="Channel Name"
                  onChange={(e) => {
                    inputFileChangeHandler(e);
                  }}
                />
              </div>
            </div>

            <div className="modal-buttons-wrapper">
              <button
                type="button"
                onClick={(e) => {
                  handleSubmit(e);
                }}
                className="submit-btn"
              >
                Submit
              </button>
              <button
                type="button"
                className="close-btn"
                onClick={(e) => {
                  changeModalHandler(e);
                }}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default FileModal;
