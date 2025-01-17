const mainDiv = document.getElementById("main");
const timeDiv = document.getElementById("timestamp");
const notesDiv = document.getElementById("note-list");
const addBtn = document.getElementById("addBtn");

class Note {
    constructor(id, input) {
        this.id = id;
        this.txt = input;
    }
}

class Notebook {
    constructor() {
        this.empty = false;
        init();
    }

    init() {
        this.notes = localStorage.getItem("notes");
        if (this.notes === null) {
            this.empty = true;
        }
    }

    displayWriter() {
        if (this.empty === false) {
            timeDiv.innerText = TEXT.timeUpdated + localStorage.getItem("timestamp");
            this.notes.forEach((note) => {
                let row = document.createElement("div");
                let textbox = document.createElement("textarea");
                let removeBtn = document.createElement("button");

                row.classList.add("row");
                row.setAttribute("id", )
                textbox.classList.add.("form-control")

            });
        }
        addBtn.innerText = TEXT.addBtn;
    }

    displayReader() {

    }
}

function update() {
    localStorage.setItem("timestamp", (new Date(Date.now)).toLocaleTimeString("en-US"));
}
