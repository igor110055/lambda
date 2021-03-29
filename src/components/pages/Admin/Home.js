import React from "react";
import { useRouteMatch } from "react-router-dom";
import { FaPaperPlane, FaPlus, FaSearch } from "react-icons/fa";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";

import { List, ListItem } from "../../molecules/List";
import Loader from "../../molecules/Loader";

import { useStats } from "../../../hooks/useStats";

import { AdminDisplay } from "./common/AdminChecker";

const Home = () => {
  const { url } = useRouteMatch();
  const { stats } = useStats();

  return (
    <>
      <Container p="12px 12px 24px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          Admin Panel
        </Text>
        <Container p="12px 0" wide>
          {!stats ? (
            <Loader h="22px" w="240px" radius="4px" />
          ) : (
            <Container flex="flex-start" wide>
              <Text
                p="4px 12px"
                bg="bg"
                font="12px"
                radius="4px"
                opacity="0.6"
                bold="true"
                inline="true"
                to="/dashboard/admin/users"
              >
                {stats.count.users} Users
              </Text>

              <Text
                p="4px 12px"
                m="0 0 0 12px"
                bg="bg"
                font="12px"
                radius="4px"
                opacity="0.6"
                bold="true"
                inline="true"
                to="/dashboard/admin/transactions"
              >
                {stats.count.transactions} Transactions
              </Text>

              <Text
                p="4px 12px"
                m="0 0 0 12px"
                bg="bg"
                font="12px"
                radius="4px"
                opacity="0.6"
                bold="true"
                inline="true"
                to="/dashboard/admin/wallets"
              >
                {stats.count.wallets} Wallets
              </Text>
            </Container>
          )}
        </Container>
      </Container>

      <Text p="12px" bold>
        What do you want to do?
      </Text>

      <Container p="12px" wide>
        <List>
          <ListItem bg="bg" to={`${url}/users`}>
            Users
          </ListItem>
          <ListItem bg="bg" to={`${url}/transactions`}>
            Recent Transactions
          </ListItem>
          <ListItem bg="bg" to={`${url}/wallets`}>
            Wallets
          </ListItem>
        </List>
      </Container>

      <Container p="12px" wide>
        <List>
          <ListItem bg="bg" icon={<FaSearch />} to={`${url}/transactions/find`}>
            Find Transaction
          </ListItem>
          <ListItem bg="bg" icon={<FaSearch />} to={`${url}/users/find`}>
            Find User
          </ListItem>
        </List>
      </Container>

      <AdminDisplay>
        <Container p="12px" wide>
          <List>
            <ListItem bg="bg" icon={<FaPlus />} to={`${url}/wallets/add`}>
              Add Wallet
            </ListItem>
            <ListItem bg="bg" icon={<FaPlus />} to={`${url}/users/add`}>
              Add User
            </ListItem>
          </List>
        </Container>

        <Container p="12px" wide>
          <List>
            <ListItem bg="bg" icon={<FaPlus />} to={`${url}/bank`}>
              Bank Details
            </ListItem>
          </List>
        </Container>

        <Container p="12px" wide>
          <List>
            <ListItem bg="bg" icon={<FaPaperPlane />} to={`${url}/email`}>
              Send Email
            </ListItem>
          </List>
        </Container>
      </AdminDisplay>
    </>
  );
};

export default Home;
