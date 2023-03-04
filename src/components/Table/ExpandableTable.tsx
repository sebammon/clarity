import React, { useState } from 'react';
import { Skeleton, Stack, Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { orderBy } from 'lodash';
import ExpandableRow from './ExpandableRow';

interface ExpandableTableProps {
    data: any[];
    isLoading: boolean;
}

function ExpandableTable({ data, isLoading }: ExpandableTableProps) {
    const [expand, setExpand] = useState();

    const sortedData = orderBy(data, ['draft'], ['asc']);

    const handleExpand = (mergeRequestId) => () => {
        setExpand((prev) => (prev === mergeRequestId ? undefined : mergeRequestId));
    };

    return (
        <TableContainer>
            <Table variant={'simple'} size={'sm'}>
                <Thead>
                    <Tr>
                        <Th>Merge request</Th>
                        <Th>Author</Th>
                        <Th>Reviewer</Th>
                        <Th>Pipeline</Th>
                        <Th>Status</Th>
                        <Th>Info</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {(isLoading ? [] : sortedData).map((mergeRequest) => (
                        <ExpandableRow
                            key={mergeRequest.iid}
                            data={mergeRequest}
                            isExpanded={expand === mergeRequest.iid}
                            onExpand={handleExpand(mergeRequest.iid)}
                        />
                    ))}
                </Tbody>
            </Table>
            {isLoading && (
                <Stack mt={2}>
                    <Skeleton height="32px" />
                    <Skeleton height="32px" />
                    <Skeleton height="32px" />
                </Stack>
            )}
        </TableContainer>
    );
}

export default ExpandableTable;
