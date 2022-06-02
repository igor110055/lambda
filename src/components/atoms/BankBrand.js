import React from "react";
import styled from "styled-components";
import { ReactSVG } from "react-svg";

import Loader from "../molecules/Loader";
import { FaUniversity } from "react-icons/fa";

const Icon = styled(ReactSVG)`
  height: ${({ size }) => size || "40px"};
  overflow: hidden;
  background: ${({ bg }) => bg};
  border-radius: 4px;

  svg {
    height: ${({ size }) => size || "40px"};
    width: 40px;
    padding: 4px;

    vertical-align: top;
  }
`;

const BankBrand = ({ ...props }) => {
  return (
    <Icon
      fallback={() => ""}
      loading={() => <Loader w="40px" h={props.size || "40px"} radius="4px" />}
      src={`/assets/icons/bank/boa.svg`}
      bg="primary"
      {...props}
    />
  );
};

export const BankDefaultBrand = styled(FaUniversity)`
  height: ${({ size }) => size || "40px"};
  width: 40px;
  padding: 4px;
  vertical-align: top;

  background: ${({ bg }) => bg && bg};
  color: ${({ color }) => color || "white"};
  border-radius: 4px;
`;

export default BankBrand;
