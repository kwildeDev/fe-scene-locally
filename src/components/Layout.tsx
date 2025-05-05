import { Container, Separator } from "@chakra-ui/react";
import Header from "./Header";

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