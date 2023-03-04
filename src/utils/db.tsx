import Dexie from 'dexie';
import { Setting } from '../types/types';

// TODO: Super hacky! Reset the database in the worst case
window.addEventListener('unhandledrejection', (e) => {
    const message = e?.reason?.message || '';

    // Messed up something with the versions, let's reset everything
    if (message.includes('VersionError')) {
        db.delete();
        window.location.reload();
    }
});

const db = new Dexie('clarity');

db.version(1).stores({
    config: `name, value`,
    notes: `noteId, [projectId+mergeRequestId], read`,
});

const n = (name, value) => ({ name, value });

class ConfigDB {
    private db: Dexie.Table<{ name: string; value: string }, string>;

    constructor() {
        this.db = db.table('config');
    }

    upsertSettings({ token, domain }) {
        const settings = [n('token', token), n('domain', domain)].filter(({ value }) => !!value);

        return Promise.all(settings.map((setting) => this.db.put(setting)));
    }

    async getSettings() {
        const settings = await this.db.where('name').notEqual('userId').toArray();

        return settings.reduce((obj, curr) => ({ ...obj, [curr.name]: curr.value }), {} as Setting);
    }

    upsertUserId(id) {
        return this.db.put({ name: 'userId', value: id });
    }
}

class NotesDB {
    private db: Dexie.Table<
        {
            noteId: number;
            projectId: number;
            mergeRequestId: number;
            read: boolean;
        },
        number
    >;

    constructor() {
        this.db = db.table('notes');
    }

    bulkUpsert(arr) {
        return this.db.bulkPut(arr);
    }

    getNotes(projectId, mergeRequestId) {
        return this.db.where({ projectId, mergeRequestId }).toArray();
    }
}

export const configDB = new ConfigDB();
export const notesDB = new NotesDB();
