import React, { forwardRef } from "react";
import { FaSort } from "react-icons/fa";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  display: ${({ display }) => display && display};

  margin: ${({ m }) => m || "8px 0"};
  width: ${({ w }) => w || "100%"};
  font-weight: ${({ weight }) => weight || "600"};
  padding-top: ${({ label }) => label && "24px"};
`;

const SelectElement = styled.select`
  outline: none;
  border: none;
  appearance: none;

  width: 100%;
  border-radius: ${({ radius }) => radius || "4px"};
  padding: ${({ p }) => p || "12px"};

  padding-right: 14px;

  border: 1px solid #4ac1e0;
  appearance: none;
  outline: none;

  &:focus {
    border: 1px solid #00ce7c;
  }

  background: ${({ theme, bg }) =>
    "transparent" || theme.colors[bg] || bg || theme.colors.bg};
  font-size: 12px;

  color: ${({ theme, color }) =>
    theme.colors[color] || color || theme.colors.text};
`;

const Icon = styled(FaSort)`
  font-size: 14px;
  opacity: 0.6;

  pointer-events: none;
  position: absolute;
  right: 8px;
  top: ${({ label }) => (label ? "calc(50% + 10px)" : "50%")};
  transform: translateY(-50%);
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
`;

const Select = (
  { label, error, m, w, weight, display, color, ...props },
  ref
) => (
  <Wrapper label={label} m={m} w={w} weight={weight} display={display}>
    {label && (
      <Label color={color} error={error}>
        {error || label}
      </Label>
    )}
    <SelectElement ref={ref} {...props} />
    <Icon bg={props.bg} label={label} />
  </Wrapper>
);

export default forwardRef(Select);
