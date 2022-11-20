import Dexie from 'dexie';

const db = new Dexie('clarity');

db.version(1).stores({
    config: `name, value`,
    notes: `note, [project+mergeRequest], read`,
});

class ConfigDB {
    constructor() {
        this.db = db.config;
    }

    upsertToken(token) {
        return this.db.put({ name: 'privateToken', value: token });
    }

    async getToken() {
        const token = await this.db.get({ name: 'privateToken' });

        return token?.value;
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

    getNotes(project, mergeRequest) {
        return this.db.where({ project, mergeRequest }).toArray();
    }
}

export const configDB = new ConfigDB();
export const notesDB = new NotesDB();
