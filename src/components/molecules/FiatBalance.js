import React, { useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import WalletIcon from "../atoms/WalletIcon";

import { useWalletBalance } from "../../hooks/useBalance";
import { getFiat } from "../../store/supportedWallets";

const FiatBalance = ({ id, ...props }) => {
  const [showTotal, setShowTotal] = useState(false);

  const wallet = getFiat(id)

  const { available, total } = useWalletBalance(id);
  
  return (
    <Container wide {...props}>
      <Container p="12px 0 24px" flex="flex-start" wide>
        <WalletIcon symbol={wallet?.symbol} size="40px" />
        <Text m="0 0 0 12px" font="16px" p="0" bold>
          {wallet?.name} Account
        </Text>
      </Container>
      <Container p="12px 0" wide>
        <Container flex="space-between" wide>
          <Container wide>
            <Text p="0" m="0 0 12px" bold>
              {showTotal ? "Total" : "Available"} Balance
            </Text>
            <Text p="0 0 6px" font="28px" weight="400">
              {showTotal ? total : available}
            </Text>
          </Container>
          <Text
            bg={showTotal ? "secondary" : "primary"}
            color="white"
            font="24px"
            multiline
            p="6px"
            radius="4px"
            pointer
            bold
            flexalign
            onClick={() => setShowTotal(!showTotal)}
          >
            <AiOutlineSwap />
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

export default FiatBalance;
