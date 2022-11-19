import { useQuery } from '@tanstack/react-query';
import {
    getAssignedMergeRequests,
    getReviewingMergeRequests,
} from '../utils/api';
import {
    Container,
    Heading,
    Skeleton,
    useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import ExpandableTable from './ExpandableTable';

function Subheading({ children, ...props }) {
    return (
        <Heading
            fontWeight={'normal'}
            color={useColorModeValue('gray.600', 'gray.400')}
            size={'lg'}
            mb={3}
            {...props}
        >
            {children}
        </Heading>
    );
}

function Main() {
    const reviewingMergeRequests = useQuery(
        ['review'],
        getReviewingMergeRequests
    );
    const assignedMergeRequests = useQuery(
        ['assigned'],
        getAssignedMergeRequests
    );

    return (
        <Container maxW={'8xl'}>
            <Subheading>Review</Subheading>
            <Skeleton isLoaded={!reviewingMergeRequests.isLoading}>
                <ExpandableTable data={reviewingMergeRequests.data} />
            </Skeleton>
            <Subheading mt={10}>Merge</Subheading>
            <Skeleton isLoaded={!assignedMergeRequests.isLoading}>
                <ExpandableTable data={assignedMergeRequests.data} />
            </Skeleton>
        </Container>
    );
}

export default Main;
