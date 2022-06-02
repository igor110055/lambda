import React, { forwardRef } from "react";
import { FaCheck } from "react-icons/fa";
import styled from "styled-components";

const Label = styled.label`
  position: relative;
  display: ${({ display }) => display && display};

  display: inline-flex;
  align-items: center;

  width: ${({ w }) => w || "100%"};
  padding: ${({ p }) => p || "12px 8px"};
  margin: ${({ m }) => m || "8px 0"};

  font-size: 12px;

  color: ${({ color, theme }) =>
    color ? theme.colors[color] || color : undefined};

  span {
    width: 18px;
    height: 18px;

    background: lightgrey;
    color: transparent;

    font-size: 12px;
    margin-right: 12px;

    border-radius: 2px;
    border: 0.5px solid #ccc;

    display: flex;
    justify-content: center;
    align-items: center;

    flex-shrink: 0;

    transition: 0.2s;
  }

  input:checked + span {
    background: #2196f3;
    color: white;
    border-color: #2196f3;
  }
`;

const Checkbox = (
  { label, w, p, m, weight, display, color, ...props },
  ref
) => {
  return (
    <Label w={w} p={p} m={m} weight={weight} display={display} color={color}>
      <input type="checkbox" hidden ref={ref} {...props} />
      <span>
        <FaCheck />
      </span>
      {label}
    </Label>
  );
};

export default forwardRef(Checkbox);
