import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Spinner from "../../atoms/Spinner";

import Upload from "../../molecules/Upload";

import AuthLayout from "../../templates/Auth";

import { useProfile } from "../../../hooks/useProfile";
import { useProcess } from "../../../hooks/useProcess";

import axiosInstance from "../../../utils/axios";
import { compressImageDataURL } from "../../../utils/compress";

const IdBack = () => {
  const history = useHistory();
  const { profile } = useProfile();

  const { processing, response, start, complete, fail } = useProcess();

  const [document, setDocument] = useState();
  const [error, setError] = useState(false);

  const handleDocument = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setDocument(reader.result);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    const compressedBase64 = compressImageDataURL(document);

    try {
      start();
      await axiosInstance.post("/profile/document/2", {
        document: compressedBase64,
      });
      complete({ mssg: "Document Submitted Successfully" });
      history.push("/confirmation/documents/3");
    } catch (err) {
      setError(true);
      fail(err.response.message);
    }
  };

  if (!profile.idFront) return <Redirect to="/confirmation/documents/1" />;

  return (
    <AuthLayout>
      <Container p="12px 0" wide>
        <Text font="16px" p="0" align="center" bold>
          Step 2
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
          Kindly submit a photo of the back of your ID document
        </Text>
      </Container>
      <Container as="form" wide onSubmit={onSubmit}>
        <Upload
          image={document}
          action={handleDocument}
          hint="Select Document"
        />
        {error && (
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
            "Upload Photo"
          ) : (
            "Choose an image"
          )}
        </Button>
      </Container>
    </AuthLayout>
  );
};

export default IdBack;
