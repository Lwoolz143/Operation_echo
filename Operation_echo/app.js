"use strict";

/* =========================================================
   OPERATION ECHO
   Nature Preservation Interface
   Main Application Controller
   ========================================================= */

/* ---------- DOM REFERENCES ---------- */

const bootScreen = document.getElementById("bootScreen");
const interfaceScreen = document.getElementById("interfaceScreen");
const bootMessage = document.getElementById("bootMessage");
const bootProgress = document.getElementById("bootProgress");
const bootPercentage = document.getElementById("bootPercentage");

const fieldReportModule = document.getElementById("fieldReportModule");
const reportCaptureView = document.getElementById("reportCaptureView");
const reportPreviewView = document.getElementById("reportPreviewView");
const reportTransmissionView = document.getElementById("reportTransmissionView");
const reportWaitingView = document.getElementById("reportWaitingView");
const capturePhotoButton = document.getElementById("capturePhotoButton");
const replacePhotoButton = document.getElementById("replacePhotoButton");
const transmitReportButton = document.getElementById("transmitReportButton");
const authorizeReportButton = document.getElementById("authorizeReportButton");
const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");
const reportTimestamp = document.getElementById("reportTimestamp");
const fieldReportState = document.getElementById("fieldReportState");
const transmissionStatus = document.getElementById("transmissionStatus");
const transmissionProgress = document.getElementById("transmissionProgress");
const transmissionPercentage = document.getElementById("transmissionPercentage");

const echoSequenceModule = document.getElementById("echoSequenceModule");
const authorizationGrantedView = document.getElementById("authorizationGrantedView");
const headquartersTransmissionView = document.getElementById("headquartersTransmissionView");
const echoRenderingView = document.getElementById("echoRenderingView");
const echoPlaybackView = document.getElementById("echoPlaybackView");
const echoAnalysisView = document.getElementById("echoAnalysisView");
const locationCompleteView = document.getElementById("locationCompleteView");

const echoModuleCode = document.getElementById("echoModuleCode");
const echoModuleTitle = document.getElementById("echoModuleTitle");
const echoModuleState = document.getElementById("echoModuleState");

const headquartersAudio = document.getElementById("headquartersAudio");
const headquartersMessageText = document.getElementById("headquartersMessageText");
const audioStatusLight = document.getElementById("audioStatusLight");
const audioStatusText = document.getElementById("audioStatusText");
const playTransmissionButton = document.getElementById("playTransmissionButton");
const continueTransmissionButton = document.getElementById("continueTransmissionButton");

const renderingStatus = document.getElementById("renderingStatus");
const renderingProgress = document.getElementById("renderingProgress");
const renderingPercentage = document.getElementById("renderingPercentage");

const echoVideo = document.getElementById("echoVideo");
const videoFallback = document.getElementById("videoFallback");
const beginEchoPlaybackButton = document.getElementById("beginEchoPlaybackButton");
const completeSimulatedPlaybackButton = document.getElementById("completeSimulatedPlaybackButton");

const typedEchoLead = document.getElementById("typedEchoLead");
const completeLocationButton = document.getElementById("completeLocationButton");
const restartWalkthroughButton = document.getElementById("restartWalkthroughButton");

/* ---------- CONFIGURATION ---------- */

const bootSequence = [
  ["Establishing secure connection...", 12, 900],
  ["Authenticating issued field unit...", 27, 950],
  ["Headquarters authorization confirmed.", 43, 900],
  ["Calibrating environmental sensors...", 61, 1050],
  ["Initializing proprietary Echo Lens...", 78, 1100],
  ["Scanning for temporal resonance...", 92, 1100],
  ["Nature Preservation Interface operational.", 100, 1000]
];

const reportSequence = [
  ["Preparing encrypted field packet...", 14, 650],
  ["Compressing visual evidence...", 31, 750],
  ["Attaching Echo resonance data...", 49, 800],
  ["Establishing Headquarters uplink...", 68, 900],
  ["Transmitting field report...", 87, 1000],
  ["Transmission received.", 100, 700]
];

const renderSequence = [
  ["Reacquiring stabilized resonance...", 16, 650],
  ["Reconstructing environmental memory...", 34, 750],
  ["Aligning temporal image layers...", 55, 800],
  ["Restoring archived visual data...", 76, 850],
  ["Finalizing Echo reconstruction...", 93, 750],
  ["Echo rendering complete.", 100, 650]
];

const headquartersMessages = [
  ["Agents, your field report has been verified.", 1800],
  ["The Echo has stabilized.", 1550],
  ["Rendering may now begin.", 1650],
  ["Remain where you are. Do not interrupt the reconstruction.", 2300]
];

const echoLeadText =
  "The recovered memory has revealed a new resonance trail. The Echo Lens has detected where the next Echo is strongest. Follow the Echo Lead into nature.";

/* ---------- STATE ---------- */

let bootIndex = 0;
let reportIndex = 0;
let renderIndex = 0;
let detectionInProgress = false;
let selectedPhotoUrl = null;
let hqFinished = false;
let hqFallbackStarted = false;
let videoFallbackStarted = false;
let audioFallbackTimer = null;
let videoFallbackTimer = null;
let clueTimer = null;

/* ---------- HELPERS ---------- */

const setText = (el, text) => {
  if (el) el.textContent = text;
};

const show = (el) => {
  if (el) el.classList.remove("hidden");
};

const hide = (el) => {
  if (el) el.classList.add("hidden");
};

const disable = (el, value = true) => {
  if (el) el.disabled = value;
};

const clearNamedTimer = (timer) => {
  if (timer) window.clearTimeout(timer);
};

function showReportView(target) {
  document.querySelectorAll(".report-view").forEach((view) => {
    view.classList.remove("active");
  });
  target?.classList.add("active");
  if (fieldReportModule) fieldReportModule.scrollTop = 0;
}

function showEchoView(target) {
  document.querySelectorAll(".echo-sequence-view").forEach((view) => {
    view.classList.remove("active");
  });
  target?.classList.add("active");
  if (echoSequenceModule) echoSequenceModule.scrollTop = 0;
}

function formatTimestamp(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function updatePermanentStatus(fieldStatus, lensStatus) {
  const values = document.querySelectorAll(".status-value");
  if (values[1]) values[1].textContent = fieldStatus;
  if (values[2]) values[2].textContent = lensStatus;
}


function pluralizeAgentLanguage() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  const textNodes = [];
  let node = walker.nextNode();

  while (node) {
    textNodes.push(node);
    node = walker.nextNode();
  }

  textNodes.forEach((textNode) => {
    textNode.nodeValue = textNode.nodeValue
      .replace(/\bAUTHORIZED AGENT ACCESS ONLY\b/g, "AUTHORIZED AGENTS ACCESS ONLY")
      .replace(/\bAuthorized Agent Access Only\b/g, "Authorized Agents Access Only")
      .replace(/\bAgent,\b/g, "Agents,")
      .replace(/\bagent,\b/g, "agents,");
  });
}

/* ---------- BOOT ---------- */

function runBootSequence() {
  const step = bootSequence[bootIndex];
  if (!step) {
    openInterface();
    return;
  }

  const [message, progress, duration] = step;
  setText(bootMessage, message);
  setText(bootPercentage, `${String(progress).padStart(2, "0")}%`);
  if (bootProgress) bootProgress.style.width = `${progress}%`;

  if (progress === 100) {
    document.querySelector(".logo-frame")?.classList.add("calibration-locked");
  }

  bootIndex += 1;
  window.setTimeout(
    bootIndex < bootSequence.length ? runBootSequence : openInterface,
    duration
  );
}

function openInterface() {
  bootScreen?.classList.remove("active");
  window.setTimeout(() => {
    interfaceScreen?.classList.add("active");
    createMarkerTestControls();
  }, 400);
}

/* ---------- MARKER TEST CONTROL ---------- */

function createMarkerTestControls() {
  const instructionBox = document.querySelector(".instruction-box");
  if (!instructionBox || document.getElementById("markerTestControls")) return;

  const controls = document.createElement("div");
  controls.id = "markerTestControls";
  controls.className = "marker-test-controls";
  controls.innerHTML = `
    <button id="detectMarkerButton" class="interface-button primary-button" type="button">
      SIMULATE MARKER DETECTION
    </button>
    <button id="resetInterfaceButton" class="interface-button secondary-button hidden" type="button">
      RESET FIELD TEST
    </button>
    <p class="testing-label">DEVELOPMENT TEST CONTROL</p>
  `;

  instructionBox.insertAdjacentElement("afterend", controls);
  document.getElementById("detectMarkerButton")?.addEventListener("click", beginMarkerDetection);
  document.getElementById("resetInterfaceButton")?.addEventListener("click", resetInterface);
}

/* ---------- MARKER DETECTION ---------- */

function updateEchoLens({
  lensStatus,
  moduleState,
  coreLabel,
  resonance,
  coherence,
  temporalLock,
  missionTitle,
  missionDescription
}) {
  const statusValues = document.querySelectorAll(".status-value");
  const readouts = document.querySelectorAll(".readout-value");

  if (statusValues[2]) statusValues[2].textContent = lensStatus;
  setText(document.querySelector(".lens-panel .module-state"), moduleState);
  setText(document.querySelector(".lens-core-label"), coreLabel);
  if (readouts[0]) readouts[0].textContent = resonance;
  if (readouts[1]) readouts[1].textContent = coherence;
  if (readouts[2]) readouts[2].textContent = temporalLock;
  setText(document.querySelector(".mission-heading h2"), missionTitle);
  setText(document.querySelector(".mission-description"), missionDescription);
}

function beginMarkerDetection() {
  if (detectionInProgress) return;
  detectionInProgress = true;

  const detectButton = document.getElementById("detectMarkerButton");
  const resetButton = document.getElementById("resetInterfaceButton");

  disable(detectButton, true);
  setText(detectButton, "MARKER SIGNAL RECEIVED");
  hide(resetButton);
  interfaceScreen?.classList.add("marker-detected");

  updateEchoLens({
    lensStatus: "SCANNING",
    moduleState: "ACQUIRING",
    coreLabel: "MARKER SIGNAL DETECTED",
    resonance: "0.18",
    coherence: "12%",
    temporalLock: "SEARCHING",
    missionTitle: "Echo Marker Detected",
    missionDescription: "Authorized NPD marker recognized. Beginning environmental resonance acquisition."
  });

  window.setTimeout(() => {
    updateEchoLens({
      lensStatus: "CALIBRATING",
      moduleState: "SCANNING",
      coreLabel: "ANALYZING ENVIRONMENT",
      resonance: "1.47",
      coherence: "34%",
      temporalLock: "SEARCHING",
      missionTitle: "Environmental Scan Active",
      missionDescription: "The Echo Lens is separating temporal resonance from surrounding environmental interference."
    });
    interfaceScreen?.classList.add("scan-active");
  }, 1500);

  window.setTimeout(() => {
    updateEchoLens({
      lensStatus: "RESONANCE FOUND",
      moduleState: "ALIGNING",
      coreLabel: "TEMPORAL PATTERN FOUND",
      resonance: "4.82",
      coherence: "68%",
      temporalLock: "ALIGNING",
      missionTitle: "Resonance Identified",
      missionDescription: "A naturally occurring temporal pattern has been found. The Echo Lens is attempting to stabilize the memory."
    });
  }, 3400);

  window.setTimeout(() => {
    updateEchoLens({
      lensStatus: "STABILIZING",
      moduleState: "LOCKING",
      coreLabel: "STABILIZING ECHO",
      resonance: "7.36",
      coherence: "87%",
      temporalLock: "PENDING",
      missionTitle: "Stabilization in Progress",
      missionDescription: "Maintain the device near the marker. Interrupting the field connection may destabilize the Echo."
    });
    interfaceScreen?.classList.add("stabilizing");
  }, 5300);

  window.setTimeout(completeMarkerDetection, 7400);
}

function completeMarkerDetection() {
  updateEchoLens({
    lensStatus: "ECHO READY",
    moduleState: "STABLE",
    coreLabel: "RESONANCE STABILIZED",
    resonance: "8.14",
    coherence: "100%",
    temporalLock: "LOCKED",
    missionTitle: "Echo Stabilized",
    missionDescription: "Temporal coherence confirmed. A field report is required before Headquarters can authorize Echo rendering."
  });

  interfaceScreen?.classList.remove("scan-active", "stabilizing");
  interfaceScreen?.classList.add("echo-stabilized");

  const oldButton = document.getElementById("detectMarkerButton");
  const resetButton = document.getElementById("resetInterfaceButton");

  if (oldButton) {
    const newButton = oldButton.cloneNode(true);
    oldButton.replaceWith(newButton);
    disable(newButton, false);
    setText(newButton, "BEGIN FIELD REPORT");
    newButton.addEventListener("click", openFieldReportModule, { once: true });
  }

  show(resetButton);
  detectionInProgress = false;
}

/* ---------- FIELD REPORT ---------- */

function openFieldReportModule() {
  hide(document.querySelector(".lens-panel"));
  hide(document.querySelector(".mission-panel"));
  show(fieldReportModule);
  showReportView(reportCaptureView);
  setText(fieldReportState, "REQUIRED");

  fieldReportModule?.classList.add("module-entering");
  window.setTimeout(() => fieldReportModule?.classList.remove("module-entering"), 600);
}

function openPhotoPicker() {
  photoInput?.click();
}

function handlePhotoSelection(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    window.alert("Please select an image file.");
    event.target.value = "";
    return;
  }

  if (selectedPhotoUrl) URL.revokeObjectURL(selectedPhotoUrl);
  selectedPhotoUrl = URL.createObjectURL(file);

  if (photoPreview) photoPreview.src = selectedPhotoUrl;
  setText(reportTimestamp, formatTimestamp(new Date()));
  setText(fieldReportState, "IMAGE ACQUIRED");
  showReportView(reportPreviewView);
}

function replacePhoto() {
  if (photoInput) photoInput.value = "";
  openPhotoPicker();
}

/* ---------- REPORT TRANSMISSION ---------- */

function beginReportTransmission() {
  reportIndex = 0;
  setText(fieldReportState, "TRANSMITTING");
  if (transmissionProgress) transmissionProgress.style.width = "0%";
  setText(transmissionPercentage, "00%");
  showReportView(reportTransmissionView);
  window.setTimeout(runReportTransmissionStep, 350);
}

function runReportTransmissionStep() {
  const step = reportSequence[reportIndex];
  if (!step) {
    showAuthorizationWaiting();
    return;
  }

  const [message, progress, duration] = step;
  setText(transmissionStatus, message);
  if (transmissionProgress) transmissionProgress.style.width = `${progress}%`;
  setText(transmissionPercentage, `${String(progress).padStart(2, "0")}%`);

  reportIndex += 1;
  window.setTimeout(
    reportIndex < reportSequence.length ? runReportTransmissionStep : showAuthorizationWaiting,
    duration
  );
}

function showAuthorizationWaiting() {
  setText(fieldReportState, "RECEIVED");
  showReportView(reportWaitingView);
  updatePermanentStatus("UPLINK ACTIVE", "LOCK MAINTAINED");
}

/* ---------- HEADQUARTERS AUTHORIZATION ---------- */

function beginHeadquartersAuthorization() {
  disable(authorizeReportButton, true);
  setText(authorizeReportButton, "AUTHORIZATION RECEIVED");
  fieldReportModule?.classList.add("module-exiting");

  window.setTimeout(() => {
    hide(fieldReportModule);
    fieldReportModule?.classList.remove("module-exiting");
    show(echoSequenceModule);
    showEchoView(authorizationGrantedView);

    setText(echoModuleCode, "MODULE HQ-01");
    setText(echoModuleTitle, "Headquarters Authorization");
    setText(echoModuleState, "GRANTED");
    updatePermanentStatus("HQ LINK ACTIVE", "ACCESS UNLOCKED");

    echoSequenceModule?.classList.add("module-entering");
    window.setTimeout(() => echoSequenceModule?.classList.remove("module-entering"), 600);
    window.setTimeout(openHeadquartersTransmission, 2200);
  }, 450);
}

/* ---------- HEADQUARTERS TRANSMISSION ---------- */

function openHeadquartersTransmission() {
  showEchoView(headquartersTransmissionView);
  setText(echoModuleCode, "MODULE COM-01");
  setText(echoModuleTitle, "Incoming Transmission");
  setText(echoModuleState, "READY");
  setText(headquartersMessageText, "Agents, your field report has been verified.");
  setText(audioStatusText, "Secure communications channel available.");

  if (audioStatusLight) audioStatusLight.className = "audio-status-light";
  disable(playTransmissionButton, false);
  setText(playTransmissionButton, "OPEN HEADQUARTERS TRANSMISSION");
  show(playTransmissionButton);
  hide(continueTransmissionButton);

  hqFinished = false;
  hqFallbackStarted = false;
}

async function playHeadquartersTransmission() {
  disable(playTransmissionButton, true);
  setText(playTransmissionButton, "TRANSMISSION ACTIVE");
  setText(echoModuleState, "RECEIVING");
  audioStatusLight?.classList.add("active");
  setText(audioStatusText, "Secure channel active.");

  hqFinished = false;
  hqFallbackStarted = false;
  clearNamedTimer(audioFallbackTimer);
  audioFallbackTimer = window.setTimeout(startHeadquartersTextFallback, 1800);

  if (!headquartersAudio) {
    startHeadquartersTextFallback();
    return;
  }

  const fail = () => startHeadquartersTextFallback();
  headquartersAudio.addEventListener("error", fail, { once: true });
  headquartersAudio.addEventListener("stalled", fail, { once: true });
  headquartersAudio.addEventListener("abort", fail, { once: true });
  headquartersAudio.addEventListener("ended", finishHeadquartersTransmission, { once: true });

  try {
    headquartersAudio.currentTime = 0;
    await headquartersAudio.play();
  } catch {
    startHeadquartersTextFallback();
  }
}

function startHeadquartersTextFallback() {
  if (hqFallbackStarted || hqFinished) return;
  hqFallbackStarted = true;
  clearNamedTimer(audioFallbackTimer);
  headquartersAudio?.pause();
  runHeadquartersTextSequence();
}

function runHeadquartersTextSequence() {
  let index = 0;
  setText(audioStatusText, "Text transmission active.");

  function next() {
    if (hqFinished) return;

    if (index >= headquartersMessages.length) {
      finishHeadquartersTransmission();
      return;
    }

    const [message, duration] = headquartersMessages[index];
    setText(headquartersMessageText, message);
    index += 1;
    window.setTimeout(next, duration);
  }

  next();
}

function finishHeadquartersTransmission() {
  if (hqFinished) return;
  hqFinished = true;
  clearNamedTimer(audioFallbackTimer);

  audioStatusLight?.classList.remove("active");
  audioStatusLight?.classList.add("complete");
  setText(audioStatusText, "Transmission complete.");
  setText(echoModuleState, "RECEIVED");
  hide(playTransmissionButton);
  show(continueTransmissionButton);
}

/* ---------- ECHO RENDERING ---------- */

function beginEchoRendering() {
  renderIndex = 0;
  showEchoView(echoRenderingView);
  setText(echoModuleCode, "MODULE EL-02");
  setText(echoModuleTitle, "Echo Rendering");
  setText(echoModuleState, "PROCESSING");
  if (renderingProgress) renderingProgress.style.width = "0%";
  setText(renderingPercentage, "00%");
  setText(renderingStatus, "Preparing reconstruction engine...");
  window.setTimeout(runRenderStep, 350);
}

function runRenderStep() {
  const step = renderSequence[renderIndex];
  if (!step) {
    openEchoPlayback();
    return;
  }

  const [message, progress, duration] = step;
  setText(renderingStatus, message);
  if (renderingProgress) renderingProgress.style.width = `${progress}%`;
  setText(renderingPercentage, `${String(progress).padStart(2, "0")}%`);

  renderIndex += 1;
  window.setTimeout(
    renderIndex < renderSequence.length ? runRenderStep : openEchoPlayback,
    duration
  );
}

/* ---------- ECHO PLAYBACK ---------- */

function openEchoPlayback() {
  showEchoView(echoPlaybackView);
  setText(echoModuleCode, "MODULE EP-01");
  setText(echoModuleTitle, "Echo Playback");
  setText(echoModuleState, "READY");

  videoFallbackStarted = false;
  clearNamedTimer(videoFallbackTimer);

  disable(beginEchoPlaybackButton, false);
  setText(beginEchoPlaybackButton, "BEGIN ECHO RECONSTRUCTION");
  show(beginEchoPlaybackButton);
  hide(completeSimulatedPlaybackButton);
  hide(videoFallback);
  show(echoVideo);

  if (echoVideo) {
    echoVideo.pause();

    try {
      echoVideo.currentTime = 0;
    } catch {
      /* Metadata may not be loaded yet. */
    }

    echoVideo.load();
  }
}

function hasPlayableEchoVideo() {
  if (!echoVideo) return false;

  const durationIsValid =
    Number.isFinite(echoVideo.duration) &&
    echoVideo.duration > 0;

  const sourceIsUsable =
    echoVideo.currentSrc &&
    echoVideo.networkState !== HTMLMediaElement.NETWORK_NO_SOURCE;

  return durationIsValid && sourceIsUsable;
}

async function beginEchoPlayback() {
  disable(beginEchoPlaybackButton, true);
  setText(beginEchoPlaybackButton, "CHECKING ECHO ARCHIVE");
  setText(echoModuleState, "VERIFYING");

  videoFallbackStarted = false;
  clearNamedTimer(videoFallbackTimer);

  if (!echoVideo) {
    startVideoFallback();
    return;
  }

  const fail = () => startVideoFallback();

  echoVideo.addEventListener("error", fail, { once: true });
  echoVideo.addEventListener("stalled", fail, { once: true });
  echoVideo.addEventListener("abort", fail, { once: true });
  echoVideo.addEventListener("emptied", fail, { once: true });

  echoVideo.addEventListener(
    "loadedmetadata",
    () => {
      if (!hasPlayableEchoVideo()) {
        startVideoFallback();
      }
    },
    { once: true }
  );

  echoVideo.addEventListener(
    "canplay",
    () => {
      if (!videoFallbackStarted) {
        setText(beginEchoPlaybackButton, "RECONSTRUCTION ACTIVE");
        setText(echoModuleState, "PLAYING");
      }
    },
    { once: true }
  );

  echoVideo.addEventListener(
    "ended",
    () => {
      clearNamedTimer(videoFallbackTimer);
      openEchoAnalysis();
    },
    { once: true }
  );

  /* Absolute safety fallback. This advances testing even when a browser
     leaves an empty media element in a permanent loading state. */
  videoFallbackTimer = window.setTimeout(() => {
    if (!hasPlayableEchoVideo()) {
      startVideoFallback();
    }
  }, 2500);

  try {
    echoVideo.load();

    if (echoVideo.readyState < HTMLMediaElement.HAVE_METADATA) {
      await new Promise((resolve) => {
        const finishCheck = () => resolve();

        echoVideo.addEventListener("loadedmetadata", finishCheck, { once: true });
        echoVideo.addEventListener("error", finishCheck, { once: true });
        window.setTimeout(finishCheck, 1800);
      });
    }

    if (!hasPlayableEchoVideo()) {
      startVideoFallback();
      return;
    }

    setText(beginEchoPlaybackButton, "RECONSTRUCTION ACTIVE");
    setText(echoModuleState, "PLAYING");
    await echoVideo.play();
  } catch {
    startVideoFallback();
  }
}

function startVideoFallback() {
  if (videoFallbackStarted) return;

  videoFallbackStarted = true;
  clearNamedTimer(videoFallbackTimer);

  if (echoVideo) {
    echoVideo.pause();
    echoVideo.removeAttribute("src");
  }

  hide(echoVideo);
  show(videoFallback);
  hide(beginEchoPlaybackButton);
  show(completeSimulatedPlaybackButton);
  setText(echoModuleState, "SIMULATED");
}

/* ---------- ECHO ANALYSIS ---------- */

function openEchoAnalysis() {
  clearNamedTimer(videoFallbackTimer);
  echoVideo?.pause();

  showEchoView(echoAnalysisView);
  setText(echoModuleCode, "MODULE EA-01");
  setText(echoModuleTitle, "Recovered Echo Record");
  setText(echoModuleState, "COMPLETE");
  updatePermanentStatus("FIELD UNIT ONLINE", "ECHO LOGGED");

  setText(typedEchoLead, "");
  hide(completeLocationButton);
  window.setTimeout(typeEchoLead, 650);
}

function typeEchoLead() {
  clearNamedTimer(clueTimer);
  let index = 0;

  function nextCharacter() {
    if (!typedEchoLead) return;

    typedEchoLead.textContent = echoLeadText.slice(0, index);
    index += 1;

    if (index <= echoLeadText.length) {
      clueTimer = window.setTimeout(nextCharacter, 30);
    } else {
      show(completeLocationButton);
    }
  }

  nextCharacter();
}

/* ---------- LOCATION COMPLETE ---------- */

function completeEchoLocation() {
  showEchoView(locationCompleteView);
  setText(echoModuleCode, "MODULE FL-01");
  setText(echoModuleTitle, "Field Log");
  setText(echoModuleState, "UPDATED");
}

/* ---------- RESET ---------- */

function resetInterface() {
  clearNamedTimer(audioFallbackTimer);
  clearNamedTimer(videoFallbackTimer);
  clearNamedTimer(clueTimer);

  if (selectedPhotoUrl) URL.revokeObjectURL(selectedPhotoUrl);
  headquartersAudio?.pause();
  echoVideo?.pause();
  window.location.reload();
}

/* ---------- EVENT LISTENERS ---------- */

capturePhotoButton?.addEventListener("click", openPhotoPicker);
replacePhotoButton?.addEventListener("click", replacePhoto);
transmitReportButton?.addEventListener("click", beginReportTransmission);
photoInput?.addEventListener("change", handlePhotoSelection);
authorizeReportButton?.addEventListener("click", beginHeadquartersAuthorization);
playTransmissionButton?.addEventListener("click", playHeadquartersTransmission);
continueTransmissionButton?.addEventListener("click", beginEchoRendering);
beginEchoPlaybackButton?.addEventListener("click", beginEchoPlayback);
completeSimulatedPlaybackButton?.addEventListener("click", openEchoAnalysis);
completeLocationButton?.addEventListener("click", completeEchoLocation);
restartWalkthroughButton?.addEventListener("click", resetInterface);

/* ---------- START ---------- */

pluralizeAgentLanguage();
window.setTimeout(runBootSequence, 600);

/* END OF OPERATION ECHO APP.JS */
