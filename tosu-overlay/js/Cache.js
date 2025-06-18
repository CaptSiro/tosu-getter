export default class Cache {
    map;

    constructor() {
        this.map = new Map();
    }

    set(key, value) {
        const v = this.map.get(key);
        if (!(v === undefined || v !== value)) {
            return false;
        }

        this.map.set(key, value);
        return true;
    }

    get(key) {
        return this.map.get(key);
    }
}