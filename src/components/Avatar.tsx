import { Avatar as ChakraAvatar, AvatarProps as ChakraAvatarProps, Tooltip } from '@chakra-ui/react';
import React from 'react';

type AvatarProps = ChakraAvatarProps & {
    name: string;
};

function Avatar({ children, ...props }: React.PropsWithChildren<AvatarProps>) {
    return (
        <Tooltip label={props.name}>
            <ChakraAvatar {...props}>{children}</ChakraAvatar>
        </Tooltip>
    );
}

export default Avatar;
