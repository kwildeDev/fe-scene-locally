import {
    Box,
    Flex,
    Heading,
    HStack,
    IconButton,
    Stack,
    Text,
    useBreakpointValue,
    VisuallyHidden,
} from '@chakra-ui/react';
import MainMenu from './MainMenu';
import LoginCard from './LoginCard';
import { useEffect } from 'react';
import { useUser } from '../contexts/UserProvider';
import { Link } from 'react-router-dom';
import { ColorModeButton } from './ui/color-mode';
import { HomeIcon } from './ui/HomeIcon';

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
                        aria-label='Go to home page'
                        minH="fit-content"
                        maxW="fit-content"
                        variant="plain"
                        p={0}
                        m={0}
                        alignSelf="center"
                    >
                        <>
                        <HomeIcon boxSize={iconImageSize} color="teal.fg" />
                        <VisuallyHidden>Scene Locally Icon</VisuallyHidden> 
                        </>
                    </IconButton>
                </Link>
                <Box>
                    <Heading
                        as="h1"
                        whiteSpace="nowrap"
                        textStyle={headingFontSize}
                        color="fg.muted"
                        fontWeight={500}
                        fontFamily="Lora, serif"
                    >
                        Scene Locally
                    </Heading>
                    <Text
                        as="h2"
                        whiteSpace="nowrap"
                        textStyle={subheadingFontSize}
                        color="fg.muted"
                        fontFamily="Quicksand, sans-serif"
                        letterSpacing={{ md: '0.4em' }}
                    >
                        MEADOWBRIDGE
                    </Text>
                </Box>
            </Stack>

            <HStack id="menu" alignItems="flex-start">
                <ColorModeButton 
                    aria-label="Toggle Brightness"
                    color="teal.fg"
                    variant="outline"
                    size="md"
                    borderColor="teal.fg"
                    borderWidth={2}
                />
                <Box>
                    <MainMenu />
                </Box>
                {!user && <LoginCard />}
            </HStack>
        </Flex>
    );
};

export default Header;
