import axios from 'axios';
import { removeTrailingSlash } from './helpers';

export const getBaseUrl = (domain) => `https://${removeTrailingSlash(domain)}/api/v4`;

export const getUser = (domain?: string, token?: string) =>
    axios
        .get(
            domain ? `${getBaseUrl(domain)}/user` : '/user',
            token ? { headers: { 'Private-Token': token } } : undefined
        )
        .then((r) => r.data);

export const getReviewingMergeRequests = (userId: number) => () =>
    axios
        .get(`/merge_requests?state=opened&scope=all&reviewer_id=${userId}&with_labels_details=true`)
        .then((r) => r.data);

export const getAuthoredMergeRequests = (userId: number) => () =>
    axios
        .get(`/merge_requests?state=opened&scope=all&author_id=${userId}&with_labels_details=true`)
        .then((r) => r.data);

export const getAssignedMergeRequests = () => () =>
    axios.get(`/merge_requests?state=opened&scope=assigned_to_me&with_labels_details=true`).then((r) => r.data);

export const getNotes = (projectId, mergeRequestId) =>
    axios.get(`/projects/${projectId}/merge_requests/${mergeRequestId}/notes?sort=desc`).then((r) => r.data);

export const getMergeRequestApprovals = (projectId, mergeRequestId) =>
    axios.get(`/projects/${projectId}/merge_requests/${mergeRequestId}/approval_state`).then((r) => r.data);

export const getMergeRequestDetails = (projectId, mergeRequestId) =>
    axios.get(`/projects/${projectId}/merge_requests/${mergeRequestId}`).then((r) => r.data);
