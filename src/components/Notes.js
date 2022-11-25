import { HStack, List, ListItem, Text, useColorModeValue } from '@chakra-ui/react';
import removeMd from 'remove-markdown';
import React from 'react';
import Avatar from './Avatar';

function Notes({ unreadNotes, ...props }) {
    const notes = props.notes || [];
    const color = useColorModeValue('gray.700', 'gray.200');

    if (!notes.length) {
        return <Text>No comments</Text>;
    }

    return (
        <List spacing={1}>
            {notes.map((note) => (
                <ListItem key={note.id}>
                    <HStack spacing={2}>
                        <Avatar name={note.author.name} size={'xs'} />
                        <Text fontWeight={unreadNotes.has(note.id) ? 'bold' : undefined} color={color} noOfLines={1}>
                            {removeMd(note.body)}
                        </Text>
                    </HStack>
                </ListItem>
            ))}
        </List>
    );
}

export default Notes;
