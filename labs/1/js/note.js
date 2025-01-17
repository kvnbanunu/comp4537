class Note {
    constructor(id, input) {
        this.id = id;
        this.txt = input;
    }
}

class Notebook {
    constructor() {
        this.mainDiv = document.getElementById("main");
        this.timeDiv = document.getElementById("timestamp");
        this.notesDiv = document.getElementById("note-list");
        this.empty = false;
        init();
    }

    init() {
        this.notes = JSON.parse(localStorage.getItem("notes"));
        if (this.notes === null) {
            this.empty = true;
        }
    }

    update() {
        localStorage.setItem("timestamp", (new Date(Date.now)).toLocaleTimeString("en-US"));
    }

    display() {
        // abstract
    }
}
