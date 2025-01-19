const ELEM_CLASS = {
    locator: "locator"
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
    click: "click"
}

const STORAGE = {
    notes: "notes",
    timestamp: "timestamp"
}

const PATHS = {
    home: "./index.html",
    writer: "./writer.html",
    reader: "./reader.html"
}

class Notebook {
    constructor() {
        this.notes = this.getStoredNotes();
        this.timestamp = this.getStoredTimestamp();
    }

    getStoredNotes() {
        return JSON.parse(localStorage.getItem(STORAGE.notes)) || [];
    }

    getStoredTimestamp() {
        return localStorage.getItem(STORAGE.timestamp) || "";
    }
    
    update() {
        localStorage.setItem(STORAGE.timestamp, (new Date(Date.now)).toLocaleTimeString("en-US"));
        localStorage.setItem(STORAGE.notes, JSON.stringify(this.notes));
    }
}

class Navi {
    constructor(title) {
        this.init(title);
    }

    init(title) {
        document.getElementsByTagName("h1")[0].innerHTML = title;
    }

    renderBackButton() {
        const backBtn = document.getElementById(ELEM_ID.buttons.back);
        backBtn.setAttribute("href", PATHS.home);
        backBtn.innerHTML = TEXT.backBtn;
    }

    renderWriterButton() {
        const writerBtn = document.getElementById(ELEM_ID.buttons.writer);
        writerBtn.setAttribute("href", PATHS.writer);
        writerBtn.innerHTML = TEXT.writerBtn;
    }

    renderReaderButton() {
        const readerBtn = document.getElementById(ELEM_ID.buttons.reader);
        readerBtn.setAttribute("href", PATHS.reader);
        readerBtn.innerHTML = TEXT.readerBtn;
    }
}

class Home {
    constructor() {
        this.navi = new Navi(TEXT.title.home);
        this.init();
    }

    init() {
        this.navi.renderWriterButton();
        this.navi.renderReaderButton();
    }
}

class Writer {
    constructor() {
        this.navi = new Navi(TEXT.title.writer);
        this.notebook = new Notebook();
        this.init();
    }

    init() {
        this.navi.renderBackButton();
        this.renderTimestamp();
        this.renderNotebook();
        this.renderAddButton();
    }

    renderTimestamp() {
        if(this.notebook.notes.length > 0) {
            document.getElementById(ELEM_ID.divs.timestamp).innerHTML = TEXT.timeStored + this.notebook.timestamp;
        }
    }

    renderNotebook() {
        for (let i = 0; i < this.notebook.notes.length; i++) {
            renderNote(i);
        }
    }

    renderNote(id) {
        const row = document.createElement("div");
        const textbox = document.createElement("textarea");
        const removeBtn = document.createElement("button");
        const notesDiv = document.getElementById(ELEM_ID.divs.notes);

        row.classList.add("row");
        textbox.classList.add("form-control");
        removeBtn.classList.add("btn", "btn-warning");

        textbox.innerText = this.notebook.notes[id];
        textbox.addEventListener(EVENTS.input, () => this.editNote(id, textbox));
        removeBtn.onclick = () => this.removeNote(id);

        row.appendChild(textbox);
        row.appendChild(removeBtn);
        notesDiv.appendChild(row);
    }

    renderAddButton() {
        const btn = document.getElementById(ELEM_ID.buttons.add);
        btn.innerHTML = TEXT.addBtn;
        btn.onclick = () => addNote();
    }
}

class Reader {
    constructor() {
        this.navi = new Navi(TEXT.title.reader);
        this.notebook = new Notebook();
        this.init();
    }

    init() {
        this.navi.renderBackButton();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const location = document.getElementsByClassName(ELEM_CLASS.locator)[0];
    switch(location.id) {
        case "index":
            new Home();
            break;
        case "writer":
            new Writer();
            break;
        case "reader":
            new Reader();
            break;
        default:
            return;
    }
});
