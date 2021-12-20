import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import NavBar from "../organisms/NavBar";
import Sidebar from "../organisms/Sidebar";
import Userbar from "../organisms/Userbar";

const Wrapper = styled.div`
  position: relative;

  height: 100vh;
  overflow: hidden;

  background: ${({ theme }) => theme.colors.bgImage};

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: 100%;
  }
`;

const GridWrapper = styled.div`
  position: relative;

  height: calc(100% - 48px);
  margin-top: 48px;

  display: grid;
  grid-template-columns: minmax(240px, 2fr) 8fr minmax(280px, 2fr);
  grid-template-areas: "sidebar content userbar";
  grid-gap: 12px;

  z-index: 1;

  padding: 12px 80px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 12px;
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0;

    overflow: auto;
    grid-template-columns: 1fr;
    grid-template-areas: "content";
    grid-gap: 0;
  }
`;

const Content = styled.main`
  grid-area: content;
  background-color: ${({ theme }) => theme.colors.bgContrast};

  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }

  height: 100%;
  /* border-radius: 6px; */

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: calc(100vh - 48px);
    border-radius: 0;
  }
`;

const Dashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const { pathname } = useLocation();

  useEffect(() => setSidebarOpen(false), [pathname]);

  return (
    <Wrapper>
      <NavBar action={toggleSidebar} />
      <GridWrapper>
        <Sidebar open={sidebarOpen} toggle={toggleSidebar} />
        <Content>{children}</Content>
        <Userbar />
      </GridWrapper>
    </Wrapper>
  );
};

export default Dashboard;
