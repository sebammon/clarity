import Dexie from 'dexie';

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
    constructor() {
        this.db = db.config;
    }

    upsertSettings({ token, domain }) {
        const settings = [n('token', token), n('domain', domain)].filter(
            ({ value }) => !!value
        );

        return Promise.all(settings.map((setting) => this.db.put(setting)));
    }

    async getSettings() {
        const settings = await this.db
            .where('name')
            .notEqual('userId')
            .toArray();

        return settings.reduce(
            (obj, curr) => ({ ...obj, [curr.name]: curr.value }),
            {}
        );
    }

    upsertUserId(id) {
        return this.db.put({ name: 'userId', value: id });
    }

    async getUserId() {
        const userId = await this.db.get({ name: 'userId' });

        return userId?.value;
    }
}

class NotesDB {
    constructor() {
        this.db = db.notes;
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
