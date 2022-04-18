import React from "react";
import { FaArrowLeft } from "react-icons/fa";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import SubText from "../../atoms/SubText";
import Button from "../../atoms/Button";

import MessageItem from "../../molecules/MessageItem";
import { MessagesLoader } from "../../molecules/Loader";

import { useMessages } from "../../../hooks/useMessages";

const Home = () => {
  const { messages, loading } = useMessages();

  return (
    <Container wide>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          My Messages
        </Text>
        <Container p="12px 0" wide>
          <Text p="0" font="12px" opacity="0.6" bold multiline>
            View all your incoming messages. NB: you may reply messages via
            email
          </Text>
        </Container>
        <Container m="12px 0 0" flex="flex-start" wide>
          <Button
            p="8px 24px"
            radius="6px"
            bg="primary"
            bold="true"
            to="/dashboard/wallets"
          >
            My Accounts
          </Button>
          <Button
            p="8px 20px"
            m="0 0 0 12px"
            radius="6px"
            bg="secondary"
            // color="black"
            flexalign="true"
            to="/dashboard"
          >
            <SubText bold="true" p="0" m="0 8px 0 0" flexalign>
              <FaArrowLeft />
            </SubText>
            <SubText bold="true" p="0" m="0">
              Go Back
            </SubText>
          </Button>
        </Container>
      </Container>

      {loading ? (
        <Container p="12px" wide>
          <MessagesLoader />
        </Container>
      ) : (
        <Container minH="240px" p="12px" wide>
          {messages.length ? (
            messages.map((message) => (
              <MessageItem key={message._id} message={message} />
            ))
          ) : (
            <Container minH="240px" flexCol="center">
              <Text opacity="0.6" bold>
                You have no messages
              </Text>
            </Container>
          )}
        </Container>
      )}
    </Container>
  );
};

export default Home;
