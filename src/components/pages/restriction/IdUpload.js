import React, { useRef, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useProcess } from "../../../hooks/useProcess";
import { useProfile } from "../../../hooks/useProfile";
import axiosInstance from "../../../utils/axios";
import Button from "../../atoms/Button";
import Container from "../../atoms/Container";
import Spinner from "../../atoms/Spinner";
import Text from "../../atoms/Text";
import AuthLayout from "../../templates/Auth";

const IdUpload = () => {
  const history = useHistory();
  const { profile } = useProfile();

  const { processing, response, start, complete, fail } = useProcess();

  const [idFront, setIdFront] = useState({
    name: null,
    file: null,
  });
  const [idBack, setIdBack] = useState({
    name: null,
    file: null,
  });
  const [error, setError] = useState(false);

  const frontIdInputRef = useRef();
  const backIdInputRef = useRef();

  const handleIdFront = (e) => {
    setError(false);
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setIdFront({ name: file.name, file: reader.result });
    };
  };

  const handleIdBack = (e) => {
    setError(false);
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setIdBack({ name: file.name, file: reader.result });
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    try {
      start();

      if (!idFront.file || !idBack.file) {
        setError(true);
        return fail("Please select documents");
      }

      await axiosInstance.post("/profile/document/1", {
        document: idFront.file,
      });
      await axiosInstance.post("/profile/document/2", {
        document: idBack.file,
      });
      complete({ mssg: "Document Submitted Successfully" });
      history.push("/confirmation/documents/2");
    } catch (err) {
      setError(true);
      fail(err.response?.message);
    }
  };

  if (profile.isDocumentVerified) return <Redirect to="/dashboard" />;

  return (
    <AuthLayout>
      <Container p="12px 0" wide>
        <Text font="16px" p="0" align="center" bold>
          Upload ID
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
        <input
          ref={frontIdInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleIdFront}
          hidden
        />

        <Text bold opacity="0.6" font="11px" m="0">
          Upload front of ID
        </Text>
        <Container p="0 0 12px" flex="space-between" wide>
          <Text>{idFront.name || "No file chosen"}</Text>
          <Button
            p="6px"
            bg="primary"
            type="button"
            onClick={() => frontIdInputRef.current.click()}
          >
            {idFront.file ? "Choose another file" : "Choose file"}
          </Button>
        </Container>

        <input
          ref={backIdInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleIdBack}
          hidden
        />

        <Text bold opacity="0.6" font="11px" m="0">
          Upload back of ID
        </Text>
        <Container p="0 0 12px" flex="space-between" wide>
          <Text>{idBack.name || "No file chosen"}</Text>
          <Button
            p="6px"
            bg="primary"
            type="button"
            onClick={() => backIdInputRef.current.click()}
          >
            {idBack.file ? "Choose another file" : "Choose file"}
          </Button>
        </Container>

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
          disabled={processing}
        >
          {processing ? <Spinner /> : "Upload"}
        </Button>
      </Container>
    </AuthLayout>
  );
};

export default IdUpload;
