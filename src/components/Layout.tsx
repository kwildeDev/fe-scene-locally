import { Container, Separator } from '@chakra-ui/react';
import Header from './Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Container id='layout-container' overflow="hidden">
            <Header />
            <Separator />
            <main>{children}</main>
        </Container>
    );
};

export default Layout;
