import axios from 'axios';
import { configDB } from './db';

export const getUser = () =>
    axios.get('https://gitlab.unetiq.com/api/v4/user').then((r) => r.data);

export const getReviewingMergeRequests = async () => {
    const userId = await configDB.getUserId();

    return axios
        .get(
            `https://gitlab.unetiq.com/api/v4/merge_requests?state=opened&scope=all&reviewer_id=${userId}&with_labels_details=true`
        )
        .then((r) => r.data);
};

export const getAssignedMergeRequests = () =>
    axios
        .get(
            `https://gitlab.unetiq.com/api/v4/merge_requests?state=opened&scope=assigned_to_me&with_labels_details=true`
        )
        .then((r) => r.data);

export const getNotes = (projectId, mergeRequestId) =>
    axios
        .get(
            `https://gitlab.unetiq.com/api/v4/projects/${projectId}/merge_requests/${mergeRequestId}/notes?sort=desc`
        )
        .then((r) => r.data);

export const getMergeRequestApprovals = (projectId, mergeRequestId) =>
    axios
        .get(
            `https://gitlab.unetiq.com/api/v4/projects/${projectId}/merge_requests/${mergeRequestId}/approval_state`
        )
        .then((r) => r.data);
