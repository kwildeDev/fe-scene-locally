import { UserContext } from '../contexts/userContext';
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
    Collapsible,
    useBreakpointValue,
    Box,
} from '@chakra-ui/react';
import { useContext } from 'react';

import { FaBars, FaUserCircle } from 'react-icons/fa';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';

interface MainMenuProps {
    user?: User | null;
}

export default function MainMenu({ user }: MainMenuProps) {
    const linkColour: string = 'colorPalette.600';
    const context = useContext(UserContext)
    const navigate = useNavigate();
    const location = useLocation();
    const isCollapsible = useBreakpointValue({ base: true, md: false });

    function handleSignOutClick() {
        localStorage.removeItem('jwtToken');
        if (context && context.setUser) {
            context.setUser(null);
        }
        if (location.pathname.includes('/organisations')) {
            navigate(`/`);
        }
    }

    return (
        <>
            {isCollapsible ? (
            <Collapsible.Root as="nav" width="max-content" justifyItems="end">
                <Collapsible.Trigger>
                <IconButton 
                    color="teal.solid"
                    variant="outline"
                    size="md"
                    borderColor="teal.solid"
                    borderWidth={2}
                    >
                    <FaBars />
                </IconButton>
                </Collapsible.Trigger>
                <Collapsible.Content>
                <VStack alignItems="end">
                    {/* Browse all events */}
                    <ChakraLink
                        asChild
                        color={linkColour}
                        textDecorationColor={linkColour}
                        fontSize="md"
                        fontWeight="semibold"
                    >
                        <NavLink to="/">Browse all events</NavLink>
                    </ChakraLink>

                    {/* Help */}
                    <ChakraLink
                        asChild
                        color={linkColour}
                        textDecorationColor={linkColour}
                        fontSize="md"
                        fontWeight="semibold"
                    >
                        <NavLink to="/help">Help</NavLink>
                    </ChakraLink>

                    {/* Account */}
                    {user?.user_id && (
                        <>
                            <ChakraLink asChild>
                                <NavLink to="/users/me">
                                    <HStack>
                                        <Icon color={linkColour} size="md">
                                            <FaUserCircle />
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
                                <ChakraLink asChild>
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
                            <ChakraLink asChild>
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
                                    >
                                        Sign Out
                                    </Text>
                                </Link>
                            </ChakraLink>
                        </>
                    )}
                    </VStack>
                </Collapsible.Content>
            </Collapsible.Root>
            ) : (

        <HStack colorPalette="teal">
            {/* Browse all events */}
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

            <Text color={linkColour} fontSize="2xl" fontWeight="semibold">
                |
            </Text>

            {/* Help */}
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
            <Text color={linkColour} fontSize="2xl" fontWeight="semibold">
                |
            </Text>

            {/* Account */}
            {user?.user_id && (
                <>
                    <Icon color={linkColour} size="lg">
                        <FaUserCircle />
                    </Icon>
                    <Menu.Root positioning={{ placement: 'bottom-end' }}>
                        <Menu.Trigger>
                            <Text
                                color={linkColour}
                                fontSize="lg"
                                fontWeight="semibold"
                            >
                                Account
                            </Text>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content>
                                    <Menu.Item 
                                        asChild
                                        value="profile"
                                        fontSize="lg"
                                        fontWeight="semibold"
                                    >
                                        <NavLink to="/users/me">Profile</NavLink>
                                    </Menu.Item>
                                    {user?.organisation_id && (
                                        <Menu.Item 
                                            asChild
                                            value="staff-dashboard"
                                            fontSize="lg"
                                            fontWeight="semibold"
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
