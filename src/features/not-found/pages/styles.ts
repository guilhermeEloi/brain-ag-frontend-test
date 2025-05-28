import styled from "styled-components";
import bg from "@/assets/background404.jpg";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fefefe;
  min-height: 100vh;
  overflow-x: hidden;
  background-image: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
`;

export const ContainerContentBody = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Img404 = styled.img`
  width: 425px;
  height: 425px;

  @media (max-width: 425px) {
    width: 280px;
    height: 280px;
  }
`;

export const Title = styled.h1`
  font-size: 32px;
  color: #000;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 10px;
  cursor: default;

  @media (max-width: 425px) {
    font-size: 20px;
  }
`;

export const Text = styled.p`
  font-size: 24px;
  color: #555;
  line-height: 1.8;
  text-align: justify;
  cursor: default;

  @media (max-width: 425px) {
    font-size: 14px;
  }
`;
