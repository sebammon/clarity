import React, { useContext } from 'react';
import {
    AvatarBadge,
    Box,
    ButtonGroup,
    Collapse,
    HStack,
    Icon,
    IconButton,
    Link,
    Tag,
    Td,
    Text,
    Tooltip,
    Tr,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import {
    ChatIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    QuestionIcon,
    WarningIcon,
    WarningTwoIcon,
} from '@chakra-ui/icons';
import { cleanString, getApprovals, getUnreadNotes, hexToRgb, titleCase } from '../../utils/helpers';
import { getMergeRequestApprovals, getMergeRequestDetails, getNotes } from '../../utils/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import Notes from '../Notes';
import Avatar from '../Avatar';
import ReadIcon from '../ReadIcon';
import { notesDB } from '../../utils/db';
import { UserIdContext } from '../../utils/contexts';

const COL_SPAN = 6;

function Status({ status, label }) {
    const commonProps = { w: 5, h: 5 };
    let icon;

    if (status === 'failed') {
        icon = <WarningIcon color={'red.600'} {...commonProps} />;
    } else if (status === 'success') {
        icon = <CheckCircleIcon color={'green.600'} {...commonProps} />;
    } else {
        icon = <QuestionIcon color={'gray.600'} {...commonProps} />;
    }

    return <Tooltip label={titleCase((label || '').replace(/_/g, ' '))}>{icon}</Tooltip>;
}

function PipelineStatus({ projectId, mergeRequestId }) {
    const detailQuery = useQuery(['detail', projectId, mergeRequestId], () =>
        getMergeRequestDetails(projectId, mergeRequestId)
    );

    const pipeline = detailQuery.data?.head_pipeline;

    if (detailQuery.isLoading) {
        return <Text>...</Text>;
    }

    return (
        <Link isExternal={true} href={pipeline?.web_url}>
            <Status status={pipeline?.status} label={pipeline?.detailed_status?.label} />
        </Link>
    );
}

function ExpandableRow({ data, isExpanded, onExpand }) {
    const mergeRequest = data;
    const mergeRequestId = mergeRequest.iid;
    const projectId = mergeRequest.project_id;
    const labels = mergeRequest.labels;

    const userId = useContext(UserIdContext);

    const approvalQuery = useQuery(['approvals', projectId, mergeRequestId], () =>
        getMergeRequestApprovals(projectId, mergeRequestId)
    );
    const notesQuery = useQuery(['notes', projectId, mergeRequestId], () => getNotes(projectId, mergeRequestId));
    const readNotesQuery = useQuery(['notes-read', projectId, mergeRequestId], () =>
        notesDB.getNotes(projectId, mergeRequestId)
    );
    const readNotesMutation = useMutation({
        mutationFn: (data: any) => notesDB.bulkUpsert(data),
        onSuccess: () => readNotesQuery.refetch(),
    });

    const approvals = getApprovals(approvalQuery.data?.rules || []);
    const approvalIds = new Set(approvals.map((approver) => approver.id));

    const notes = notesQuery.data || [];
    const newNoteIds = notes.filter((n) => n.author.id !== userId).map((n) => n.id);
    const readNoteIds = (readNotesQuery.data || []).map((n) => n.noteId);

    const hasConflicts = mergeRequest.has_conflicts;

    const unreadNotes = getUnreadNotes(readNoteIds, newNoteIds);
    const hasUnreadNotes = !!unreadNotes.size;

    const handleMarkRead = (e) => {
        e.stopPropagation();

        const markNotesRead = Array.from(unreadNotes).map((noteId) => ({
            noteId,
            mergeRequestId,
            projectId,
            read: true,
        }));

        readNotesMutation.mutate(markNotesRead);
    };

    return (
        <React.Fragment>
            {/* TODO: Shouldn't need important */}
            <Tr
                sx={{
                    '& > *': {
                        borderBottom: 'unset !important',
                    },
                }}
            >
                <Td w={'100%'} cursor={'pointer'} onClick={onExpand}>
                    <HStack>
                        <ButtonGroup size={'sm'} spacing="1">
                            <IconButton
                                variant={'ghost'}
                                aria-label="Expand row"
                                icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            />
                            {hasUnreadNotes && (
                                <IconButton
                                    onClick={handleMarkRead}
                                    variant={'ghost'}
                                    aria-label={'Mark read'}
                                    icon={<ReadIcon />}
                                />
                            )}
                        </ButtonGroup>
                        <Link
                            whiteSpace={'normal'}
                            onClick={(e) => e.stopPropagation()}
                            href={mergeRequest.web_url}
                            fontWeight={hasUnreadNotes ? 'bold' : undefined}
                            target={'_blank'}
                            rel={'noreferrer'}
                        >
                            {mergeRequest.draft && (
                                <Text color={'gray.500'} as={'span'}>
                                    Draft:&nbsp;
                                </Text>
                            )}
                            <Text as={'span'}>
                                {cleanString(mergeRequest.title)} ({mergeRequestId})
                            </Text>
                        </Link>
                        <Wrap spacing={1}>
                            {labels.map((label) => (
                                <WrapItem key={label.id}>
                                    <Tag
                                        key={label.id}
                                        size={'sm'}
                                        minW={1}
                                        minH={1}
                                        variant="solid"
                                        bgColor={`rgba(${hexToRgb(label.color).join(', ')}, 0.8)`}
                                    >
                                        {label.name}
                                    </Tag>
                                </WrapItem>
                            ))}
                        </Wrap>
                    </HStack>
                </Td>
                <Td>
                    <Avatar name={mergeRequest.author.name} size={'xs'} />
                </Td>
                <Td>
                    <HStack spacing={1}>
                        {(mergeRequest.reviewers || []).map((reviewer) => (
                            <Avatar key={reviewer.id} name={reviewer.name} size={'xs'}>
                                {approvalIds.has(reviewer.id) ? (
                                    <AvatarBadge as={Icon} boxSize="1.8em" bg={'white'} color={'green.600'}>
                                        <CheckCircleIcon />
                                    </AvatarBadge>
                                ) : null}
                            </Avatar>
                        ))}
                    </HStack>
                </Td>
                <Td>
                    <PipelineStatus projectId={projectId} mergeRequestId={mergeRequestId} />
                </Td>
                <Td>
                    {hasConflicts && (
                        <Tooltip label={'Merge Conflicts'}>
                            <WarningTwoIcon w={5} h={5} />
                        </Tooltip>
                    )}
                </Td>
                <Td>
                    <HStack spacing={1}>
                        <ChatIcon />
                        <Text>{mergeRequest.user_notes_count}</Text>
                    </HStack>
                </Td>
            </Tr>
            <Tr whiteSpace={'normal'}>
                <Td colSpan={COL_SPAN} py={0}>
                    <Collapse in={isExpanded} unmountOnExit={true} animateOpacity={false}>
                        <Box pb={4} px={7}>
                            {notesQuery.isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <Notes notes={notes} unreadNotes={unreadNotes} />
                            )}
                        </Box>
                    </Collapse>
                </Td>
            </Tr>
        </React.Fragment>
    );
}

export default ExpandableRow;
