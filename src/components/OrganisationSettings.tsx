import { Container, Heading } from "@chakra-ui/react";


const OrganisationSettings: React.FC = () => {
    return(
            <Container maxW="container.lg" py={8}>
                        <Heading as="h1" mb={6} textAlign="center">
                            Organisation Settings
                        </Heading>
            </Container>
        )
    };

export default OrganisationSettings;