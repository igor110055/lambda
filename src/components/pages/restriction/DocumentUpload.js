import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Spinner from "../../atoms/Spinner";

import Upload from "../../molecules/Upload";

import AuthLayout from "../../templates/Auth";

import { useProcess } from "../../../hooks/useProcess";
import { useProfile } from "../../../hooks/useProfile";

import axiosInstance from "../../../utils/axios";
import { compressImageDataURL } from "../../../utils/compress";

const DocumentSelfie = () => {
  const history = useHistory();
  const { profile } = useProfile();

  const { processing, success, response, start, complete, fail } = useProcess();

  const [document, setDocument] = useState();

  const handleDocument = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setDocument(reader.result);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const compressedBase64 = compressImageDataURL(document);

    try {
      start();
      await axiosInstance.post("/profile/document/upload", {
        document: compressedBase64,
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
      fail(err.response.message);
      console.log(err, err.response);
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
      <Container as="form" wide onSubmit={onSubmit}>
        <Upload
          image={document}
          action={handleDocument}
          hint="Select Document"
        />
        {!processing && !success && !(response === "Processing...") && (
          <Text p="0" m="4px 0 0 0" align="center" color="danger" bold>
            {response}
          </Text>
        )}
        <Button
          type="submit"
          bg="primary"
          radius="6px"
          p="12px 12px"
          m="12px 0"
          font="13px"
          full
          bold
          disabled={processing || !document}
        >
          {processing ? (
            <Spinner />
          ) : document ? (
            "Upload Document"
          ) : (
            "Choose an image"
          )}
        </Button>
      </Container>
    </AuthLayout>
  );
};

export default DocumentSelfie;
