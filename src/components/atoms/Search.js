import { FaSearch } from "react-icons/fa";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  border-radius: ${({ radius }) => radius || "12px"};
  width: ${({ w }) => w && w};
  padding: ${({ p }) => p && p};
  margin: ${({ m }) => m && m};

  background: ${({ theme, bg }) =>
    theme.colors[bg] || bg || theme.colors.bg};
  overflow: hidden;

  &::focus-within {
    border: 1px solid lightblue;
  }
`;

const Icon = styled(FaSearch)`
  font-size: 16px;
  margin-left: 12px;
  color: grey;
`;

const Input = styled.input`
  padding: 12px;
  background: transparent;
  width: 100%;
  height: 100%;
  font-size: 12px;
  font-weight: 500;
  border: none;
  outline: none;
`;

const Search = ({ w, p, m, bg, radius, ...props }) => {
  return (
    <Wrapper w={w} p={p} bg={bg} radius={radius} m={m}>
      <Icon />
      <Input {...props} />
    </Wrapper>
  );
};
export default Search;
