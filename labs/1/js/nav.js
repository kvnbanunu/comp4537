const writerPath = "writer.html";
const readerPath = "reader.html";

class Nav {
    constructor() {
        this.backBtn = document.getElementById("back-btn");
        this.writerBtn = document.getElementById("writer-btn");
        this.readerBtn = document.getElementById("reader-btn");
    }

    displayBackBtn(path) {
        this.backBtn.setAttribute("href", path);
        this.backBtn.innerText = TEXT.backBtn;
    }

    displayWriterBtn() {
        this.writerBtn.setAttribute("href", writerPath);
        this.writerBtn.innerText = TEXT.writerBtn;
    }

    displayReaderBtn() {
        this.readerBtn.setAttribute("href", readerPath);
        this.readerBtn.innerText = TEXT.readerBtn;
    }
}
