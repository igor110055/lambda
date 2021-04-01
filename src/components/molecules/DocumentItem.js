import React from "react";
import styled from "styled-components";
import { FaDownload, FaTrash } from "react-icons/fa";

import Text from "../atoms/Text";
import Container from "../atoms/Container";

const Trash = styled(FaTrash)`
  color: ${({ theme }) => theme.colors.danger};
  width: 13px;
`;

const Download = styled(FaDownload)`
  color: ${({ theme }) => theme.colors.primary};
  width: 16px;
`;

export const DocumentItem = ({ title, document, destroy: destroyAction }) => {
  const destroy = () => destroyAction(document.cloudId);

  if (!document.url) return null;
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
        {document.date && (
          <Text font="10px" p="0" opacity="0.6">
            {new Date(document.date).toDateString()}{" "}
            {new Date(document.date).toLocaleTimeString()}
          </Text>
        )}
      </Container>
      <Container w="52px" flex="space-between" align="baseline">
        <Trash onClick={destroy} />
        <a href={document.url} download>
          <Download />
        </a>
      </Container>
    </Container>
  );
};

export default DocumentItem;
