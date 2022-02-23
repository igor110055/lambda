import React from "react";
import { Controller } from "react-hook-form";

import WithdrawalInput from "./WithdrawalInput";

const ControlledWithdrawalInput = ({ name: fieldName, control, ...props }) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={null}
      render={({ onChange, value, name }) => (
        <WithdrawalInput
          {...props}
          name={name}
          method={value}
          onChange={({ target }) => onChange({type: target.type, address: target.value})}
        />
      )}
    />
  );
};

export default ControlledWithdrawalInput;
