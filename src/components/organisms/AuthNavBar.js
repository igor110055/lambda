import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { CgMenuGridO } from "react-icons/cg";

import { ReactComponent as Logo } from "../../assets/icons/gumgum.svg";

import Backdrop from "../atoms/Backdrop";
import Container from "../atoms/Container";
import Text from "../atoms/Text";

const Wrapper = styled.aside`
  grid-area: navbar;
  height: 48px;
  width: 100%;

  margin: 0;
  padding: 0 80px;

  position: fixed;
  top: 0;
  left: 0;

  z-index: 2;

  background: ${({ bg, theme }) =>
    theme.colors[bg] || bg || theme.colors.bgContrast};

  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  display: flex;
  justify-content: space-between;
  align-items: center;

  /* display: none; */

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 0 12px;
  }
`;

const Menu = styled(CgMenuGridO)`
  font-size: 24px;
  width: 24px;
`;

const Heading = styled.h3`
  width: 100%;
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-weight: 600;
  text-align: center;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    height: 32px;
    display: inline-block;
    margin-right: 8px;
  }
`;

const Dropdown = styled.div`
  position: fixed;
  top: calc(48px + 12px);
  left: 80px;

  width: calc(100% - 24px);
  max-width: 360px;
  max-height: 0;
  transition: max-height 0.15s ease-out;
  overflow: hidden;

  background: ${({ bg, theme }) =>
    theme.colors[bg] || bg || theme.colors.bgContrast};
  border-radius: 12px;

  ${({ open }) =>
    open &&
    css`
      max-height: 500px;
      transition: max-height 0.25s ease-in;
    `}

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    left: 12px;
  }
`;

const AuthNavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <Wrapper>
      <Menu onClick={toggleDropdown} />
      <Link to="/dashboard">
        <Heading>
          <Logo />
          {/* {process.env.REACT_APP_NAME} */}
        </Heading>
      </Link>

      <Backdrop open={dropdownOpen} onClick={toggleDropdown} />
      <Dropdown open={dropdownOpen}>
        <Container p="12px" wide>
          <Text
            as="a"
            display="block"
            href={`https://${process.env.REACT_APP_DOMAIN}`}
          >
            Home
          </Text>
          <Text display="block" to="/account/login">
            Login
          </Text>
          <Text display="block" to="/account/register">
            Register
          </Text>
          <Text display="block" to="/account/forgot-password">
            Forgot Password
          </Text>
        </Container>
      </Dropdown>
    </Wrapper>
  );
};

export default AuthNavBar;
