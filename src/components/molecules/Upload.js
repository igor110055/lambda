import React, { useRef } from "react";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import Image from "../atoms/Image";

const Upload = ({
  title,
  desc,
  image,
  action,
  capture,
  accept,
  hint,
  retake,
  w,
  h,
  radius,
}) => {
  const inputRef = useRef();

  return (
    <Container name={title}>
      <Container flexCol="center" wide>
        <Text p="0" m="0 0 4px 0" opacity="0.6" bold>
          {title}
        </Text>
        <Text p="0" font="12px" opacity="0.8">
          {desc}
        </Text>
      </Container>

      <Container p="24px 12px" flexCol="center" h="auto">
        <input
          ref={inputRef}
          type="file"
          accept={accept || "image/png,image/jpeg"}
          capture={capture}
          onChange={action}
          hidden
        />
        {image ? (
          <>
            <Image
              src={image}
              h={h || "300px"}
              w={w || "300px"}
              radius={radius || "4px"}
              alt=""
            />
          </>
        ) : (
          <Container
            p="12px"
            border="2px solid"
            radius={radius || "4px"}
            w={w || "300px"}
            h={h || "300px"}
            flex="center"
            fit="initial"
            onClick={() => inputRef.current.click()}
            pointer
          >
            <Text font="12px" p="0" bold opacity="0.6">
              {hint || "Click here to upload image"}
            </Text>
          </Container>
        )}
      </Container>

      {image && (
        <Text
          font="11px"
          p="0"
          align="center"
          bold
          onClick={() => inputRef.current.click()}
        >
          {retake || "Select another image"}
        </Text>
      )}
    </Container>
  );
};

export default Upload;
