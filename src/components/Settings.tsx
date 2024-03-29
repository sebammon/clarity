import React, { useEffect, useState } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
} from '@chakra-ui/react';
import { configDB } from '../utils/db';
import { Setting } from '../types/types';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (settings: Setting) => void;
}

function Settings({ isOpen, onClose, onSave }: SettingsProps) {
    const [show, setShow] = useState(false);
    const [tokenValue, setTokenValue] = useState('');
    const [domainValue, setDomainValue] = useState('');

    const handleSave = () => {
        if (tokenValue && domainValue) {
            onSave && onSave({ token: tokenValue, domain: domainValue });
        } else {
            alert('Fill-in the required fields.');
        }
    };

    useEffect(() => {
        if (isOpen) {
            configDB.getSettings().then(({ token, domain }) => {
                setDomainValue(domain || '');
                setTokenValue(token || '');
            });
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Settings</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form>
                        <VStack spacing={3}>
                            <FormControl isRequired={true}>
                                <FormLabel>Domain</FormLabel>
                                <Input
                                    name={'domainValue'}
                                    autoComplete={'off'}
                                    value={domainValue}
                                    onChange={(e) => setDomainValue(e.target.value)}
                                    type={'text'}
                                    placeholder="gitlab.example.com"
                                />
                            </FormControl>
                            <FormControl isRequired={true}>
                                <FormLabel>Private Token</FormLabel>
                                <InputGroup size="md">
                                    <Input
                                        name={'token'}
                                        autoComplete={'off'}
                                        pr="4.5rem"
                                        value={tokenValue}
                                        onChange={(e) => setTokenValue(e.target.value)}
                                        type={show ? 'text' : 'password'}
                                        placeholder="Token"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" size="sm" onClick={() => setShow((prev) => !prev)}>
                                            {show ? 'Hide' : 'Show'}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                        </VStack>
                    </form>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="teal" mr={3} onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default Settings;
