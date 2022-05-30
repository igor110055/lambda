import styled from "styled-components";
import {
  FaArrowDown,
  FaArrowUp,
  FaPaperPlane,
  FaShieldAlt,
  FaUserCheck,
} from "react-icons/fa";

const Wrapper = styled.div`
  width: ${({ size }) => (size ? size : "36px")};
  height: ${({ size }) => (size ? size : "36px")};

  min-width: ${({ size }) => size || "36px"};

  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.actionBg};
  color: white;
`;

const TransactionIcon = ({ type, ...props }) => {
  let icon;
  switch (type) {
    case "deposit":
      icon = <FaArrowDown />;
      break;
    case "income":
      icon = <FaArrowDown />;
      break;
    case "transfer":
      icon = <FaPaperPlane />;
      break;
    case "investment":
      icon = <FaShieldAlt />;
      break;
    case "withdrawal":
      icon = <FaArrowUp />;
      break;
    case "referral":
      icon = <FaUserCheck />;
      break;
    default:
      break;
  }
  return (
    <Wrapper type={type} {...props}>
      {icon}
    </Wrapper>
  );
};

export default TransactionIcon;
