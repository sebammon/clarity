import { chain, startCase, toLower } from 'lodash';

const removeQuotes = (str) => str.replace(/"/g, '').replace(/'/g, '');

const removePrefix = (str) => str.replace('Draft:', '').replace('Resolve', '').trim();

export const cleanString = (str) => chain(str).thru(removeQuotes).thru(removePrefix).value();

export const getApprovals = (rules) => rules.reduce((acc, rule) => acc.concat(rule.approved_by), []);

export const getUnreadNotes = (readNoteIds, newNoteIds) => {
    const _readNotes = new Set(readNoteIds);

    return new Set<number>(newNoteIds.filter((id) => !_readNotes.has(id)));
};

export const titleCase = (str) => startCase(toLower(str));

export function hexToRgb(hex) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
    }
    return [0, 0, 0];
}

export const removeTrailingSlash = (str) => {
    if (str.endsWith('/')) {
        return str.slice(0, str.length - 1);
    }

    return str;
};
