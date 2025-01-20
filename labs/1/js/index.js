const ELEM_CLASS = {
    locator: "locator",
    writerNote: "writer-note-block",
    readerNote: "reader-note-block"
}

const ELEM_ID = {
    buttons: {
        back: "back-btn",
        writer: "writer-btn",
        reader: "reader-btn",
        add: "add-btn"
    },
    divs: {
        main: "main",
        timestamp: "timestamp",
        notes: "note-list",
    }
}

const EVENTS = {
    input: "input",
    click: "click",
    storage: "storage"
}

const STORAGE = {
    notes: "notes",
    timestamp: "timestamp"
}

const PATHS = {
    home: "index",
    writer: "writer",
    reader: "reader"
}

class Notebook {
    constructor() {
        this.getStoredNotes();
        this.getStoredTimestamp();
    }

    getStoredNotes() {
        this.notes = JSON.parse(localStorage.getItem(STORAGE.notes)) || [];
    }

    getStoredTimestamp() {
        this.timestamp = localStorage.getItem(STORAGE.timestamp) || "";
    }

    update() {
        const d = new Date();
        localStorage.setItem(STORAGE.timestamp, d.toLocaleTimeString('en-US'));
        localStorage.setItem(STORAGE.notes, JSON.stringify(this.notes));
        this.getStoredTimestamp();
    }
}

class Navi {
    constructor() {
        this.currentPage = PATHS.home;
        this.previousPage = PATHS.home;
    }

    renderTitle(title) {
        document.getElementsByTagName("h1")[0].innerHTML = title;
    }

    renderButton(btn, id, text) {
        btn.classList.add("btn", "btn-primary");
        btn.setAttribute("id", id);
        btn.innerHTML = text;
    }
}

class Writer {
    constructor() {
        this.notebook = new Notebook();
        this.renderTimestamp();
        this.renderNotebook();
        this.renderAddButton();
    }

    renderTimestamp() {
        document.getElementById(ELEM_ID.divs.timestamp).innerHTML = TEXT.timeStored + this.notebook.timestamp;
    }

    renderNotebook() {
        for (let i = 0; i < this.notebook.notes.length; i++) {
            this.renderNote(i);
        }
    }

    renderNote(id) {
        const row = document.createElement("div");
        const textbox = document.createElement("textarea");
        const buttonWrapper = document.createElement("div");
        const removeBtn = document.createElement("button");
        const notesDiv = document.getElementById(ELEM_ID.divs.notes);

        row.classList.add("row", ELEM_CLASS.writerNote);
        textbox.classList.add("form-control", "col", "border", "border-3");
        buttonWrapper.classList.add("col-2");
        removeBtn.classList.add("btn", "btn-warning");

        textbox.innerText = this.notebook.notes[id];
        removeBtn.innerHTML = TEXT.buttons.remove;
        textbox.addEventListener(EVENTS.input, () => this.editNote(id, textbox));
        removeBtn.onclick = () => this.removeNote(id);

        row.appendChild(textbox);
        row.appendChild(buttonWrapper);
        buttonWrapper.appendChild(removeBtn);
        notesDiv.appendChild(row);
    }

    renderAddButton() {
        const btn = document.getElementById(ELEM_ID.buttons.add);
        btn.classList.add("btn", "btn-success");
        btn.innerHTML = TEXT.buttons.add;
        btn.onclick = () => this.addNote();
    }

    addNote() {
        const id = this.notebook.notes.length;
        this.notebook.notes.push("");
        this.notebook.update();
        this.renderTimestamp();
        this.renderNote(id);
    }

    // integer, element
    editNote(id, textbox) {
        this.notebook.notes[id] = textbox.value;
        this.notebook.update();
        this.renderTimestamp();
    }

    clearNoteList() {
        const notelist = document.getElementById(ELEM_ID.divs.notes);
        notelist.innerHTML = "";
    }

    removeNote(id) {
        this.notebook.notes.splice(id, 1);
        this.notebook.update();
        this.clearNoteList();
        this.renderTimestamp();
        this.renderNotebook();
    }
}

class Reader {
    constructor() {
        this.notebook = new Notebook();
        this.renderTimestamp();
        this.renderNotebook();
        window.addEventListener(EVENTS.storage, (e) => {
            if (e.key === STORAGE.notes) {
                this.refresh();
            }
        });
    }

    renderTimestamp() {
        document.getElementById(ELEM_ID.divs.timestamp).innerHTML = TEXT.timeUpdated + this.notebook.timestamp;
    }

    renderNotebook() {
        for (let i = 0; i < this.notebook.notes.length; i++) {
            this.renderNote(i);
        }
    }

    refresh() {
        document.getElementById(ELEM_ID.divs.notes).innerHTML = "";
        this.renderTimestamp();
        this.renderNotebook();
    }

    renderNote(id) {
        const row = document.createElement("div");
        const textbox = document.createElement("div");
        const notesDiv = document.getElementById(ELEM_ID.divs.notes);

        row.classList.add("row", ELEM_CLASS.readerNote);
        textbox.classList.add("col", "border", "border-3", "py-3");
        textbox.innerText = this.notebook.notes[id];

        row.appendChild(textbox);
        notesDiv.appendChild(row);
    }
}

class UI {
    constructor() {
        this.navi = new Navi();
        this.init();
    }

    init() {
        const backBtn = document.getElementById(ELEM_ID.buttons.back);
        this.navi.renderButton(backBtn, ELEM_ID.buttons.back, TEXT.buttons.back);
        backBtn.onclick = () => this.handleBack();
        this.generateHome();
    }

    clearPage(path) {
        this.navi.previousPage = this.navi.currentPage;
        this.navi.currentPage = path;
        document.getElementById(ELEM_ID.divs.timestamp).innerHTML = "";
        document.getElementById(ELEM_ID.divs.main).innerHTML = "";
    }

    gotoHome() {
        this.clearPage(PATHS.home);
        this.controller = "";
        this.generateHome();
    }

    gotoWriter() {
        this.clearPage(PATHS.writer);
        this.generateWriter();
        this.controller = new Writer();
    }

    gotoReader() {
        this.clearPage(PATHS.reader);
        this.generateReader();
        this.controller = new Reader();
    }

    handleBack() {
        if (this.navi.previousPage != this.navi.currentPage) {
            switch(this.navi.previousPage) {
                case PATHS.writer:
                    this.gotoWriter();
                    break;
                case PATHS.reader:
                    this.gotoReader();
                    break;
                default:
                    this.gotoHome();
            }
        }
    }

    generateHome() {
        const mainDiv = document.getElementById(ELEM_ID.divs.main);
        const writerBtn = document.createElement("button");
        const readerBtn = document.createElement("button");

        this.navi.renderTitle(TEXT.title.home);
        this.navi.renderButton(writerBtn, ELEM_ID.buttons.writer, TEXT.buttons.writer);
        this.navi.renderButton(readerBtn, ELEM_ID.buttons.reader, TEXT.buttons.reader);

        writerBtn.onclick = () => this.gotoWriter();
        readerBtn.onclick = () => this.gotoReader();

        mainDiv.appendChild(writerBtn);
        mainDiv.appendChild(readerBtn);
    }

    generateNotesDiv() {
        const mainDiv = document.getElementById(ELEM_ID.divs.main);
        const notesDiv = document.createElement("div");
        notesDiv.classList.add("col");
        notesDiv.setAttribute("id", ELEM_ID.divs.notes);
        mainDiv.appendChild(notesDiv);
    }

    generateWriter() {
        this.generateNotesDiv();
        this.navi.renderTitle(TEXT.title.writer);
        const addBtn = document.createElement("button");
        addBtn.setAttribute("id", ELEM_ID.buttons.add);
        document.getElementById(ELEM_ID.divs.main).appendChild(addBtn);
    }

    generateReader() {
        this.generateNotesDiv();
        this.navi.renderTitle(TEXT.title.reader);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new UI();
});
