import React, { useEffect, useState } from "react";

import Container from "../atoms/Container";
import Button from "../atoms/Button";
import Text from "../atoms/Text";

const Tabs = ({ children, action, center, textStyle, ...props }) => {
  children = Array.isArray(children) ? children : [children];

  const [active, setActive] = useState(null);

  const { name, ...buttonProps } = action || {};

  useEffect(() => {
    const firstChild = children && children[0].props.name;
    setActive(firstChild);
  }, [children]);

  return (
    <Container {...props}>
      <Container flex="space-between" h="48px">
        <Container p="0 12px" flex={center ? "center" : "flex-start"} scrollX>
          {children &&
            children.map(({ props }) => (
              <Text
                key={props.name}
                bold
                center
                pointer
                multiline
                padding="12px 8px"
                {...textStyle}
                opacity={active === props.name ? "1" : "0.6"}
                onClick={() => setActive(props.name)}
              >
                {props.name}
              </Text>
            ))}
        </Container>
        {action && (
          <Container
            w="auto"
            p="0 12px"
            as="section"
            media={{
              breakpoint: "lg",
              targetBelow: true,
              display: "none",
            }}
          >
            <Button {...buttonProps}>{name}</Button>
          </Container>
        )}
      </Container>
      <Container h="calc(100% - 48px)">
        {children &&
          children.map((child) => (
            <Container
              key={child.props.name}
              display={active === child.props.name ? "block" : "none"}
            >
              {child}
            </Container>
          ))}
      </Container>
    </Container>
  );
};

export default Tabs;
