import { Container } from "@chakra-ui/react";
import Header from "./Header";
import MainMenu from "./MainMenu";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Container>
            <Header />
            <MainMenu />
            {children}
        </Container>
    );
};

export default Layout;