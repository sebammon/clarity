import { Avatar as ChakraAvatar, Tooltip } from '@chakra-ui/react';
import React from 'react';

function Avatar({ children, ...props }) {
    return (
        <Tooltip label={props.name}>
            <ChakraAvatar {...props}>{children}</ChakraAvatar>
        </Tooltip>
    );
}

export default Avatar;
