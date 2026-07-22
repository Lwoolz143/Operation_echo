const messages = [
"Initializing Field Terminal...",
"Calibrating Temporal Sensors...",
"Environmental Memory Detected...",
"The Echo is responding..."
];

let i = 0;

setInterval(() => {

document.getElementById("status").textContent = messages[i];

i++;

if (i >= messages.length) {
i = 0;
}

}, 2200);

