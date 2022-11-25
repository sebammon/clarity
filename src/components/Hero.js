import React from 'react';
import { Box, Button, Code, Container, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

function Hero({ onOpen }) {
    return (
        <Container maxW={'xl'}>
            <Stack
                as={Box}
                textAlign={'center'}
                align={'center'}
                spacing={{ base: 8, md: 14 }}
                py={{ base: 20, md: 36 }}
            >
                <Heading fontWeight={600} fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }} lineHeight={'110%'}>
                    Welcome
                </Heading>
                <Text color={'gray.500'}>
                    Time for clarity - merge requests will never be the same again! To get started click on the button
                    below to add your GitLab domain and <Code>Private Token</Code>. If you don't have a token yet,
                    follow{' '}
                    <Link
                        href={
                            'https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#create-a-personal-access-token'
                        }
                        isExternal={true}
                    >
                        these
                        <ExternalLinkIcon mx="2px" />
                    </Link>{' '}
                    instructions to create one with <Code>read_api</Code> permissions.
                </Text>
                <Button colorScheme={'teal'} rounded={'full'} px={6} onClick={onOpen}>
                    Open settings
                </Button>
            </Stack>
        </Container>
    );
}

export default Hero;
