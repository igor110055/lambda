import React, { forwardRef } from "react";
import styled from "styled-components";

const Label = styled.label`
  position: relative;
  display: inline-block;

  --size: ${({ size }) => size || "24px"};
  height: var(--size);
  width: calc(1.75 * var(--size));

  span {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 24px;
    background: #ccc;
    transition: 0.4s;
  }

  span::before {
    content: "";
    position: absolute;
    left: calc(0.125 * var(--size));
    bottom: calc(0.125 * var(--size));
    height: calc(0.75 * var(--size));
    width: calc(0.75 * var(--size));
    border-radius: 50%;
    background: white;
    transition: 0.4s;
  }

  input:checked + span {
    background: ${({ color, theme }) =>
      theme.colors[color] || color || "#2196f3"};
  }

  input:checked + span::before {
    transform: translateX(100%);
  }
`;

const Toggle = ({ size, color, ...props }, ref) => {
  return (
    <Label color={color} size={size}>
      <input type="checkbox" hidden ref={ref} {...props} />
      <span />
    </Label>
  );
};

export default forwardRef(Toggle);
