import { HStack, Link, Text } from '@chakra-ui/react';
import React from 'react';

interface LinkItem {
    id: number;
    text: string;
    href: string;
}

interface MainMenuProps {
    user?: User | null;
}

export default function MainMenu({ user }: MainMenuProps) {
    const linkColour: string = 'colorPalette.600';

    const linkItems: LinkItem[] = [
        { id: 1, text: 'Browse all events', href: '/' },
        { id: 2, text: 'Sign in', href: '' },
        { id: 3, text: 'Profile', href: '' },
        { id: 4, text: 'Help', href: '' },
        {
            id: 5,
            text: 'Staff Dashboard',
            href: user?.organisation_id
                ? `/organisations/${user.organisation_id}/events`
                : '#',
        },
    ];
    return (
        <HStack colorPalette="teal">
            {linkItems.map((item) => (
                <React.Fragment key={item.id}>
                    <Link
                        color={linkColour}
                        variant="underline"
                        textDecorationColor={linkColour}
                        fontSize="lg"
                        fontWeight="semibold"
                        href={item.href}
                    >
                        {item.text}
                    </Link>
                    {item.id < 5 && (
                        <Text
                            color={linkColour}
                            fontSize="2xl"
                            fontWeight="semibold"
                        >
                            |
                        </Text>
                    )}
                </React.Fragment>
            ))}
        </HStack>
    );
}
