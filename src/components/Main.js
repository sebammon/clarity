import { useQuery } from '@tanstack/react-query';
import { getAssignedMergeRequests, getAuthoredMergeRequests, getReviewingMergeRequests } from '../utils/api';
import {
    Container,
    Heading,
    Skeleton,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import ExpandableTable from './ExpandableTable';
import { useLocalStorage } from '../utils/hooks';

function Subheading({ children, ...props }) {
    return (
        <Heading fontWeight={'normal'} color={useColorModeValue('gray.600', 'gray.400')} size={'lg'} mb={3} {...props}>
            {children}
        </Heading>
    );
}

function Main() {
    const [_tabIndex, setTabIndex] = useLocalStorage('tabIndex', 0);

    const authoredMergeRequests = useQuery(['author'], getAuthoredMergeRequests);
    const reviewingMergeRequests = useQuery(['review'], getReviewingMergeRequests);
    const assignedMergeRequests = useQuery(['assigned'], getAssignedMergeRequests);

    const tabIndex = Number(_tabIndex);

    const handleTabsChange = (index) => setTabIndex(index);

    return (
        <Container maxW={'8xl'}>
            <Tabs
                variant={'line'}
                colorScheme={'teal'}
                value={tabIndex}
                onChange={handleTabsChange}
                defaultIndex={tabIndex}
            >
                <TabList>
                    <Tab>Author</Tab>
                    <Tab>Review</Tab>
                    <Tab>Assigned</Tab>
                </TabList>

                <TabPanels mt={4} mb={3}>
                    <TabPanel>
                        <Skeleton isLoaded={!authoredMergeRequests.isLoading}>
                            <ExpandableTable data={authoredMergeRequests.data} />
                        </Skeleton>
                    </TabPanel>
                    <TabPanel>
                        <Skeleton isLoaded={!reviewingMergeRequests.isLoading}>
                            <ExpandableTable data={reviewingMergeRequests.data} />
                        </Skeleton>
                    </TabPanel>
                    <TabPanel>
                        <Skeleton isLoaded={!assignedMergeRequests.isLoading}>
                            <ExpandableTable data={assignedMergeRequests.data} />
                        </Skeleton>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
}

export default Main;
