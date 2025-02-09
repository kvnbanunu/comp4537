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
        const lower = word.toLowerCase();
//        let res = '';
        if (this.records.get(lower) != undefined) {
            return `Request #${reqno}\nWarning! Word: '${word}' already exits.`;
/*            res = {
                "reqnum": reqno,
                "result": `Warning! The entry ${word} already exists`,
                "dictlen": this.getLength()
            }
            */
        }
        this.records.set(lower, definition);
/*        res = {
            "reqnum": reqno,
            "result": `Successfully added ${word} to dictionary`,
            "dictlen": this.getLength()
        } */
        return `Request #${reqno}\nSuccessfully added record #${this.getLength()}: ${word}`;
//        return JSON.stringify(res);
    }

    getLength() {
        return this.records.size || 0;
    }

    clear() {
        this.records.clear();
    }
}

exports.dictionary = new Dictionary();
