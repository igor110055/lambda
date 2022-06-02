import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import styled, { css } from "styled-components";

const Text = styled.p.attrs(({ to, scrollto, href }) => ({
  as: to ? (scrollto ? ScrollLink : RouterLink) : href && "a",
}))`
  padding: ${({ p }) => (p ? p : "12px")};
  margin: ${({ m }) => m && m};
  width: ${({ w }) => w && w};
  height: ${({ h }) => h && h};

  color: ${({ color, theme }) => theme.colors[color] || (color && color)};
  background: ${({ bg, theme }) => theme.colors[bg] || (bg && bg)};
  opacity: ${({ opacity }) => opacity && opacity};
  border-radius: ${({ radius }) => radius && radius};

  border: ${({ border }) => border && border};
  border-top: ${({ bordertop }) => bordertop && bordertop};
  border-bottom: ${({ borderbottom }) => borderbottom && borderbottom};
  border-left: ${({ borderleft }) => borderleft && borderleft};
  border-right: ${({ borderright }) => borderright && borderright};
  border-color: ${({ theme, bordercolor }) =>
    theme.colors[bordercolor] || bordercolor || "rgba(0, 0, 0, 0.1)"};

  font-weight: ${({ bold, weight }) =>
    weight ? weight : bold ? "600" : "400"};
  font-size: ${({ font }) => (font ? font : "12px")};
  text-align: ${({ align }) => align && align};

  cursor: ${({ pointer }) => pointer && "pointer"};

  display: ${({ display, inline }) => display || (inline && "inline")};

  word-break: ${({ breakword }) => breakword && "break-all"};
  text-decoration: ${({ underline }) => underline && "underline"};

  ${({ multiline }) =>
    !multiline &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
  ${({ flexalign, justify, align, inline }) =>
    flexalign &&
    css`
      display: ${inline ? "inline-flex" : "flex"};
      justify-content: ${justify && justify};
      align-items: ${align || "center"};
    `};
`;

export default Text;
