import { UserContext } from '../contexts/userContext';
import {
    HStack,
    Link as ChakraLink,
    Text,
    Icon,
    Menu,
    Portal,
    Link,
} from '@chakra-ui/react';
import { useContext } from 'react';

import { FaUserCircle } from 'react-icons/fa';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';

interface MainMenuProps {
    user?: User | null;
}

export default function MainMenu({ user }: MainMenuProps) {
    const linkColour: string = 'colorPalette.600';
    const context = useContext(UserContext)
    const navigate = useNavigate();
    const location = useLocation();

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
    );
}
