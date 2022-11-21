import axios from 'axios';
import { configDB } from './db';
import { getBaseUrl } from './helpers';

export const getUser = (domain, token) =>
    axios
        .get(
            domain ? `${getBaseUrl(domain)}/user` : '/user',
            token ? { headers: { 'Private-Token': token } } : undefined
        )
        .then((r) => r.data);

export const getReviewingMergeRequests = async () => {
    const userId = await configDB.getUserId();

    return axios
        .get(
            `/merge_requests?state=opened&scope=all&reviewer_id=${userId}&with_labels_details=true`
        )
        .then((r) => r.data);
};

export const getAssignedMergeRequests = () =>
    axios
        .get(
            `/merge_requests?state=opened&scope=assigned_to_me&with_labels_details=true`
        )
        .then((r) => r.data);

export const getNotes = (projectId, mergeRequestId) =>
    axios
        .get(
            `/projects/${projectId}/merge_requests/${mergeRequestId}/notes?sort=desc`
        )
        .then((r) => r.data);

export const getMergeRequestApprovals = (projectId, mergeRequestId) =>
    axios
        .get(
            `/projects/${projectId}/merge_requests/${mergeRequestId}/approval_state`
        )
        .then((r) => r.data);
