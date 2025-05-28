import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const SidebarContainer = styled.aside`
  width: 250px;
  background-color: #f4f4f4;
  padding: 1rem;
  height: 100vh;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  transition: transform 0.3s ease-in-out;
  z-index: 1000;

  @media (max-width: 768px) {
    transform: translateX(-100%);
    &.open {
      transform: translateX(0);
    }
  }
`;

export const SidebarLink = styled(NavLink)`
  display: block;
  margin: 1rem 0;
  color: ${({ theme }) => (theme.palette.mode === "light" ? "#333" : "#fff")};
  text-decoration: none;

  &.active {
    font-weight: bold;
    color: ${({ theme }) =>
      theme.palette.mode === "light" ? "#1c2230" : "#0077cc"};
  }
`;
