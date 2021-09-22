import styled from "styled-components";
import Container from "../atoms/Container";

const IntervalButton = styled.p`
  --count: ${({ count }) => count};
  width: calc(100% * (1 / var(--count)));

  height: ${({ h }) => h && h};

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 12px;
  font-weight: 600;
  border-radius: ${({ radius }) => radius || "2px"};

  color: ${({ theme, active }) =>
    active ? theme.colors.invertText : theme.colors.text};

  background: transparent;
  transition: none;

  cursor: pointer;
`;

const Cursor = styled.div`
  --count: ${({ count }) => count};
  --index: ${({ index }) => index || "0"};

  width: calc(100% * (1 / var(--count)));
  height: ${({ h }) => h && h};

  padding: 8px 16px;
  background-color: ${({ bg, theme }) =>
    theme.colors[bg] || bg || "darkseagreen"};
  border-radius: ${({ radius }) => radius || "2px"};

  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;

  transform: translateX(calc(100% * var(--index)));

  transition: none;
  transition: transform 0.2s ease;
`;

const IntervalSwitch = ({
  intervals,
  active,
  action,
  h,
  bg,
  radius,
  ...props
}) => {
  const height = h || "22px";

  const count = intervals.length;
  const activeIndex = intervals.findIndex((i) => i.name === active);

  return (
    <Container flex="center" p="0 8px" wide {...props}>
      <Container flex="center" position="relative" z="1" maxW="480px">
        <Cursor
          bg={bg}
          h={height}
          radius={radius}
          count={count}
          index={activeIndex}
        />
        {intervals.map((interval) => (
          <IntervalButton
            h={height}
            radius={radius}
            key={interval.value}
            count={count}
            active={interval.name === active}
            onClick={() => action(interval.name)}
          >
            {interval.name}
          </IntervalButton>
        ))}
      </Container>
    </Container>
  );
};

export default IntervalSwitch;
