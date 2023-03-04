import { HStack, List, ListItem, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import Avatar from './Avatar';
import removeMd from 'remove-markdown';

interface NotesProps {
    notes: any[];
    unreadNotes: Set<number>;
}

function Notes({ notes, unreadNotes }: NotesProps) {
    const colour = useColorModeValue('gray.700', 'gray.200');

    const formatNote = (note) => {
        if (note.system) {
            return { fontStyle: 'italic' };
        }
    };

    if (!notes.length) {
        return <Text>No comments</Text>;
    }

    return (
        <List spacing={1}>
            {notes.map((note) => (
                <ListItem key={note.id}>
                    <HStack spacing={2}>
                        <Avatar name={note.author.name} size={'xs'} />
                        <Text
                            {...formatNote(note)}
                            fontWeight={unreadNotes.has(note.id) ? 'bold' : undefined}
                            color={colour}
                            noOfLines={1}
                        >
                            {removeMd(note.body)}
                        </Text>
                    </HStack>
                </ListItem>
            ))}
        </List>
    );
}

export default Notes;
