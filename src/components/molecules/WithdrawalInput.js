import React, { useCallback } from "react";
import { FaCreditCard, FaUniversity } from "react-icons/fa";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";

import WithdrawalPicker from "../organisms/WithdrawalPicker";

import { useToggle } from "../../hooks/useToggle";

const WithdrawalInput = ({
  label,
  error,
  placeholder,
  hint,
  method,
  banks,
  noadd,
  onChange,
  name,
  ...props
}) => {
  const { show, toggle } = useToggle();

  const { w, m, weight, display, color, ...styleProps } = props;

  const change = ({ selected, type }) => {
    return onChange({
      target: {
        name,
        type,
        value: selected,
        rawValue: selected,
      },
    });
  };

  const isMatch = useCallback((type) => typeof method === "object" ? method?.type === type : null, [method])
  const isFallbackMatch = useCallback((checker) => typeof method === "string" ? checker(method) : null, [method])

  // for backwards compatibility method might still be stored in db as a string
  // so check if method type matches criteria then fallback to previous checks
  const bank = isMatch("bank") ? method.address : isFallbackMatch((m) => banks.some((b) => b._id === m));
  const address = isMatch("address") ? method.address : isFallbackMatch((m) => m?.startsWith("address://") ? ({value: m?.replace("address://", "")}) : null);
  // for newer api since method might still be stored as a string in db
  // only check if method type matches criteria otherwise return null, example below
  // const match = isMatch("match") ? method.address : null
  const paypal = isMatch("paypal") ? method.address : null
  const skrill = isMatch("skrill") ? method.address : null

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
        font="11px"
        p="5px 12px"
        bold
      >
        {error || label}
      </Text>
      <Text
        as="div"
        // bg="bg"
        border="1px solid"
        bordercolor="#4ac1e0"
        p="0 8px 0 12px"
        radius="4px"
        onClick={toggle}
        flexalign
        {...styleProps}
      >
        <SubText p="12px 0" font="inherit">
          {bank
            ? `${bank.bank.toUpperCase()} - ${bank.accountNumber}`
            : address
            ? address.value
            : paypal
            ? "Paypal - "+ paypal.value
            : skrill
            ? "Skrill - "+ skrill.value
            : placeholder}
        </SubText>

        <SubText
          as="div"
          font="16px"
          p="0"
          m="0 0 0 auto"
          opacity="0.7"
          flexalign
        >
          {bank ? (
            <FaUniversity />
          ) : (
            <FaCreditCard />
          )}
        </SubText>
      </Text>
      <WithdrawalPicker
        open={show}
        dismiss={toggle}
        title={hint || label}
        banks={banks}
        action={change}
        noadd={noadd}
      />
    </Container>
  );
};

export default WithdrawalInput;
