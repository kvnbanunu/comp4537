class Writer extends Notebook {
    constructor() {
        super();
        this.addBtn = document.getElementById("add-btn");
        this.writerBtn = document.getElementById("writer-btn");
    }

    display() {
        if (this.empty === false) {
            this.timeDiv.innerText = TEXT.timeUpdated + localStorage.getItem("timestamp");
            this.notes.forEach((note) => {
                const row = document.createElement("div");
                row.classList.add("row");
                row.setAttribute("id", "row-" + note.id);

                const textbox = document.createElement("textarea");
                textbox.classList.add("form-control");
                textbox.setAttribute("id", "input-" + note.id);

                const removeBtn = document.createElement("button");
                removeBtn.classList.add("btn", "btn-warning");
                removeBtn.setAttribute("id", "remove-" + note.id);
                
                row.appendChild(textbox);
                row.appendChild(removeBtn);
                this.notesDiv.appendChild(row);
            });
        }
        this.addBtn.innerText = TEXT.addBtn;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const writer = new Writer();
    const nav = new Nav();
    const backPath = "index.html";
    nav.displayBackBtn(backPath);
    writer.display();
});
