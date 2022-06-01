import React from "react";
import { FaChevronRight } from "react-icons/fa";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";
import Avatar from "../atoms/Avatar";

import { capitalise } from "../../utils/formatText";

const UserItem = ({ user, ...props }) => {
  return (
    <Container
      p="12px 0"
      flex="space-between"
      pointer="pointer"
      wide="wide"
      to={`/dashboard/admin/users/${user._id}`}
      {...props}
    >
      <Avatar
        size="36px"
        name={user.fullName}
        bg={user.meta.isEmailVerified ? "primary" : "actionBg"}
        color="white"
      />
      <Container
        w="calc(100% - 36px)"
        p="2px 0px 2px 12px"
        h="36px"
        flex="space-between"
      >
        <Container flexCol="flex-start" justify="space-between" o="hidden">
          <Text font="12px" p="0" bold>
            {user.fullName}
          </Text>
          <Text font="11px" p="0" opacity="0.6" bold>
            {user.email}
          </Text>
        </Container>
        {user.role ? (
          <Container flexCol="flex-end" justify="center">
            <Text font="11px" p="0">
              {capitalise(user.role)}
            </Text>
          </Container>
        ) : (
          <Text p="0">
            <SubText font="11px" p="0" flexalign>
              <FaChevronRight />
            </SubText>
          </Text>
        )}
      </Container>
    </Container>
  );
};

export default UserItem;
