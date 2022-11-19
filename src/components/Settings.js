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
} from '@chakra-ui/react';
import { configDB } from '../utils/db';

function Settings({ isOpen, onClose, onSave }) {
    const [show, setShow] = useState(false);
    const [tokenValue, setTokenValue] = useState('');

    const handleSave = () => {
        if (tokenValue) {
            onSave && onSave(tokenValue);
        } else {
            alert('Private token is required');
        }
    };

    useEffect(() => {
        if (isOpen) {
            configDB.getToken().then((v) => {
                setTokenValue(v || '');
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
                    <FormControl>
                        <FormLabel>Private Token</FormLabel>
                        <InputGroup size="md">
                            <Input
                                pr="4.5rem"
                                value={tokenValue}
                                onChange={(e) => setTokenValue(e.target.value)}
                                type={show ? 'text' : 'password'}
                                placeholder="Token"
                            />
                            <InputRightElement width="4.5rem">
                                <Button
                                    h="1.75rem"
                                    size="sm"
                                    onClick={() => setShow((prev) => !prev)}
                                >
                                    {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
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
