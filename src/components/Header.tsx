import { Container, Heading, Link } from '@chakra-ui/react';

const Header: React.FC = () => {
    return (
        <Container>
            <Link href={'/'}>
            <Heading p={10}>Events Platform</Heading>
            </Link>
        </Container>
    );
};

export default Header;
