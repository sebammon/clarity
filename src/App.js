import React, { useCallback, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import {
    Center,
    Spinner,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import Settings from './components/Settings';
import Hero from './components/Hero';
import { configDB } from './utils/db';
import { useQueryClient } from '@tanstack/react-query';
import { getUser } from './utils/api';
import axios from 'axios';
import Main from './components/Main';
import { UserIdContext } from './utils/contexts';

function App() {
    const [ready, setReady] = useState(null);
    const [userId, setUserId] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast({ position: 'top-right' });

    const queryClient = useQueryClient();

    const handleError = useCallback(
        (e) => {
            toast({
                title: 'Token error',
                description: `Invalid token: ${e?.response?.data?.message}`,
                status: 'error',
            });
        },
        [toast]
    );

    useEffect(() => {
        const init = async () => {
            const token = await configDB.getToken();

            try {
                if (token) {
                    await handleReady(token);
                    setReady(true);
                    return;
                }
            } catch (e) {
                handleError(e);
            }

            setReady(false);
        };

        init();
    }, [handleError]);

    const handleReady = async (token) => {
        axios.defaults.headers['Private-Token'] = token;
        const { id } = await getUser();
        await configDB.upsertUserId(id);
        setUserId(id);
    };

    const handleSave = async (token) => {
        let prevToken = await configDB.getToken();

        try {
            await configDB.upsertToken(token);
            await handleReady(token);
            await queryClient.invalidateQueries();
            setReady(true);
            onClose();
        } catch (e) {
            if (prevToken) {
                // Roll back
                await configDB.upsertToken(prevToken);
                await handleReady(prevToken);
                await queryClient.invalidateQueries();
            }
            handleError(e);
        }
    };

    if (ready === null) {
        return (
            <Center>
                <VStack h={'100vh'} justifyContent={'space-evenly'}>
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                    />
                </VStack>
            </Center>
        );
    }

    return (
        <React.Fragment>
            <UserIdContext.Provider value={userId}>
                <Navbar onSettingsClick={onOpen} />
                <Settings
                    isOpen={isOpen}
                    onClose={onClose}
                    onSave={handleSave}
                />
                {!ready ? <Hero onOpen={onOpen} /> : <Main />}
            </UserIdContext.Provider>
        </React.Fragment>
    );
}

export default App;
