import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import styled, { css } from "styled-components";

const Container = styled.div.attrs(({ to, scrollto }) => ({
  as: to && (scrollto ? ScrollLink : RouterLink),
}))`
  width: ${({ w }) => (w ? w : "100%")};
  height: ${({ h }) => (h ? h : "100%")};
  background: ${({ bg, theme }) => theme.colors[bg] || (bg && bg)};
  color: ${({ color, theme }) => theme.colors[color] || (color && color)};
  padding: ${({ p }) => p && p};
  border-radius: ${({ radius }) => radius && radius};
  margin: ${({ m }) => m && m};

  cursor: ${({ pointer }) => pointer && "pointer"};

  max-width: ${({ maxW }) => maxW && maxW};
  min-width: ${({ minW }) => minW && minW};
  max-height: ${({ maxH }) => maxH && maxH};
  min-height: ${({ minH }) => minH && minH};

  display: ${({ display }) => display && display};
  overflow: ${({ o }) => o && o};

  // grid
  grid-area: ${({ area }) => area && area};
  grid-gap: ${({ gap }) => gap && gap};
  grid-auto-flow: ${({ flow }) => flow && flow};
  grid-template-columns: ${({ templatecolumns }) =>
    templatecolumns && templatecolumns};
  grid-template-rows: ${({ templaterows }) => templaterows && templaterows};

  // full width and default height
  ${({ wide }) =>
    wide &&
    css`
      width: 100%;
      height: auto;
    `}

  // flex row with center align
  ${({ flex }) =>
    flex &&
    css`
      display: flex;
      justify-content: ${({ flex }) => flex};
      align-items: center;
    `}

  // flex column with center align
  ${({ flexCol }) =>
    flexCol &&
    css`
      display: flex;
      flex-direction: column;
      align-items: ${({ flexCol }) => flexCol};
      justify-content: center;
    `}

  // flex overrides
  align-items: ${({ align }) => align && align};
  justify-content: ${({ justify }) => justify && justify};
  flex-direction: ${({ direction }) => direction && direction};

  // position
  position: ${({ position }) => position && position};
  top: ${({ top }) => top && top};
  bottom: ${({ bottom }) => bottom && bottom};
  left: ${({ left }) => left && left};
  right: ${({ right }) => right && right};
  z-index: ${({ z }) => z && z};

  // border
  border: ${({ border }) => border && border};
  border-top: ${({ bordertop }) => bordertop && bordertop};
  border-bottom: ${({ borderbottom }) => borderbottom && borderbottom};
  border-left: ${({ borderleft }) => borderleft && borderleft};
  border-right: ${({ borderright }) => borderright && borderright};
  border-color: ${({ theme, bordercolor }) =>
    theme.colors[bordercolor] || bordercolor || "rgba(0, 0, 0, 0.1)"};

  // scroll behaviour for y-axis
  ${({ scroll }) =>
    scroll &&
    css`
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
    `}

  ${({ noscroll }) =>
    noscroll &&
    css`
      overflow-y: hidden;
    `}

    // scroll behaviour for x-axis
    ${({ scrollX }) =>
    scrollX &&
    css`
      overflow-x: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
    `}

    ${({ noscrollX }) =>
    noscrollX &&
    css`
      overflow-x: hidden;
    `}

    // media overrides for screens below/above breakpoint, supports: p, m, radius, display
    ${({ media }) => {
    if (media) {
      const mediaStyles = css`
        display: ${media.display};
        overflow: ${media.o};

        width: ${media.w};
        height: ${media.h};

        padding: ${media.p};
        margin: ${media.m};
        border-radius: ${media.radius};

        background-color: ${({ media, theme }) =>
          theme.colors[media.bg] || media.bg};

        max-width: ${media.maxW};
        min-width: ${media.minW};
        max-height: ${media.maxH};
        min-height: ${media.minH};

        align-items: ${media.align};
        justify-content: ${media.justify};
        flex-direction: ${media.direction};

        grid-area: ${media.area};
        grid-gap: ${media.gap};
        grid-auto-flow: ${media.flow};
        grid-template-columns: ${media.templatecolumns};
        grid-template-rows: ${media.templaterows};

        overflow-y: ${media.overflowY};
        overflow-x: ${media.overflowX};
        &::-webkit-scrollbar {
          display: none;
        }
      `;

      // set xl as default breakpoint if not provided
      const breakpoint = media.breakpoint || "xl";

      // check if explicitly targeting screens below breakpoint else target higher screens
      return media.targetBelow
        ? css`
            @media screen and (max-width: ${({ theme }) =>
                theme.breakpoints[breakpoint]}) {
              ${mediaStyles}
            }
          `
        : css`
            @media screen and (min-width: ${({ theme }) =>
                theme.breakpoints[breakpoint]}) {
              ${mediaStyles}
            }
          `;
    }
  }}
`;

export default Container;
