import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { CgMenuGridO } from "react-icons/cg";

import { ReactComponent as Logo } from "../../assets/icons/logo.svg";

import ProfilePic from "../molecules/ProfilePic";

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

  background: ${({ bg, theme }) => theme.colors.bgContrast};

  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  display: flex;
  justify-content: space-between;
  align-items: center;

  /* display: none; */

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    background: ${({ theme }) => theme.colors.primary};
    border-bottom: none;
    color: white;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 0 12px;
  }
`;

const Menu = styled(CgMenuGridO)`
  font-size: 28px;
  width: 28px;
  display: none;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: block;
  }
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

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const NavBar = ({ action }) => {
  return (
    <Wrapper>
      <Menu onClick={action} />
      <Link to="/dashboard">
        <Heading>
          <Logo />
          {process.env.REACT_APP_NAME}
        </Heading>
      </Link>
      <ProfilePic />
    </Wrapper>
  );
};

export default NavBar;
