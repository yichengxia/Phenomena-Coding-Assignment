/**
 * @file main javascipt
 * @author Yicheng Xia
 */

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width;
var ch = canvas.height;

/**
 * Increment step to draw
 * @const
 * @type {number}
 */
var step = 0.01;

/**
 * Increment points per millisecond to draw
 * @const
 * @type {number}
 */
var pointsPerMillisecond = 500;

/**
 * Main function to draw y = mx + b
 * @param {number} m slope
 * @param {number} b intercept
 */
function draw(m, b) {
    canvas.onclick = function() { // register for onclick event
        clearAll();
        setColor("grey", "blue");
        drawFunc(m, b);

        // drawing scale 1:10
        ctx.font = "15px serif";
        markPoint(0, b * 10);
        markPoint(-(b * 10) / m, 0);
        ctx.font = "italic 15px serif";

        // process special coefficient 1, -1, or 0
        if (m == 0 && b == 0) {
            ctx.fillText("y = 0", cw * 3 / 4, ch - 20);
        } else if (b == 0) {
            if (m == 1) {
                ctx.fillText("y = x", cw * 3 / 4, ch - 20);
            } else if (m == -1) {
                ctx.fillText("y = -x", cw * 3 / 4, ch - 20);
            } else {
                ctx.fillText("y = " + m + "x", cw * 3 / 4, ch - 20);
            }
        } else if (m == 1) {
            if (b < 0) {
                ctx.fillText("y = x " + b, cw * 3 / 4, ch - 20);
            } else {
                ctx.fillText("y = x + " + b, cw * 3 / 4, ch - 20);
            }
        } else if (m == 0) {
            ctx.fillText("y = " + b, cw * 3 / 4, ch - 20);
        } else if (m == -1) {
            if (b < 0) {
                ctx.fillText("y = -x " + b, cw * 3 / 4, ch - 20);
            } else {
                ctx.fillText("y = -x + " + b, cw * 3 / 4, ch - 20);
            }
        } else {
            if (b < 0) {
                ctx.fillText("y = " + m + "x " + b, cw * 3 / 4, ch - 20);
            } else {
                ctx.fillText("y = " + m + "x + " + b, cw * 3 / 4, ch - 20);
            }
        }
    }
    canvas.click();
}

/**
 * Set both strokeStyle and fillStyle for canvas context
 * @param {string} stroke name of strokeStyle
 * @param {string} fill name of fillStyle
 */
function setColor(stroke, fill) {
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
}

/**
 * Convert point coordinate and draw it on canvas
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 */
function drawPoint(x, y) {
    var cx = x + cw / 2;
    var cy = ch / 2 - y;
    ctx.fillRect(cx, cy, 1, 1);
}

/**
 * Convert point coordinate and mark it on canvas
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 */
function markPoint(x, y) {
    var cx = x + cw / 2;
    var cy = ch / 2 - y;
    ctx.fillRect(cx - 3, cy - 3, 6, 6);
    // round to at most 2 digits
    ctx.fillText("(" + Math.round(x * 10) / 100 + ", " + Math.round(y * 10) / 100 + ")", cx + 5, cy + 5);
}

/**
 * Draw grid, axis, arrows, and scales on canvas
 */
function drawAxis() {
    // draw grid
    ctx.strokeStyle = "grey";
    var space = 10;
    ctx.setLineDash([1, 2]);
    for (y = space; y < ch; y += space) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cw, y);
        ctx.stroke();
    }
    for (x = space; x < cw; x += space) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);
        ctx.stroke();
    }
    ctx.setLineDash([]);

    // draw x, y axis
    ctx.strokeStyle = "black";
    drawLine(-cw / 2, 0, cw / 2, 0);
    drawLine(0, -cw / 2, 0, cw / 2);

    // draw arrows
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(cw / 2, 0);
    ctx.lineTo(cw / 2 - 5, 20);
    ctx.lineTo(cw / 2 + 5, 20);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cw, ch / 2);
    ctx.lineTo(cw - 20, ch / 2 - 5);
    ctx.lineTo(cw - 20, ch / 2 + 5);
    ctx.closePath();
    ctx.fill();

    // draw scales
    ctx.font = '15px serif';
    for (i = 100; i < cw; i += 100) {
        if (i == cw / 2) { // skip original point O
            continue;
        }
        ctx.fillText((i - cw / 2) / 10, i - 8, ch / 2 + 15);
        ctx.beginPath();
        ctx.moveTo(i, ch / 2);
        ctx.lineTo(i, ch / 2 - 4);
        ctx.stroke();
    }
    for (i = 100; i < ch; i += 100) {
        if (i == ch / 2) {
            continue;
        }
        ctx.fillText((ch / 2 - i) / 10, cw / 2 - 22, i + 5);
        ctx.beginPath();
        ctx.moveTo(cw / 2, i);
        ctx.lineTo(cw / 2 + 4, i);
        ctx.stroke();
    }

    // mark x, y, O
    ctx.font = 'italic 20px serif';
    ctx.fillText("x", cw - 15, ch / 2 + 20);
    ctx.fillText("y", cw / 2 + 10, 15);
    ctx.fillText("O", cw / 2 - 20, ch / 2 + 20);
}

/**
 * Draw line from (x1, y1) to (x2, y2) on canvas (with coordinates converted)
 * @param {number} x1 x1-coordinate
 * @param {number} y1 y1-coordinate
 * @param {number} x2 x2-coordinate
 * @param {number} y2 y2-coordinate
 */
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    var cx1 = x1 + cw / 2;
    var cx2 = x2 + cw / 2;
    var cy1 = ch / 2 - y1;
    var cy2 = ch / 2 - y2;
    ctx.moveTo(cx1, cy1);
    ctx.lineTo(cx2, cy2);
    ctx.stroke();
    ctx.closePath();
}

/**
 * Show the process of drawing y = mx + b on canvas
 * @param {number} m slope
 * @param {number} b intercept
 */
function drawFunc(m, b) {
    var currentx = -cw / 2;
    setInterval(function() {
        for (i = 0; i < pointsPerMillisecond; i++) {
            drawPoint(currentx, m * currentx + b * 10);
            currentx += step;
        }
    }, 1);
}

/**
 * Clear drawn function and reset coordinate axis
 */
function clearAll() {
    ctx.clearRect(0, 0, cw, ch);
    drawAxis();
}
