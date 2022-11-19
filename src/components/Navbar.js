import React from 'react';
import {
    Box,
    Button,
    Flex,
    Heading,
    Stack,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { MoonIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons';

function Navbar({ onSettingsClick }) {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Box bg={useColorModeValue('gray.200', 'gray.900')} px={4} mb={8}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Box>
                    <Heading size={'md'}>Clarity</Heading>
                </Box>

                <Flex alignItems={'center'}>
                    <Stack direction={'row'}>
                        <Button onClick={toggleColorMode}>
                            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        </Button>
                        <Button onClick={onSettingsClick}>
                            <SettingsIcon />
                        </Button>
                    </Stack>
                </Flex>
            </Flex>
        </Box>
    );
}

export default Navbar;
