import React from "react";
import { FaWallet } from "react-icons/fa";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";

import WalletPicker from "../organisms/WalletPicker";

import { useToggle } from "../../hooks/useToggle";

const WalletInput = ({
  label,
  error,
  placeholder,
  hint,
  wallet,
  wallets,
  onChange,
  name,
  ...props
}) => {
  const { show, toggle } = useToggle();

  const { w, m, weight, display, color, textColor, ...styleProps } = props;

  const change = (selectedWallet) => {
    return onChange({
      target: {
        name: name,
        type: "wallet",
        value: selectedWallet.symbol,
        rawValue: selectedWallet,
      },
    });
  };

  const walletName = wallets.find(
    (w) => w.symbol.toLowerCase() === wallet?.toLowerCase()
  );

  return (
    <Container
      wide={!w}
      w={w}
      m={m || "8px 0"}
      weight={weight}
      display={display}
    >
      <Text
        color={error ? "danger" : color || undefined}
        font="12px"
        p="5px 12px"
        bold
      >
        {error || label}
      </Text>
      <Text
        bg="bg"
        p="12px 8px 12px 12px"
        radius="4px"
        onClick={toggle}
        flexalign
        color={textColor || undefined}
        {...styleProps}
      >
        {walletName?.name || placeholder}
        <SubText font="16px" p="0" m="0 0 0 auto" opacity="0.7" flexalign>
          <FaWallet />
        </SubText>
      </Text>
      <WalletPicker
        open={show}
        dismiss={toggle}
        title={hint || label}
        wallets={wallets}
        action={change}
      />
    </Container>
  );
};

export default WalletInput;
