import React from "react";
import styled, { keyframes } from "styled-components";

const animate = keyframes`
  0% {
      left: -20px;
  }
  49% {
      left: 49%;
  }
  50% {
      left: 50%;
  }
  100% {
      left: 115%;
  }
`;

const Circle = styled.div`
  --size: 10px;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;

  background: ${({ theme }) => theme.colors.actionBg || "grey"};

  position: absolute;
  left: -20px;

  animation: ${animate} 3s ease infinite;

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.3s;
  }
  &:nth-child(3) {
    animation-delay: 0.6s;
  }
  &:nth-child(4) {
    animation-delay: 0.9s;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ page }) => (page ? "100%" : "100vh")};
  width: 100%;
  overflow: hidden;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: ${({ page }) => (page ? "calc(100vh - 96px)" : "100vh")};
  }
`;

const PreLoader = ({ page }) => {
  return (
    <Wrapper page={page}>
      <Circle />
      <Circle />
      <Circle />
      <Circle />
    </Wrapper>
  );
};

export default PreLoader;
