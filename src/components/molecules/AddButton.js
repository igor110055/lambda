import React from "react";
import { FaPlus } from "react-icons/fa";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";

const AddButton = ({ title, to }) => {
  return (
    <Container p="12px" flex="flex-end" w="auto">
      <Text
        p="6px 12px"
        radius="4px"
        bg="primary"
        color="white"
        font="11px"
        bold="true"
        flexalign="true"
        to={to}
      >
        {title}
        <SubText p="0" m="0 0 0 8px" font="inherit" flexalign>
          <FaPlus />
        </SubText>
      </Text>
    </Container>
  );
};

export default AddButton;
