import * as Filesystem from "expo-file-system";
const BASE_PATH = Filesystem.Paths.document;

const LocalStore = {
    getItem: async (key) => {
        const file = new Filesystem.File(BASE_PATH, key);
        
        if (!file.exists) {
            file.create();
        }

        let result = await file.text();
        if (result === "") {
            result = null;
        }

        return JSON.parse(result) ?? null;
    },
    setItem: async (key, values) => {
        const file = new Filesystem.File(BASE_PATH, key);
        if (!file.exists) {
            file.create();
        }

        file.write(JSON.stringify(values));
        // console.log('written', values);
        
        return file.textSync();
    },
    deleteItem: (key) => {
        const file = new Filesystem.File(BASE_PATH, key);
        if (file.exists) {
            file.delete();
        }

        return true;
    }
}

export default LocalStore;