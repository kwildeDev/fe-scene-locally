import {
    Box,
    Flex,
    HStack,
    IconButton,
    Image,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { BsBrightnessHighFill } from 'react-icons/bs';
import MainMenu from './MainMenu';
import { UserContext } from '../contexts/userContext';
import LoginCard from './LoginCard';
import { useContext, useEffect } from 'react';
import homeIcon from '/home-icon.png'

const Header: React.FC = () => {
    const userContext = useContext(UserContext);

    if (!userContext) {
        throw new Error('UserContext is undefined. Make sure it is properly provided.');
    }

    const { user } = userContext;
    const textFontSize = useBreakpointValue<"2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | undefined>({
        base: 'xl',
        md: '2xl',
        xl: '3xl',
    });

    const iconImageSize = useBreakpointValue({ base: '48px', md: '48px', xl: '48px' });

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
                <IconButton alignSelf="flex-start" size="md" color="blue.solid" variant="plain" p={0}>
                    <Image
                        src={homeIcon}
                        alt="Home"
                        boxSize={iconImageSize}
                    />
                </IconButton>
                <Text
                    as="h1"
                    whiteSpace="nowrap"
                    fontSize={textFontSize}
                    color={'blue.fg'}
                    hideBelow={'sm'}
                    fontFamily="Handlee, cursive"
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
                <MainMenu user={user ? { 
                    ...user, 
                    user_id: user.user_id.toString(), 
                    organisation_id: user.organisation_id !== null ? user.organisation_id.toString() : undefined 
                } : null} />
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
