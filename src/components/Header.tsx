import {
    Box,
    Flex,
    HStack,
    IconButton,
    Image,
    Link,
    LinkBox,
    LinkOverlay,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { BsBrightnessHighFill } from 'react-icons/bs';
import MainMenu from './MainMenu';

const Header: React.FC = () => {
    const imageHeight = useBreakpointValue({ base: 30, md: 100 });
    const textFontSize = useBreakpointValue({
        base: 'xl',
        md: 'sm',
        xl: '2xl',
    });
    return (
        <Box
            as={Flex}
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            bg="gray.subtle"
            px={3}
            py={2}
        >
            <HStack>
                <Image
                    objectFit="contain"
                    height={imageHeight}
                    src="../../src/assets/simple-tree-icon-6.jpg"
                    alt="Logo"
                />

                <Text
                    whiteSpace="nowrap"
                    fontSize={textFontSize}
                    fontWeight="bold"
                    color={'black'}
                    hideBelow={'sm'}
                >
                    Meadowbridge Scene
                </Text>
            </HStack>

            <HStack>
                <IconButton variant='outline' color='teal.solid' borderColor='teal.solid' borderWidth={2} size="md">
                    <BsBrightnessHighFill />
                </IconButton>
                <MainMenu />
            </HStack>
        </Box>
    );
};

export default Header;
