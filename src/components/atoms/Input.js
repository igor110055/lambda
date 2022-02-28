import React, { forwardRef } from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  position: relative;
  display: ${({ display }) => display && display};

  font-size: 12px;

  width: ${({ w }) => w || "100%"};
  margin: ${({ m }) => m || "8px 0"};
  font-weight: ${({ weight }) => weight || "600"};
  padding-top: ${({ label }) => label && "24px"};
`;

const InputElement = styled.input`
  /* padding: 12px; */
  padding: ${({ p }) => p || "12px"};
  width: 100%;

  font-size: 12px;

  background-color: ${({ bg, theme }) =>
    theme.colors[bg] || bg || theme.colors.bg};

  color: ${({ theme, textColor }) =>
    theme.colors[textColor] || textColor || theme.colors.text};

  border-radius: ${({ radius }) => radius || "4px"};

  border: none;
  appearance: none;
  outline: none;

  ${({ outline }) =>
    outline &&
    css`
      background: none;
      border: 2px solid ${({ bg, theme }) => theme.colors[bg] || bg || "#ddd"};
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #222;
        transition-delay: 0.1s;
      }
    `}
`;

const Label = styled.label`
  position: absolute;
  left: 12px;
  top: 10px;

  font-size: 11px;
  color: ${({ error, color, theme }) =>
    error
      ? theme.colors.danger
      : color
      ? theme.colors[color] || color
      : undefined};

  transform: translateY(-50%);
  transition: top 0.3s ease, font-size 0.3s ease, color 0.3s ease;

  ${({ wide }) =>
    wide &&
    css`
      width: 100%;
      left: 0;
      padding: 0 12px;
    `}
`;

const Input = (
  { label, error, extra, w, m, weight, display, color, ...props },
  ref
) => {
  return (
    <Wrapper label={label} w={w} m={m} weight={weight} display={display}>
      {error ? (
        <Label error>{error}</Label>
      ) : extra ? (
        <Label color={color} wide>
          {extra}
        </Label>
      ) : (
        label && <Label color={color}>{label}</Label>
      )}
      <InputElement ref={ref} {...props} />
    </Wrapper>
  );
};

export default forwardRef(Input);
