import Navbar from "../NavBar";

import { Content, LayoutContainer, MainArea } from "./styles";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutContainer>
      <Navbar />
      <MainArea>
        <Content>{children}</Content>
      </MainArea>
    </LayoutContainer>
  );
}
