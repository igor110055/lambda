import styled from "styled-components";

const Badge = styled.span`
  width: ${({ size }) => size || "16px"};
  height: ${({ size }) => size || "16px"};

  margin: ${({ m }) => m || "0 6px"};

  border-radius: ${({ radius }) => radius || "50%"};
  background: ${({ bg, theme }) =>
    theme.colors[bg] || bg || "darkseagreen"};

  color: ${({ color }) => color || "white"};
  font-size: ${({ font }) => font || "8px"};
  font-weight: ${({ bold, weight }) =>
    weight ? weight : bold ? "600" : "500"};

  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

export default Badge;
