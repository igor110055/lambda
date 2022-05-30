import React from "react";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import WalletIcon from "../atoms/WalletIcon";

const WalletCard = ({ wallet, action, ...props }) => {
  const onClick = () => action(wallet);

  return (
    <Container
      p="12px 0"
      h="64px"
      w="200px"
      radius="12px"
      noscroll="true"
      display="grid"
      templaterows="40px auto 14px"
      bg="bg"
      onClick={onClick}
      {...props}
    >
      <Container p="12px" flex="flex-start" wide>
        <WalletIcon symbol={wallet.symbol} size="32px" />
        <Container
          m="0 0 0 12px"
          flexCol="flex-start"
          justify="space-between"
          h="32px"
        >
          <Text font="13px" p="0" bold>
            {wallet.name}
          </Text>
          <Text font="12px" p="0" opacity="0.6" bold>
            {wallet.symbol}
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

export default WalletCard;
