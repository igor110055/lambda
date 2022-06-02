import styled from "styled-components";
import { IoMailOpen, IoMailUnread } from "react-icons/io5";

const Wrapper = styled.div`
  width: ${({ size }) => (size ? size : "36px")};
  height: ${({ size }) => (size ? size : "36px")};

  min-width: ${({ size }) => size || "36px"};

  border-radius: ${({ square, radius }) =>
    radius ? radius : square ? "8px" : "50%"};

  display: flex;
  justify-content: center;
  align-items: center;

  background: lightgrey;
  color: ${({ theme }) => theme.colors.invertText};
`;

const MessageIcon = ({ read, ...props }) => {
  return (
    <Wrapper read={read} {...props}>
      {read ? <IoMailOpen /> : <IoMailUnread />}
    </Wrapper>
  );
};

export default MessageIcon;
