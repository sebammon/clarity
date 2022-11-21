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
import { getBaseUrl } from './utils/helpers';

const verifySettings = ({ token, domain }) =>
    getUser(domain, token)
        .then(() => ({ valid: true }))
        .catch((err) => ({
            valid: false,
            message: err?.response?.data?.message,
        }));

function App() {
    const [ready, setReady] = useState(null);
    const [userId, setUserId] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast({ position: 'top-right' });

    const queryClient = useQueryClient();

    const handleError = useCallback(
        (message) => {
            toast({
                title: 'Invalid settings',
                description: message || undefined,
                status: 'error',
            });
        },
        [toast]
    );

    useEffect(() => {
        const init = async () => {
            const settings = await configDB.getSettings();

            if (settings.token && settings.domain) {
                const { valid, message } = await verifySettings(settings);

                if (valid) {
                    await handleReady(settings);
                    setReady(true);
                    return;
                }

                handleError(message || undefined);
                setReady(false);
            } else {
                setReady(false);
            }
        };

        init();
    }, [handleError]);

    const handleReady = async (settings) => {
        axios.defaults.baseURL = getBaseUrl(settings.domain);
        axios.defaults.headers['Private-Token'] = settings.token;
        const { id } = await getUser();
        await configDB.upsertUserId(id);
        setUserId(id);
    };

    const handleSave = async (settings) => {
        const { valid, message } = await verifySettings(settings);

        if (valid) {
            await configDB.upsertSettings(settings);
            await handleReady(settings);
            await queryClient.invalidateQueries();
            setReady(true);
            onClose();
        } else {
            handleError(message || undefined);
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
