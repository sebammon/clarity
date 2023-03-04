import { useQuery } from '@tanstack/react-query';
import { getAssignedMergeRequests, getAuthoredMergeRequests, getReviewingMergeRequests } from '../utils/api';
import { Container, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useContext } from 'react';
import ExpandableTable from '../components/Table/ExpandableTable';
import { useLocalStorage } from '../utils/hooks';
import { UserIdContext } from '../utils/contexts';

interface TabViewProps {
    dataKey: string;
    dataFn: (id: number) => () => Promise<any>;
}

function TabView({ dataKey, dataFn }: TabViewProps) {
    const userId = useContext(UserIdContext);

    const query = useQuery([dataKey], dataFn(userId));

    return <ExpandableTable data={query.data} isLoading={query.isLoading} />;
}

function Main() {
    const [_tabIndex, setTabIndex] = useLocalStorage('tabIndex', 0);

    const tabIndex = Number(_tabIndex);

    const handleTabsChange = (index) => setTabIndex(index);

    return (
        <Container maxW={'8xl'}>
            <Tabs
                isLazy={false}
                variant={'line'}
                colorScheme={'teal'}
                index={tabIndex}
                onChange={handleTabsChange}
                defaultIndex={tabIndex}
            >
                <TabList>
                    <Tab>Authored</Tab>
                    <Tab>Reviewing</Tab>
                    <Tab>Assigned</Tab>
                </TabList>

                <TabPanels mt={4} mb={3}>
                    <TabPanel>
                        <TabView dataKey={'author'} dataFn={getAuthoredMergeRequests} />
                    </TabPanel>
                    <TabPanel>
                        <TabView dataKey={'review'} dataFn={getReviewingMergeRequests} />
                    </TabPanel>
                    <TabPanel>
                        <TabView dataKey={'assigned'} dataFn={getAssignedMergeRequests} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
}

export default Main;
