import {
    Card,
    Container,
    DataList,
    Heading,
} from '@chakra-ui/react';
import { useUser } from '../contexts/UserProvider';
import LoginCard from './LoginCard';


const UserProfile: React.FC = () => {
    const { user } = useUser();
    
    return (
        <>
        {!user ? (
            <LoginCard />
        ) : (
            <Container maxW="container.lg" py={8}>
                <Heading as="h1" mb={6}>
                    User Profile
                </Heading>
                <Card.Root variant='elevated'>
                    <Card.Header bg='gray.subtle'>
                        <Card.Title>Personal Info</Card.Title>
                    </Card.Header>
                    <Card.Body>
                <DataList.Root orientation={{ sm: "horizontal" }} divideY="1px" maxW="md">
                    <DataList.Item pt="4">
                        <DataList.ItemLabel>First Name</DataList.ItemLabel>
                        <DataList.ItemValue>{user?.first_name}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item pt="4">
                        <DataList.ItemLabel>Last Name</DataList.ItemLabel>
                        <DataList.ItemValue>{user?.last_name}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item pt="4">
                        <DataList.ItemLabel>Email</DataList.ItemLabel>
                        <DataList.ItemValue>{user?.email}</DataList.ItemValue>
                    </DataList.Item>
                    {user?.role === 'organiser' &&
                        <DataList.Item pt="4">
                            <DataList.ItemLabel>Organisation</DataList.ItemLabel>
                            <DataList.ItemValue>{user?.organisation_name}</DataList.ItemValue>
                        </DataList.Item>
                    }
                </DataList.Root>
                </Card.Body>
                </Card.Root>
            </Container>
        )}
        </>
    );
};

export default UserProfile;
