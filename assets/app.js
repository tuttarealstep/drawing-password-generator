function getRandomColor() {
    let r = 255 * Math.random() | 0,
        g = 255 * Math.random() | 0,
        b = 255 * Math.random() | 0;

    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

let canvas = document.getElementById('canvasBoard');
let context = canvas.getContext('2d');
let pool = [];
let poolSize = 10;//255
let maxSize = Number.MAX_SAFE_INTEGER;
let charList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";//abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
let symbolList = "!()-.?_$&+";
let symbolsEnabled = false;
let phrase = "";
let stopDrawing = false;

document.getElementById('resetButton').addEventListener('click', (e) => {
    resetPoolPhraseCanvas();
    e.stopPropagation();
});

document.getElementById('symbolCheckBox').addEventListener('change', (event) => {
    if (event.target.checked) {
        symbolsEnabled = true;
    } else {
        symbolsEnabled = false;
    }

    resetPoolPhraseCanvas();
});

document.getElementById('phraseLength').addEventListener('change', (event) => {
    resetPoolPhraseCanvas();

    if (event.target.value == "") {
        poolSize = 10;
        event.target.value = poolSize;
        return;
    }

    poolSize = Number.parseInt(event.target.value)

    if (poolSize == null || poolSize == 0 || poolSize <= 0) {
        poolSize = 10;
        event.target.value = poolSize;
        return;
    }

    if (poolSize > maxSize) {
        poolSize = maxSize
    }
});

function resetPoolPhraseCanvas() {
    pool = [];
    phrase = "";
    context.clearRect(0, 0, canvas.width, canvas.height);
    stopDrawing = false
}

function generatePhrase() {
    if (pool.length > poolSize - 1) {
        pool.shift()
    }

    let gn = (event.clientX + event.clientY) + (event.clientX * event.clientY) + Math.floor(new Date());
    pool.push(gn);

    phrase = "";

    let charListComplete = charList;

    if (symbolsEnabled) {
        charListComplete += symbolList;
    }

    pool.forEach((e) => {
        phrase += charListComplete[(e % charListComplete.length)]
    });

    document.getElementById("phraseContainer").innerText = phrase
}

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

document.addEventListener("click", (event) => {
    stopDrawing = !stopDrawing;
});

document.addEventListener("mousemove", (event) => {

    if (stopDrawing)
        return;

    context.fillStyle = getRandomColor();

    context.fillRect(event.clientX, event.clientY - 1, 1, 1);
    context.fillRect(event.clientX, event.clientY + 1, 1, 1);
    context.fillRect(event.clientX - 1, event.clientY, 1, 1);
    context.fillRect(event.clientX + 1, event.clientY, 1, 1);
    context.fillRect(event.clientX - 1, event.clientY - 1, 1, 1);
    context.fillRect(event.clientX + 1, event.clientY - 1, 1, 1);
    context.fillRect(event.clientX - 1, event.clientY + 1, 1, 1);
    context.fillRect(event.clientX + 1, event.clientY + 1, 1, 1);
    context.fillRect(event.clientX - 2, event.clientY, 1, 1);
    context.fillRect(event.clientX + 2, event.clientY, 1, 1);
    context.fillRect(event.clientX, event.clientY, 1, 1);

    generatePhrase();
});

new ClipboardJS('#copyButton', {
    text: function () {
        return phrase;
    }
});

canvas.addEventListener("touchstart", function (e) {
    let touch = e.touches[0];
    let mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);

canvas.addEventListener("touchend", function (e) {
    let mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
}, false);

canvas.addEventListener("touchmove", function (e) {
    let touch = e.touches[0];
    let mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);