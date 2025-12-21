import {
    HStack,
    Link as ChakraLink,
    Text,
    Icon,
    Menu,
    Portal,
    Link,
    IconButton,
    VStack,
    useBreakpointValue,
    Drawer,
    CloseButton,
    Box,
    Separator,
    Button,
} from '@chakra-ui/react';
import { useState } from 'react';

import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { HomeIcon } from './ui/HomeIcon';
import { useUser } from '../contexts/UserProvider';
import { CircleUser, MenuIcon } from 'lucide-react';

export default function MainMenu() {
    const linkColour: string = 'teal.fg';
    const { user, logout } = useUser();

    const navigate = useNavigate();
    const location = useLocation();
    const isMobileBreakpoint = useBreakpointValue({ base: true, md: false });

    const [isOpen, setIsOpen] = useState<boolean>(false);

    function handleSignOutClick() {
        logout();
        if (location.pathname.includes('/organisations')) {
            navigate(`/`);
        }
        setIsOpen(false);
    }

    return (
        <>
            {isMobileBreakpoint ? (
                // --- Mobile View ---
                <>
                    <Drawer.Root
                        placement='end'
                        open={isOpen}
                    >
                        <Drawer.Trigger asChild>
                            <IconButton
                                aria-label="Open navigation menu"
                                color="teal.fg"
                                variant="outline"
                                size="md"
                                borderColor="teal.fg"
                                borderWidth={2}
                                onClick={() => setIsOpen(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Drawer.Trigger>
                        <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner h="max-content">
                        <Drawer.Content rounded="md">
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="md" onClick={() => setIsOpen(false)} />
                            </Drawer.CloseTrigger>
                            <Drawer.Header bg="gray.subtle" mb={5}>
                                <HomeIcon
                                    boxSize="40px"
                                    color="teal.fg"
                                />
                                
                                <Box>
                                <Text 
                                    color={'fg.muted'}
                                    fontFamily="Lora, serif" fontWeight={500}
                                >
                                    Scene Locally
                                </Text>
                                <Text
                                    fontSize="2xs"
                                    color={'fg.muted'}
                                    fontFamily="Quicksand, sans-serif"
                                >
                                    MEADOWBRIDGE
                                </Text>
                                </Box>
                                </Drawer.Header>
                            <Drawer.Body>
                                <VStack alignItems="end" gap={4}>
                                    <ChakraLink
                                        asChild
                                        color={linkColour}
                                        textDecorationColor={linkColour}
                                        fontSize="md"
                                        fontWeight="semibold"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <NavLink to="/">Browse all events</NavLink>
                                    </ChakraLink>

                                    <ChakraLink
                                        asChild
                                        color={linkColour}
                                        textDecorationColor={linkColour}
                                        fontSize="md"
                                        fontWeight="semibold"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <NavLink to="/help">Help</NavLink>
                                    </ChakraLink>

                                    {user?.user_id && (
                                        <>
                                            <ChakraLink asChild onClick={() => setIsOpen(false)}>
                                                <NavLink to="/users/me">
                                                    <HStack>
                                                        <Icon color={linkColour} size="md">
                                                            <CircleUser />
                                                        </Icon>
                                                        <Text
                                                            color={linkColour}
                                                            fontSize="md"
                                                            fontWeight="semibold"
                                                        >
                                                            Account
                                                        </Text>
                                                    </HStack>
                                                </NavLink>
                                            </ChakraLink>
                                            {user?.organisation_id && (
                                                <ChakraLink asChild onClick={() => setIsOpen(false)}>
                                                    <NavLink to={`/organisations/${user.organisation_id}/events`}>
                                                        <Text
                                                            marginLeft={6}
                                                            color={linkColour}
                                                            fontSize="md"
                                                            fontWeight="semibold"
                                                        >
                                                            Staff Dashboard
                                                        </Text>
                                                    </NavLink>
                                                </ChakraLink>
                                            )}
                                            <ChakraLink asChild onClick={() => setIsOpen(false)}>
                                                <Link
                                                    variant="plain"
                                                    textDecoration="none"
                                                    onClick={handleSignOutClick}
                                                >
                                                    <Text
                                                        marginLeft={6}
                                                        color={linkColour}
                                                        fontSize="md"
                                                        fontWeight="semibold"
                                                        pb={4}
                                                    >
                                                        Sign Out
                                                    </Text>
                                                </Link>
                                            </ChakraLink>
                                        </>
                                    )}
                                </VStack>
                            </Drawer.Body>
                        </Drawer.Content>
                        </Drawer.Positioner>
                        </Portal>
                    </Drawer.Root>
                </>
            ) : (
                // --- Desktop View ---
                <HStack colorPalette="teal">
                    <ChakraLink
                        asChild
                        color={linkColour}
                        variant="underline"
                        textDecorationColor={linkColour}
                        fontSize="lg"
                        fontWeight="semibold"
                    >
                        <NavLink to="/">Browse all events</NavLink>
                    </ChakraLink>
                    <Separator orientation="vertical" size="lg" height="4"></Separator>

                    <ChakraLink
                        asChild
                        color={linkColour}
                        variant="underline"
                        textDecorationColor={linkColour}
                        fontSize="lg"
                        fontWeight="semibold"
                    >
                        <NavLink to="/help">Help</NavLink>
                    </ChakraLink>
                    <Separator orientation="vertical" size="lg" height="4"></Separator>

                    {user?.user_id && (
                        <>
                            <Icon color={linkColour} size="lg">
                                <CircleUser />
                            </Icon>
                            <Menu.Root positioning={{ placement: 'bottom-end' }}>
                                <Menu.Trigger asChild>
                                    <Button
                                        p={0}
                                        variant="plain"
                                        color={linkColour}
                                        fontSize="lg"
                                        fontWeight="semibold"
                                        textDecoration="underline"
                                        textUnderlineOffset={3}
                                        
                                    >
                                        Account
                                    </Button>
                                </Menu.Trigger>
                                <Portal>
                                    <Menu.Positioner>
                                        <Menu.Content>
                                            <Menu.Item
                                                asChild
                                                value="profile"
                                                fontSize="lg"
                                                fontWeight="semibold"
                                                cursor="pointer"
                                            >
                                                <NavLink to="/users/me">Profile</NavLink>
                                            </Menu.Item>
                                            {user?.organisation_id && (
                                                <Menu.Item
                                                    asChild
                                                    value="staff-dashboard"
                                                    fontSize="lg"
                                                    fontWeight="semibold"
                                                    cursor="pointer"
                                                >
                                                    <NavLink to={`/organisations/${user.organisation_id}/events`}>
                                                        Staff Dashboard
                                                    </NavLink>
                                                </Menu.Item>
                                            )}
                                            <Menu.Separator />
                                            <Menu.Item
                                                asChild
                                                value="sign-out"
                                                fontSize="lg"
                                                fontWeight="semibold"
                                                cursor="pointer"
                                            >
                                                <Link
                                                    variant="plain"
                                                    textDecoration="none"
                                                    onClick={handleSignOutClick}
                                                >
                                                    Sign Out
                                                </Link>
                                            </Menu.Item>
                                        </Menu.Content>
                                    </Menu.Positioner>
                                </Portal>
                            </Menu.Root>
                        </>
                    )}
                </HStack>
            )}
        </>
    );
}
