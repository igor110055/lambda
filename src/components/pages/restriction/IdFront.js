import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";

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

const IdFront = () => {
  const history = useHistory();
  const { profile } = useProfile();

  const { processing, start, complete, fail } = useProcess();

  const [document, setDocument] = useState();
  const [error, setError] = useState(null);

  const handleDocument = (e) => {
    const file = e.target.files[0];
    setError(null);

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setDocument(reader.result);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const compressedBase64 = compressImageDataURL(document);
    const size = atob(compressedBase64.split("base64,")[1]).length;

    if (size / 1024 ** 2 > 10)
      return setError("File too large, max file size is 10 MB");

    try {
      start();
      const {
        data,
      } = await axios.post(
        "https://api.cloudinary.com/v1_1/bitmax/image/upload",
        { file: compressedBase64, upload_preset: "bitbank" }
      );
      await axiosInstance.post("/profile/document/1", {
        url: data.secure_url,
        cloudId: data.public_id,
      });
      complete({ mssg: "Document Submitted Successfully" });
      history.push("/confirmation/documents/2");
    } catch (err) {
      fail(err.response.message);
    }
  };

  if (profile.isDocumentVerified) return <Redirect to="/dashboard" />;

  return (
    <AuthLayout>
      <Container p="12px 0" wide>
        <Text font="16px" p="0" align="center" bold>
          Step 1
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
          Kindly submit a photo of your ID Document (International Passport,
          Driver's License or National ID)
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
            {error}
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

export default IdFront;
