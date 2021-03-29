import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";

import Upload from "../../molecules/Upload";

import ProcessModal from "../../organisms/ProcessModal";
import ConfirmationModal from "../../organisms/ConfirmationModal";

import { useProfile } from "../../../hooks/useProfile";
import { useProcess } from "../../../hooks/useProcess";
import { useToggle } from "../../../hooks/useToggle";

import axiosInstance from "../../../utils/axios";
import { compressImageDataURL } from "../../../utils/compress";

const ProfilePhoto = () => {
  const history = useHistory();
  const { profile, mutate } = useProfile();

  const {
    show,
    processing,
    response,
    success,
    start,
    complete,
    close,
  } = useProcess();

  const {
    show: showConfirmationModal,
    toggle: toggleConfirmationModal,
  } = useToggle();

  const [profilePhoto, setProfilePhoto] = useState();

  const handleProfilePhoto = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setProfilePhoto(reader.result);
  };

  const uploadPhoto = async () => {
    const compressedBase64 = compressImageDataURL(profilePhoto);
    try {
      start();
      await axiosInstance.post("/profile/avatar", {
        profilePhoto: compressedBase64,
      });
      complete("Image Uploaded Successfully");
      mutate();
      history.goBack();
    } catch (err) {
      complete("Done");
      mutate();
      history.goBack();
      // console.log(err.response);
    }
  };

  const deletePhoto = async () => {
    // console.log("deleting");
    try {
      await axiosInstance.delete("/profile/avatar");
      mutate();
      history.goBack();
    } catch (err) {
      // console.log(err.response);
    }
  };

  return (
    <Container wide>
      <Container flex="center" h="80px">
        <Text font="16px" p="12px 0" bold>
          Upload profile photo
        </Text>
      </Container>

      <Upload
        image={profilePhoto}
        action={handleProfilePhoto}
        hint="Select profile photo"
      />

      <Container p="24px 12px" flexCol="center" wide>
        <Button
          radius="4px"
          max="480px"
          bg="primary"
          bold
          full
          disabled={!profilePhoto}
          onClick={uploadPhoto}
        >
          {profilePhoto ? "Submit" : "Choose an image"}
        </Button>
        {profile.avatar && (
          <Text pointer bold onClick={toggleConfirmationModal}>
            Reset Profile Photo
          </Text>
        )}
        <ProcessModal
          title="Uploading Photo"
          open={show}
          processing={processing}
          response={response}
          success={success}
          dismiss={close}
        />
        <ConfirmationModal
          open={showConfirmationModal}
          dismiss={toggleConfirmationModal}
          action={deletePhoto}
          title="Remove Profile Photo"
          message="Are you sure you want to remove profile photo?"
          preventDismiss
        />
      </Container>
    </Container>
  );
};

export default ProfilePhoto;
