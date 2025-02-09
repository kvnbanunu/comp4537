class Dictionary {
    constructor() {
        this.records = new Map();
    }

    search(word) {
        const def = this.records.get(word) || null;
        const res = {
            "definition": def
        }
        return JSON.stringify(res);
    }
    
    add(word, definition, reqno) {
        if (this.records.get(word) != undefined) {
            return `Request #${reqno}\nWarning! Word: '${word}' already exits.`;
        }
        this.records.set(word, definition);
        return `Request #${reqno}\nSuccessfully added record #${this.getLength()}: ${word}`;
    }

    getLength() {
        return this.records.size || 0;
    }

    clear() {
        this.records.clear();
    }
}

exports.dictionary = new Dictionary();
