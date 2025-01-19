const eventEdit = "input";
const eventRemove = "click";

class Note {
    constructor(input) {
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
        this.notes = JSON.parse(localStorage.getItem("notes"));
        localStorage.setItem("timestamp", (new Date(Date.now)).toLocaleTimeString("en-US"));
    }
}
