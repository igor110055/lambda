import styled from "styled-components";

const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ bg, theme }) =>
    theme.colors[bg] || bg || "rgba(0, 0, 0, 0.4)"};

  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ z }) => z || "-1"};

  overflow-y: hidden;

  display: ${({ open }) => (open ? "block" : "none")};

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: ${({ mobile, open }) =>
      open ? (mobile ? "none" : "block") : "none"};
  }
`;

export default Backdrop;
