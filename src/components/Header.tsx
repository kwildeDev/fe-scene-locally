import {
    Box,
    Flex,
    HStack,
    IconButton,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { BsBrightnessHighFill } from 'react-icons/bs';
import MainMenu from './MainMenu';
import { UserContext, User } from '../contexts/userContext';
import LoginCard from './LoginCard';
import { useContext, useEffect } from 'react';
import { FaLocationDot } from 'react-icons/fa6';

const Header: React.FC = () => {
    const { user } = useContext(UserContext);
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
                <IconButton alignSelf="flex-start" size={textFontSize} color="blue.solid" variant="plain" p={0}>
                    <FaLocationDot
                        size={textFontSize}
                />
                </IconButton>
                <Text
                    as="h1"
                    whiteSpace="nowrap"
                    fontSize={textFontSize}
                    fontWeight="bold"
                    color={'black'}
                    hideBelow={'sm'}
                >
                    Meadowbridge Scene
                </Text>
            </HStack>

            <HStack id="menu" alignItems="flex-start">
                <IconButton
                    variant="outline"
                    color="teal.solid"
                    borderColor="teal.solid"
                    borderWidth={2}
                    size="md"
                >
                    <BsBrightnessHighFill />
                </IconButton>
                <Box>
                <MainMenu user={user} />
                </Box>
                {!user && (
                    <LoginCard />
                    )
                }
            </HStack>
        </Box>
    );
};

export default Header;
