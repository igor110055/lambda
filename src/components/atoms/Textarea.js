import React, { forwardRef } from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  position: relative;
  display: ${({ display }) => display && display};

  font-size: 14px;

  width: ${({ w }) => w || "100%"};
  margin: ${({ m }) => m || "8px 0"};
  font-weight: ${({ weight }) => weight || "600"};
  padding-top: ${({ label }) => label && "24px"};
`;

const TextareaElement = styled.textarea`
  padding: 12px;
  width: 100%;

  font-size: 14px;

  background: ${({ bg, theme }) =>
    theme.colors[bg] || bg || theme.colors.bg};

  color: ${({ theme, color }) =>
    theme.colors[color] || color || theme.colors.text};

  border-radius: ${({ radius }) => radius || "4px"};

  border: none;
  appearance: none;
  outline: none;
  resize: ${({ resize }) => resize || "none"};

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
    `};
`;

const Label = styled.label`
  position: absolute;
  left: 12px;
  top: 10px;

  font-size: 12px;
  color: ${({ error, color, theme }) =>
    error
      ? theme.colors.danger
      : color
      ? theme.colors[color] || color
      : undefined};

  transform: translateY(-50%);
  transition: top 0.3s ease, font-size 0.3s ease, color 0.3s ease;
`;

const Textarea = (
  { label, error, w, m, weight, display, color, ...props },
  ref
) => {
  return (
    <Wrapper label={label} w={w} m={m} weight={weight} display={display}>
      {label && (
        <Label color={color} error={error}>
          {error || label}
        </Label>
      )}
      <TextareaElement ref={ref} {...props} />
    </Wrapper>
  );
};

export default forwardRef(Textarea);
