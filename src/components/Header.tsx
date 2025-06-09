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
import LoginCard from './LoginCard';
import { useEffect } from 'react';
import { useUser } from '../contexts/UserProvider';
import homeIcon from '/home-icon.png';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    const { user } = useUser();
    const headingFontSize = useBreakpointValue<
        | '2xs'
        | 'xs'
        | 'sm'
        | 'md'
        | 'lg'
        | 'xl'
        | '2xl'
        | '3xl'
        | '4xl'
        | '5xl'
        | undefined
    >({
        base: 'sm',
        md: '2xl',
        lg: '3xl',
        xl: '4xl',
    });

    const subheadingFontSize = useBreakpointValue<
        '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | undefined
    >({
        base: '2xs',
        md: 'xs',
        lg: 'sm',
        xl: 'md',
    });
    const iconImageSize = useBreakpointValue({
        base: '40px',
        md: '48px',
        lg: '56px',
        xl: '72px',
    });

    useEffect(() => {}, []);

    return (
        <Flex
            as="header"
            aria-label="Main header"
            justifyContent="space-between"
            w="100%"
            bg="gray.subtle"
            px={3}
            py={2}
            alignItems="flex-start"
        >
            <Stack direction="row" gap={{ base: 0, md: 4 }} alignItems="center">
                <Link to="/">
                    <IconButton
                        aria-label='Got to home page'
                        minH="fit-content"
                        maxW="fit-content"
                        variant="plain"
                        p={0}
                        m={0}
                        alignSelf="center"
                    >
                        <Image
                            src={homeIcon}
                            alt="Scene Locally home icon"
                            boxSize={iconImageSize}
                        />
                    </IconButton>
                </Link>
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
                        letterSpacing={{ md: '0.4em' }}
                    >
                        MEADOWBRIDGE
                    </Text>
                </Box>
            </Stack>

            <HStack id="menu" alignItems="flex-start">
                <IconButton
                    variant="outline"
                    color="teal.fg"
                    borderColor="teal.fg"
                    borderWidth={2}
                    size="md"
                    aria-label="Toggle Brightness"
                >
                    <BsBrightnessHighFill />
                </IconButton>
                <Box>
                    <MainMenu />
                </Box>
                {!user && <LoginCard />}
            </HStack>
        </Flex>
    );
};

export default Header;
