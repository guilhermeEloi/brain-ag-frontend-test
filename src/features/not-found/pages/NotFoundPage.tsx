import img404 from "@/assets/404.png";

import { Container, ContainerContentBody, Img404, Text, Title } from "./styles";

export default function NotFoundPage() {
  return (
    <Container>
      <ContainerContentBody>
        <Img404 src={img404} alt="Imagem de erro 404" />
        <Title>Página não encontrada</Title>
        <Text>A página que você procura não existe.</Text>
      </ContainerContentBody>
    </Container>
  );
}
