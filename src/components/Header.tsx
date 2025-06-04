import {
    Box,
    Flex,
    Heading,
    HStack,
    IconButton,
    Image,
    Stack,
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
    const headingFontSize = useBreakpointValue<"2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | undefined>({
        base: 'xl',
        md: '2xl',
        lg: '3xl',
        xl: '4xl',
    });

    const subheadingFontSize = useBreakpointValue<"2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | undefined>({
        base: '2xs',
        md: 'xs',
        lg: 'sm',
        xl: 'md',
    });
    const iconImageSize = useBreakpointValue({ base: '32px', md: '48px', lg: '56px', xl: '72px' });

    useEffect(() => {}, []);

    return (
        <Box
            as={Flex}
            justifyContent="space-between"
            w="100%"
            bg="gray.subtle"
            px={3}
            py={2}
            alignItems="center"
        >
            <Stack direction={{ base: "row", md: "row" }} gap={{ base: 0, md: 4 }}>
                <IconButton minH="fit-content" maxW="fit-content" variant="plain" p={0} m={0} alignSelf="center">
                    <Image
                        
                        src={homeIcon}
                        alt="Scene Locally Icon"
                        boxSize={iconImageSize}
                    />
                </IconButton>
                <Box>
                <Heading
                    as="h1"
                    whiteSpace="nowrap"
                    textStyle={headingFontSize}
                    color={'gray.700'}
                    fontWeight={500}
                    fontFamily="Lora, serif"
                >
                    Scene Locally
                </Heading>
                <Text
                    as="h2"
                    whiteSpace="nowrap"
                    textStyle={subheadingFontSize}
                    color={'gray.700'}
                    fontFamily="Quicksand, sans-serif"
                    letterSpacing="0.4em"
                >
                    MEADOWBRIDGE
                </Text>
                </Box>
            </Stack>

            <HStack id="menu" alignItems="flex-start">
                <IconButton
                    variant="outline"
                    color="teal.solid"
                    borderColor="teal.solid"
                    borderWidth={2}
                    size="md"
                    aria-label='Toggle Brightness'
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
