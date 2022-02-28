import React from "react";
import styled from "styled-components";
import { ReactSVG } from "react-svg";

import { ReactComponent as FallBackLogo } from "../../assets/icons/generic.svg";

const Icon = styled(ReactSVG)`
  --size: ${({ size }) => size || "36px"};
  height: var(--size);
  width: var(--size);
  min-width: var(--size);

  svg {
    height: var(--size);
    width: var(--size);

    min-width: var(--size);

    /* border-radius: 50%; */
  }
`;

const WalletIcon = ({ symbol, ...props }) => {
  return (
    <Icon
      fallback={() => <FallBackLogo />}
      loading={() => <FallBackLogo />}
      src={`/assets/icons/coin/${symbol.toLowerCase()}.svg`}
      {...props}
    />
  );
};
export default WalletIcon;
