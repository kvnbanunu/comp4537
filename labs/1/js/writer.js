class Writer extends Notebook {
    constructor() {
        super();
        this.addBtn = document.getElementById("add-btn");
        this.writerBtn = document.getElementById("writer-btn");
    }

    displayTimestamp() {
        this.timeDiv.innerText = TEXT.timeUpdated + localStorage.getItem("timestamp");
    }

    display() {
        if (this.empty === false) {
            this.displayTimestamp();
            for (let i = 0; i < this.notes.length; i++) {
                renderNote(i);
            }
        }
        this.addBtn.innerText = TEXT.addBtn;
    }

    renderNote(id) {
        const row = document.createElement("div");
        row.classList.add("row");

        const textbox = document.createElement("textarea");
        textbox.classList.add("form-control");
        textbox.innerText = this.notes[id].txt;
        textbox.addEventListener(eventEdit, () => this.editNote(id, textbox));

        const removeBtn = document.createElement("button");
        removeBtn.classList.add("btn", "btn-warning");
        removeBtn.addEventListener(eventRemove, () => this.removeNote(id));

        row.appendChild(textbox);
        row.appendChild(removeBtn);
        this.notesDiv.appendChild(row);
    }

    updateNoteStorage() {
        localStorage.setItem("notes", JSON.stringify(this.notes));
        super.update();
    }

    addNote() {
        if(this.empty) {
            this.notes = [];
        }
        this.notes.push(new Note(""));
        this.updateNoteStorage();
        super.update();
        renderNote(id);
        this.displayTimestamp();
    }

    editNote(id, textbox) {
        this.notes[id].txt = textbox.value;
        this.updateNoteStorage();
    }

    resetDisplay() {
        this.notesDiv.innerHTML = ``;
        this.display();
    }

    removeNote(id) {
        this.notes = this.notes.splice(id, 1);
        this.updateNoteStorage();
        this.resetDisplay();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const writer = new Writer();
    const nav = new Nav();
    const backPath = "index.html";
    nav.displayBackBtn(backPath);
    writer.display();
});
