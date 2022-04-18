import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaBars } from "react-icons/fa";

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

  background-color: ${({ bg, theme }) =>
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

const Menu = styled(FaBars)`
  font-size: 24px;
  width: 24px;
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

  img {
    width: 20px;
    display: inline-block;
    margin-right: 8px;
  }
`;

const NavBar = ({ action }) => {
  return (
    <Wrapper>
      <Menu onClick={action} />
      <Link to="/dashboard">
        <Heading>
          <img src="/assets/icon/favicon.png" alt="logo" />
          {process.env.REACT_APP_NAME}
        </Heading>
      </Link>
      <ProfilePic />
    </Wrapper>
  );
};

export default NavBar;
