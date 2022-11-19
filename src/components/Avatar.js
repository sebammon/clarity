import { Tooltip } from '@chakra-ui/react';
import { Avatar as CAvatar } from '@chakra-ui/avatar';
import React from 'react';

function Avatar({ children, ...props }) {
    return (
        <Tooltip label={props.name}>
            <CAvatar {...props}>{children}</CAvatar>
        </Tooltip>
    );
}

export default Avatar;
