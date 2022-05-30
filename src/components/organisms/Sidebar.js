import React from "react";
import styled, { css } from "styled-components";
import { IoExitOutline } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";

import Container from "../atoms/Container";
import Backdrop from "../atoms/Backdrop";
import SidebarItem from "../atoms/SidebarItem";
import Toggle from "../atoms/Toggle";

import ConfirmationModal from "./ConfirmationModal";

import { useProfile } from "../../hooks/useProfile";
import { useToggle } from "../../hooks/useToggle";
import { useTheme } from "../../hooks/useTheme";

const Wrapper = styled.div`
  grid-area: sidebar;

  position: relative;
  height: 100%;

  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.bgContrast};
  padding: 0px;

  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  z-index: 1;

  display: flex;
  flex-direction: column;

  border-radius: 8px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    border-radius: 0;

    transform: translateX(-100%);
    position: fixed;
    top: 0;
    left: 0;
    width: 30%;
    transition: transform 0.2s ease-in-out;

    ${({ open }) =>
      open &&
      css`
        transform: translateX(0);
        transition: transform 0.2s ease-in-out;
      `}

    border: none;

    height: calc(100% - 48px);

    margin-top: 48px;
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 50%;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 85%;
  }
`;

const Sidebar = ({ open, toggle }) => {
  const { theme, toggle: toggleTheme } = useTheme();
  const { profile, logout } = useProfile();
  const { show: showLogoutModal, toggle: toggleLogoutModal } = useToggle();

  const switchTheme =
    process.env.REACT_APP_THEME_SWITCH?.toLowerCase() === "true";

  return (
    <Container
      as="aside"
      z="10"
      radius="0px"
      wide
      media={{ breakpoint: "lg", overflowY: "hidden" }}
    >
      <Backdrop mobile open={open} onClick={toggle} />
      <Wrapper open={open}>
        <Container m="0 0 0" wide>
          <SidebarItem name="Dashboard" to="/dashboard" exact />
          <SidebarItem name="Transactions" to="/dashboard/transactions" />
          <SidebarItem name="Messages" to="/dashboard/messages" />
          <SidebarItem name="Payments" to="/dashboard/payments" />
          <SidebarItem name="Settings" to="/dashboard/settings" />
          {(profile.role === "admin" || profile.role === "moderator") && (
            <SidebarItem name="Admin" to="/dashboard/admin" />
          )}
          <Container p="12px 0" m="24px 0 0" bordertop="1px solid" wide>
            {switchTheme && (
              <SidebarItem
                name="Dark Mode"
                icon={
                  <Toggle
                    size="18px"
                    color="primary"
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                  />
                }
                nohover
                onClick={toggleTheme}
              />
            )}
            {process.env.REACT_APP_CHAT_URL && (
              <SidebarItem
                name="Customer Support"
                icon={<BiSupport />}
                iconSize="20px"
                nohover
                href={process.env.REACT_APP_CHAT_URL}
                target="_blank"
              />
            )}
            <SidebarItem
              color="danger"
              name="Logout"
              icon={<IoExitOutline />}
              iconSize="20px"
              iconOpacity="0.8"
              nohover
              onClick={toggleLogoutModal}
            />
          </Container>
        </Container>

        <ConfirmationModal
          open={showLogoutModal}
          dismiss={toggleLogoutModal}
          title="Logout"
          message="Are you sure you want to logout?"
          action={logout}
        />
      </Wrapper>
    </Container>
  );
};

export default Sidebar;
