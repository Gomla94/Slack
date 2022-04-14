import React, { useState, Fragment } from "react";
import { ref, set } from "firebase/database";
import { database } from "../../firebase";
import FileModal from "./FileModal";
import {
  getStorage,
  uploadBytesResumable,
  ref as storageReference,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import ProgressBar from "./ProgressBar";

const MessagesForm = (props) => {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedPercentage, setUploadedPercentage] = useState(0);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const changeFileModalStatus = () => {
    setOpenFileModal(!openFileModal);
  };

  const createMessage = (fileUrl = null) => {
    const newMessage = {
      id: Date.now(),
      timestamp: Date.now(),
      user: {
        id: props.currentUser.currentUser.uid,
        name: props.currentUser.currentUser.displayName,
        avatar: props.currentUser.currentUser.photoURL,
      },
    };

    if (fileUrl !== null) {
      newMessage["imageURL"] = fileUrl;
    } else {
      newMessage["content"] = message;
    }
    return newMessage;
  };

  const sendMessage = async (fileUrl = null) => {
    const currentMessage = createMessage(fileUrl);
    if (currentMessage.content || currentMessage.imageURL) {
      try {
        setErrors([]);
        setLoading(true);

        await set(
          ref(database, `${props.messagesRef}/${currentMessage.id}`),
          currentMessage
        );
        setMessage("");
        setLoading(false);
      } catch (error) {
        setErrors(errors.concat(error));
        console.log(error);
      }
    } else {
      setErrors([...errors, { error: "Please enter a message" }]);
    }
  };

  const getPath = () => {
    if (props.isPrivateChannel) {
      return `/chat/private-${props.currentChannel.currentChannel.id}/`;
    } else {
      return "/chat/public/";
    }
  };

  const uploadFile = (file) => {
    const pathToUpload = props.currentChannel.currentChannel.id;
    const storage = getStorage();
    const filePath = `${getPath()}${uuidv4()}.jpg`;
    const storageRef = storageReference(storage, filePath);
    const metaData = {
      contentType: `images/${file.name.split(".").pop()}`,
    };

    setUploadStatus("uploading");
    setOpenFileModal(false);
    const uploadTask = uploadBytesResumable(storageRef, file, metaData);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploadedPercentage(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
      },
      (error) => {
        setErrors([...errors, error]);
        setUploadStatus("error");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadUrl) => {
            setUploadStatus("done");
            sendFileMessage(downloadUrl);
          })
          .catch((error) => {
            console.log(error);
            setErrors([...errors, error]);
          });
      }
    );
  };

  const sendFileMessage = (fileUrl) => {
    sendMessage(fileUrl);
  };

  return (
    <Fragment>
      <div className="messages-form-wrapper">
        <div className="message-input-wrapper">
          <div className="plus-wrapper">
            <i className="fa-solid fa-plus"></i>
          </div>
          <input
            type="text"
            onChange={(e) => handleChange(e)}
            placeholder="Enter your message"
            value={message}
            className={errors.length > 0 ? "error-input" : ""}
          />
        </div>
        <div className="message-form-inputs-wrapper">
          <div className="reply-button-wrapper">
            <button
              onClick={() => {
                sendMessage();
              }}
              disabled={loading ? true : false}
            >
              <div className="reply-button-icon-wrapper">
                <i className="fa-solid fa-pen-to-square"></i>
              </div>
              <span className="reply-button-text">Add Reply</span>
            </button>
          </div>
          <div className="media-button-wrapper">
            <button
              onClick={changeFileModalStatus}
              disabled={uploadStatus === "uploading"}
            >
              <span className="media-button-text">Upload Media</span>
              <div className="media-button-icon-wrapper">
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </div>
            </button>
          </div>
        </div>
        <ProgressBar
          uploadStatus={uploadStatus}
          uploadPercentage={uploadedPercentage}
        />
      </div>

      <FileModal
        openFileModal={openFileModal}
        setOpenFileModal={setOpenFileModal}
        uploadFile={uploadFile}
      />
    </Fragment>
  );
};

export default MessagesForm;
