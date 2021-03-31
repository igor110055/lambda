import React from "react";
import { useRouteMatch } from "react-router-dom";
import { FaCheck, FaLock } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";
import Badge from "../atoms/Badge";
import Progress from "../atoms/Progress";
import Button from "../atoms/Button";

import { useProfile } from "../../hooks/useProfile";
import { useBalance } from "../../hooks/useBalance";

import { getUserLevel } from "../../utils/userUtils";
import { rawBalance } from "../../utils/parseBalance";

const VerificationLevel = ({
  level,
  plan,
  min,
  max,
  requirement,
  verification,
  ...props
}) => {
  const { path } = useRouteMatch();

  const { profile } = useProfile();
  const { total } = useBalance();
  const userLevel = getUserLevel(profile);

  const verified = userLevel >= level;
  const canUpgrade = level === userLevel + 1;

  const limit = (rawBalance(total) / max) * 100;

  return (
    <Container bg="bg" p="16px" radius="12px" {...props}>
      <Container flex="space-between" align="flex-start" wide>
        <Badge
          bg={verified ? "primary" : "secondary"}
          color="white"
          size="40px"
          m="0"
          radius="10px"
          font="18px"
          bold
        >
          {plan[0]}
        </Badge>
        <BsThreeDotsVertical />
      </Container>

      <Container p="12px 0 24px" flex="space-between" wide>
        <Container wide>
          <Text p="4px 0" bold>
            Level {level}
          </Text>
          <Text p="0" font="12px" opacity="0.6" bold>
            {plan} Membership
          </Text>
        </Container>
        <Container flexCol="flex-end" wide>
          {verified && (
            <Badge bg="primary" size="18px" m="0" font="8px" color="white">
              <FaCheck />
            </Badge>
          )}
        </Container>
      </Container>

      <Container p="24px 0 12px" flexCol="center" justify="flex-end" wide>
        <Container p="0 4px" flex="space-between" wide>
          <Text p="0" bold>
            {min.toLocaleString()} USD
          </Text>
          <Text p="0" bold>
            {max.toLocaleString()} {!isNaN(parseFloat(max)) && "USD"}
          </Text>
        </Container>

        <Container p="8px 0" wide>
          <Progress
            h="6px"
            radius="4px"
            color={verified ? "primary" : "secondary"}
            animate
            percent={level > userLevel ? 0 : level < userLevel ? 100 : limit}
          />
        </Container>

        <Container p="0 4px" flex="space-between" wide>
          <Text p="0" font="11px" opacity="0.6" bold>
            Min
          </Text>
          <Text p="0" font="11px" opacity="0.6" bold>
            Max
          </Text>
        </Container>
      </Container>

      {/* <Container flex="center" wide>
        <Text
          p="0"
          font="11px"
          opacity="0.6"
          align="center"
          multiline
          weight="500"
        >
          {requirement}
        </Text>
      </Container> */}

      {verified ? (
        <Button bg="primary" m="12px 0" radius="4px" bold full disabled>
          <Text p="0" flexalign bold>
            Verified
            <SubText p="0" m="0 0 0 8px" flexalign>
              <FaCheck />
            </SubText>
          </Text>
        </Button>
      ) : !profile.meta.requireUpgrade ? (
        <Button
          bg="secondary"
          color="black"
          m="12px 0"
          radius="4px"
          bold
          full
          disabled
        >
          <Text p="0" flexalign bold>
            Level {level}
            <SubText p="0" m="0 0 0 8px" flexalign>
              <FaLock />
            </SubText>
          </Text>
        </Button>
      ) : canUpgrade ? (
        <Button
          bg="orange"
          m="12px 0"
          radius="4px"
          bold="true"
          full="true"
          to={`${path}/${verification}`}
        >
          Verify Now
        </Button>
      ) : (
        <Button
          bg="secondary"
          color="black"
          m="12px 0"
          radius="4px"
          bold
          full
          disabled
        >
          <Text p="0" flexalign bold>
            Level {level - 1} Required
            <SubText p="0" m="0 0 0 8px" flexalign>
              <FaLock />
            </SubText>
          </Text>
        </Button>
      )}
    </Container>
  );
};

export default VerificationLevel;
