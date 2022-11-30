const PREFIXES = ['Draft', 'Resolve'];

const removeQuotes = (str) => str.replace(/"/g, '').replace(/'/g, '');

const removePrefix = (str) => {
    for (let pref of PREFIXES) {
        if (str.startsWith(pref)) {
            return str.slice(pref.length + 1);
        }
    }

    return str;
};

export const cleanString = (str) => removeQuotes(removePrefix(str));

export const getApprovals = (rules) => rules.reduce((acc, rule) => acc.concat(rule.approved_by), []);

export const getUnreadNotes = (readNoteIds, newNoteIds) => {
    const _readNotes = new Set(readNoteIds);

    return new Set(newNoteIds.filter((id) => !_readNotes.has(id)));
};

export const firstUpper = (str) => {
    if (str && str.length) {
        return str[0].toUpperCase() + str.slice(1);
    }

    return '';
};

export const titleCase = (str) => str.split(' ').map(firstUpper).join(' ');

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

export const getBaseUrl = (domain) => `https://${removeTrailingSlash(domain)}/api/v4/`;
