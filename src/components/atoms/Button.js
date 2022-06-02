import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import styled, { css } from "styled-components";

const Button = styled.button.attrs(({ to, scrollto }) => ({
  as: to && (scrollto ? ScrollLink : RouterLink),
}))`
  --bg: ${({ bg, theme }) => theme.colors[bg] || bg || "grey"};
  --color: ${({ color, theme }) => theme.colors[color] || color || "white"};

  background: var(--bg);
  color: var(--color);

  padding: 12px;
  min-height: 24px;
  /* min-width: 48px; */
  font-size: 12px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  /* appearance: none; */
  border: none;
  outline: none;

  &:hover,
  &:active {
    /* filter: brightness(0.8); */
  }

  // inlines
  padding: ${({ p }) => p && p};
  margin: ${({ m }) => m && m};
  width: ${({ w }) => w && w};
  max-width: ${({ max }) => max && max};
  min-width: ${({ min }) => min && min};
  font-size: ${({ font }) => font && font};
  font-weight: ${({ bold, weight }) => (weight ? weight : bold && "600")};
  border-radius: ${({ radius }) => radius || "4px"};

  // customs
  ${({ full }) =>
    full &&
    css`
      width: 100%;
    `}

  ${({ round }) =>
    round &&
    css`
      border-radius: 16px;
    `}

  ${({ outline }) =>
    outline &&
    css`
      --color: ${({ color, theme }) => theme.colors[color] || color || "grey"};
      background: transparent;
      border: 1.5px solid;

      &:hover,
      &:active {
        --bg: ${({ bg, theme }) => theme.colors[bg] || bg || "white"};
        color: var(--bg);
        background: var(--color);
        border: none;
      }
    `}
`;

export default Button;
