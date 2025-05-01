import { Container, Separator } from "@chakra-ui/react";
import Header from "./Header";
import MainMenu from "./MainMenu";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Container>
            <Header />
            <Separator />
            {children}
        </Container>
    );
};

export default Layout;