import React from 'react';
import { Box, Button, Flex, Heading, HStack, Image, Stack, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons';
import logoBlack from '../assets/logo-black.png';
import logoWhite from '../assets/logo-white.png';

interface NavbarProps {
    onSettingsClick: () => void;
}

function Navbar({ onSettingsClick }: NavbarProps) {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Box bg={useColorModeValue('gray.200', 'gray.900')} px={4} mb={3}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <HStack>
                    <Image maxH={'3rem'} src={colorMode === 'light' ? logoBlack : logoWhite} alt={'Clarity'} />
                    <Heading size={'md'}>Clarity</Heading>
                </HStack>

                <Flex alignItems={'center'}>
                    <Stack direction={'row'}>
                        <Button onClick={toggleColorMode}>{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}</Button>
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
