import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  height: ${({ h }) => h || "12px"};
  width: 100%;
  border-radius: ${({ radius }) => radius || "12px"};

  background: ${({ bg }) => bg || "white"};

  overflow: hidden;
`;

const Filler = styled.div`
  height: 100%;
  width: ${({ w }) => w || "0%"};
  border-radius: ${({ radius }) => radius || "12px"};

  background: ${({ color, theme }) =>
    theme.colors[color] || color || "grey"};

  transition: width 0.4s ease-in-out;
`;

const Progress = ({ percent, animate, ...props }) => {
  const [progress, setProgress] = useState(animate ? 0 : percent);

  useEffect(() => {
    if (!animate) return;
    const timeout = setTimeout(() => setProgress(percent), 200);

    return () => clearTimeout(timeout);
  }, [animate, percent]);

  return (
    <Wrapper {...props}>
      <Filler w={progress + "%"} {...props}></Filler>
    </Wrapper>
  );
};

export default Progress;
