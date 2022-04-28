import React, { useState } from "react";
import { FaWallet } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";
import Button from "../atoms/Button";

import { useProfile } from "../../hooks/useProfile";
import { useBalance } from "../../hooks/useBalance";

const Referral = () => {
  const { profile } = useProfile();
  const { bonus } = useBalance();

  const [copied, setCopied] = useState(false);
  const copy = () => setCopied(true);

  const ref = window.location.origin + "/account/referral/" + profile.id;

  return (
    <Container p="12px" wide>
      <Container p="12px" bg="actionBg" color="white" radius="8px" wide>
        <Text p="8px 0" font="12px" multiline>
          Refer someone and you both earn{" "}
          <SubText font="inherit" p="0" bold>
            ${process.env.REACT_APP_REFERRAL_BONUS}
          </SubText>{" "}
          when they sign up and make their first transaction using your referral link.
        </Text>
        <CopyToClipboard text={ref} onCopy={copy}>
          <SubText
            display="block"
            font="12px"
            p="8px"
            m="12px 0 24px"
            radius="6px"
            bg="white"
            color="black"
          >
            {ref}
          </SubText>
        </CopyToClipboard>

        <Container
          p="12px"
          m="12px 0"
          border="1px dashed"
          bordercolor="rgba(255,255,255,0.4)"
          radius="4px"
          wide
        >
          <Text font="12px" p="0" bold flexalign>
            <SubText font="14px" p="0" m="0 8px 0 0" opacity="0.6" flexalign>
              <FaWallet />
            </SubText>
            Referral Bonus
          </Text>
          <Text font="14px" p="0" m="8px 0 0" bold>
            {bonus} USD
          </Text>
        </Container>
        <CopyToClipboard text={ref} onCopy={copy}>
          <Button
            font="12px"
            bg="white"
            color="black"
            p="8px 24px"
            m="4px 0"
            bold
          >
            {copied ? "Copied" : "Copy Referral Link"}
          </Button>
        </CopyToClipboard>
      </Container>
    </Container>
  );
};

export default Referral;
