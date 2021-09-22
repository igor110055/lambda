import React, { useState, useRef } from "react";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Spinner from "../../atoms/Spinner";

import AuthLayout from "../../templates/Auth";

import { useProfile } from "../../../hooks/useProfile";
import { useProcess } from "../../../hooks/useProcess";

import axiosInstance from "../../../utils/axios";

const DocumentSelfie = () => {
  const history = useHistory();
  const { profile } = useProfile();

  const { processing, start, complete } = useProcess();

  const inputRef = useRef();
  const [document, setDocument] = useState();
  const [error, setError] = useState(null);

  const handleDocument = (e) => {
    const file = e.target.files[0];
    setError(null);
    setDocument(null);
    if (file) {
      if (file.size / 1024 ** 2 > 10)
        return setError("File too large, max file size is 10 MB");

      setDocument(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", document);
    formData.append("upload_preset", `globalassetfx_public`);

    try {
      start();
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/flashtradefx/image/upload`,
        formData
      );
      await axiosInstance.post("/profile/document/upload", {
        url: data.secure_url,
        cloudId: data.public_id,
      });
      complete({ mssg: "Document Submitted Successfully" });
      history.push({
        pathname: "/confirmation/documents/completed",
        state: {
          title: "Upload Successful",
          message:
            "Thank you. Your documents has been received and is currently being processed.",
        },
      });
    } catch (err) {
      setError("Something went wrong!");
      complete();
      // console.log(err, err.response);
    }
  };

  if (!profile.requestedDocument) return <Redirect to="/dashboard" />;

  return (
    <AuthLayout>
      <Container p="12px 0" wide>
        <Text font="16px" p="0" align="center" bold>
          Upload {profile.requestedDocument}
        </Text>
        <Text
          font="11px"
          p="0"
          m="12px 0 0 0"
          align="center"
          opacity="0.6"
          bold
          multiline
        >
          {profile.requestedDocumentDescription}
        </Text>
      </Container>
      <Container wide>
        <input ref={inputRef} type="file" onChange={handleDocument} hidden />

        <Container p="48px 0" flex="space-between" wide>
          <Text>{document?.name || "No file chosen"}</Text>
          <Button p="6px" bg="primary" onClick={() => inputRef.current.click()}>
            {document ? "Choose another file" : "Choose file"}
          </Button>
        </Container>

        {error && (
          <Text p="0" m="4px 0 0 0" align="center" color="danger" bold>
            {error}
          </Text>
        )}
        <Button
          bg="primary"
          radius="6px"
          p="12px 12px"
          m="12px 0"
          font="13px"
          full
          bold
          disabled={processing || !document}
          onClick={handleSubmit}
        >
          {processing ? (
            <Spinner />
          ) : document ? (
            "Upload Document"
          ) : (
            "Choose a document"
          )}
        </Button>
      </Container>
    </AuthLayout>
  );
};

export default DocumentSelfie;
