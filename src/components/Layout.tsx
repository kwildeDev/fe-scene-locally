import { Container, Separator } from '@chakra-ui/react';
import Header from './Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Container>
            <Header />
            <Separator />
            <main>{children}</main>
        </Container>
    );
};

export default Layout;
