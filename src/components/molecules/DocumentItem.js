import React from "react";
import { FaDownload } from "react-icons/fa";

import Text from "../atoms/Text";
import Container from "../atoms/Container";

export const DocumentItem = ({ title, date, url }) => {
  if (!url) return null;
  return (
    <Container
      p="12px"
      m="12px 0"
      border="1px solid"
      radius="12px"
      flex="space-between"
      wide="true"
    >
      <Container flexCol="flex-start" wide>
        <Text font="12px" p="0" m="0 0 4px 0" bold>
          {title}
        </Text>
        {date && (
          <Text font="10px" p="0" opacity="0.6">
            {new Date(date).toDateString()}{" "}
            {new Date(date).toLocaleTimeString()}
          </Text>
        )}
      </Container>
      <a href={url} download>
        <FaDownload />
      </a>
    </Container>
  );
};

export default DocumentItem;
