import React from "react";
import { FiCalendar } from "react-icons/fi";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";

import DatePicker from "../organisms/DatePicker";

import { useToggle } from "../../hooks/useToggle";

const DateInput = ({
  label,
  error,
  placeholder,
  hint,
  date,
  onChange,
  name,
  ...props
}) => {
  const { show, toggle } = useToggle();

  const { w, m, weight, display, color, ...styleProps } = props;

  const formattedDate = new Date(date);

  const change = (value) => {
    return onChange({
      target: {
        name: name,
        type: "date",
        value,
      },
    });
  };

  return (
    <Container
      wide={!w}
      w={w}
      m={m || "8px 0"}
      weight={weight}
      display={display}
    >
      <Text
        color={error ? "danger" : color || undefined}
        font="12px"
        p="5px 12px"
        bold
      >
        {error || label}
      </Text>
      <Text
        // bg="bg"
        border="1px solid"
        bordercolor="#4ac1e0"
        p="12px 8px 12px 12px"
        radius="4px"
        onClick={toggle}
        flexalign
        {...styleProps}
      >
        {isNaN(formattedDate) ? placeholder : formattedDate.toDateString()}
        <SubText font="16px" p="0" m="0 0 0 auto" opacity="0.7" flexalign>
          <FiCalendar />
        </SubText>
      </Text>
      <DatePicker
        open={show}
        dismiss={toggle}
        title={hint || label}
        date={formattedDate}
        action={change}
      />
    </Container>
  );
};

export default DateInput;
