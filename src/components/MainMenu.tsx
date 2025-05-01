import {
    HStack,
    Link,
    Text,
} from '@chakra-ui/react';

interface LinkItem {
    text: string;
    href: string;
}

export default function MainMenu() {
    const testOrganisationId: number = 3;

    const linkColour: string = 'colorPalette.600'

    const linkItems: LinkItem[] = [
        { text: 'Browse all events', href: '/' },
                { text: 'Sign in', href: '' },
                { text: 'Profile', href: '' },
                { text: 'Help', href: '' },
                {
                    text: 'Staff Dashboard',
                    href: `/organisations/${testOrganisationId}/events`,
                },
    ]
    return (
        <HStack colorPalette="teal">
            {linkItems.map((item, index) => (
                <>
                    <Link
                        key={`link-${index}`}
                        color={linkColour}
                        variant="underline"
                        textDecorationColor={linkColour}
                        fontSize="lg"
                        fontWeight="semibold"
                        href={item.href}
                    >
                        {item.text}
                    </Link>
                    {index < 4 && (
                        <Text
                            color={linkColour}
                            fontSize="2xl"
                            fontWeight="semibold"
                        >
                            |
                        </Text>
                    )}
                </>
            ))}
        </HStack>
    );
}
