import {
    Box,
    Center,
    Flex,
    HStack,
    IconButton,
    Image,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { BsBrightnessHighFill } from 'react-icons/bs';
import MainMenu from './MainMenu';
import { UserContext, User } from '../contexts/userContext';
import LoginCard from './LoginCard';
import { useContext, useEffect } from 'react';

const Header: React.FC = () => {
    const { user } = useContext(UserContext);
    const imageHeight = useBreakpointValue({ base: 30, md: 100 });
    const textFontSize = useBreakpointValue({
        base: 'xl',
        md: 'sm',
        xl: '2xl',
    });

    useEffect(() => {}, []);

    return (
        <Box
            as={Flex}
            justifyContent="space-between"
            w="100%"
            bg="gray.subtle"
            px={3}
            py={2}
        >
            <HStack>
                <Image
                    objectFit="contain"
                    height={imageHeight}
                    src="/assets/simple-tree-icon-6.jpg"
                    alt="Logo"
                />

                <Center>
                <Text
                    whiteSpace="nowrap"
                    fontSize={textFontSize}
                    fontWeight="bold"
                    color={'black'}
                    hideBelow={'sm'}
                >
                    Meadowbridge Scene
                </Text>
                </Center>
            </HStack>

            <HStack alignItems="flex-start">
                <IconButton
                    variant="outline"
                    color="teal.solid"
                    borderColor="teal.solid"
                    borderWidth={2}
                    size="md"
                >
                    <BsBrightnessHighFill />
                </IconButton>
                <MainMenu user={user} />
                {!user && (
                    <LoginCard />
                    )
                }
            </HStack>
        </Box>
    );
};

export default Header;
