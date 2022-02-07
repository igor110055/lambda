import React, { useRef, useState } from "react";
import axios from "axios";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import Button from "../atoms/Button";

import axiosInstance from "../../utils/axios";

const ReceiptUpload = () => {
  const [state, setState] = useState({
    error: false,
    message: null,
    loading: false,
    image: null,
  });
  const inputRef = useRef();

  const handleChange = (e) => {
    const file = e.target.files[0];

    setState((prev) => ({ ...prev, error: false, image: null }));

    if (file) {
      if (file.size / 1024 ** 2 > 10) {
        return setState((prev) => ({
          ...prev,
          error: true,
          message: "File too large, max file size is 10 MB",
        }));
      }

      setState((prev) => ({ ...prev, image: file }));
    }
  };

  const upload = async () => {
    setState((prev) => ({ ...prev, loading: true, error: false }));

    const formData = new FormData();
    formData.append("file", state.image);
    formData.append("upload_preset", `ameritradehub_public`);

    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/flashtradefx/image/upload`,
        formData
      );


      await axiosInstance.post("/profile/receipt/upload", {
        url: data.secure_url,
        cloudId: data.public_id,
      });
      setState((prev) => ({
        ...prev,
        loading: false,
        message: "Document Submitted Successfully",
        image: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: true,
        message: "Something went wrong!",
        image: null,
      }));
      console.log(err, err.response);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleChange}
        hidden
      />
      <Text p="0 12px" bold>
        Upload Receipt
      </Text>
      <Text
        font="12px"
        multiline
        opacity={state.message ? "1" : "0.6"}
        color={state.error ? "danger" : "text"}
      >
        {state.message ||
          "After a successful deposit kindly upload your deposit receipt"}
      </Text>
      <Container bg="bg" p="24px" radius="24px" flex="space-between">
        <Text
          font="12px"
          opacity="0.8"
          w="100%"
          pointer
          onClick={() => inputRef.current.click()}
        >
          {state.image ? "1 File selected" : "Select file..."}
        </Text>
        <Button
          bg="primary"
          p="12px 24px"
          radius="12px"
          bold
          disabled={!state.image}
          onClick={upload}
        >
          {state.loading ? "Please wait" : "Upload"}
        </Button>
      </Container>
    </>
  );
};

export default ReceiptUpload;
