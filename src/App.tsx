import React, { useCallback, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { Center, Spinner, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import Settings from './components/Settings';
import Hero from './pages/Hero';
import { configDB } from './utils/db';
import { useQueryClient } from '@tanstack/react-query';
import { getBaseUrl, getUser } from './utils/api';
import axios from 'axios';
import Main from './pages/Main';
import { UserIdContext } from './utils/contexts';

const verifySettings = ({ token, domain }) =>
    getUser(domain, token)
        .then(() => ({ valid: true, message: null }))
        .catch((err) => ({
            valid: false,
            message: err?.response?.data?.message,
        }));

function App() {
    const [ready, setReady] = useState<null | boolean>(null);
    const [userId, setUserId] = useState<null | number>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast({ position: 'top-right' });

    const queryClient = useQueryClient();

    const handleError = useCallback((message) => {
        toast({
            title: 'Invalid settings',
            description: message || undefined,
            status: 'error',
        });
    }, []);

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
                    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                </VStack>
            </Center>
        );
    }

    return (
        <React.Fragment>
            <UserIdContext.Provider value={userId as number}>
                <Navbar onSettingsClick={onOpen} />
                <Settings isOpen={isOpen} onClose={onClose} onSave={handleSave} />
                {ready ? <Main /> : <Hero onOpen={onOpen} />}
            </UserIdContext.Provider>
        </React.Fragment>
    );
}

export default App;
