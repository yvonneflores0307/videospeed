var tcDefaults = {
  speed: 1.0,          // default 1x
  speedStep: 0.1,      // default 0.1x
  rewindTime: 10,      // default 10s
  advanceTime: 10,     // default 10s
  resetKeyCode:  82,   // default: R
  slowerKeyCode: 83,   // default: S
  fasterKeyCode: 68,   // default: D
  rewindKeyCode: 90,   // default: Z
  advanceKeyCode: 88,  // default: X
  rememberSpeed: false // default: false
};

function recordKeyPress(e) {
  var normalizedChar = String.fromCharCode(e.keyCode).toUpperCase();
  e.target.value = normalizedChar;
  e.target.keyCode = normalizedChar.charCodeAt();

  e.preventDefault();
  e.stopPropagation();
};

function inputFilterNumbersOnly(e) {
  var char = String.fromCharCode(e.keyCode);
  if (!/[\d\.]$/.test(char) || !/^\d+(\.\d*)?$/.test(e.target.value + char)) {
    e.preventDefault();
    e.stopPropagation();
  }
};

function inputFocus(e) {
   e.target.value = "";
};

function inputBlur(e) {
   e.target.value = String.fromCharCode(e.target.keyCode).toUpperCase();
};

function updateShortcutInputText(inputId, keyCode) {
  document.getElementById(inputId).value = String.fromCharCode(keyCode).toUpperCase();
  document.getElementById(inputId).keyCode = keyCode;
}

// Saves options to chrome.storage
function save_options() {

  var speedStep     = document.getElementById('speedStep').value;
  var rewindTime    = document.getElementById('rewindTime').value;
  var advanceTime   = document.getElementById('advanceTime').value;
  var resetKeyCode  = document.getElementById('resetKeyInput').keyCode;
  var rewindKeyCode = document.getElementById('rewindKeyInput').keyCode;
  var advanceKeyCode = document.getElementById('advanceKeyInput').keyCode;
  var slowerKeyCode = document.getElementById('slowerKeyInput').keyCode;
  var fasterKeyCode = document.getElementById('fasterKeyInput').keyCode;
  var rememberSpeed = document.getElementById('rememberSpeed').checked;

  speedStep     = isNaN(speedStep) ? tcDefaults.speedStep : Number(speedStep);
  rewindTime    = isNaN(rewindTime) ? tcDefaults.rewindTime : Number(rewindTime);
  advanceTime   = isNaN(advanceTime) ? tcDefaults.advanceTime : Number(advanceTime);
  resetKeyCode  = isNaN(resetKeyCode) ? tcDefaults.resetKeyCode : resetKeyCode;
  rewindKeyCode = isNaN(rewindKeyCode) ? tcDefaults.rewindKeyCode : rewindKeyCode;
  advanceKeyCode = isNaN(advanceKeyCode) ? tcDefaults.advanceKeyCode : advanceKeyCode;
  slowerKeyCode = isNaN(slowerKeyCode) ? tcDefaults.slowerKeyCode : slowerKeyCode;
  fasterKeyCode = isNaN(fasterKeyCode) ? tcDefaults.fasterKeyCode : fasterKeyCode;

  chrome.storage.sync.set({
    speedStep:      speedStep,
    rewindTime:     rewindTime,
    advanceTime:    advanceTime,
    resetKeyCode:   resetKeyCode,
    rewindKeyCode:  rewindKeyCode,
    advanceKeyCode: advanceKeyCode,
    slowerKeyCode:  slowerKeyCode,
    fasterKeyCode:  fasterKeyCode,
    rememberSpeed:  rememberSpeed
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

// Restores options from chrome.storage
function restore_options() {
  chrome.storage.sync.get(tcDefaults, function(storage) {
    document.getElementById('speedStep').value = storage.speedStep.toFixed(2);
    document.getElementById('rewindTime').value = storage.rewindTime;
    document.getElementById('advanceTime').value = storage.advanceTime;
    updateShortcutInputText('resetKeyInput',  storage.resetKeyCode);
    updateShortcutInputText('rewindKeyInput', storage.rewindKeyCode);
    updateShortcutInputText('advanceKeyInput', storage.advanceKeyCode);
    updateShortcutInputText('slowerKeyInput', storage.slowerKeyCode);
    updateShortcutInputText('fasterKeyInput', storage.fasterKeyCode);
    document.getElementById('rememberSpeed').checked = storage.rememberSpeed;
  });
}

function restore_defaults() {
  chrome.storage.sync.set(tcDefaults, function() {
    restore_options();
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Default options restored';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

function initShortcutInput(inputId) {
  document.getElementById(inputId).addEventListener('focus', inputFocus);
  document.getElementById(inputId).addEventListener('blur', inputBlur);
  document.getElementById(inputId).addEventListener('keydown', recordKeyPress);
}

document.addEventListener('DOMContentLoaded', function () {
  restore_options();

  document.getElementById('save').addEventListener('click', save_options);
  document.getElementById('restore').addEventListener('click', restore_defaults);

  initShortcutInput('resetKeyInput');
  initShortcutInput('rewindKeyInput');
  initShortcutInput('advanceKeyInput');
  initShortcutInput('slowerKeyInput');
  initShortcutInput('fasterKeyInput');

  document.getElementById('rewindTime').addEventListener('keypress', inputFilterNumbersOnly);
  document.getElementById('advanceTime').addEventListener('keypress', inputFilterNumbersOnly);
  document.getElementById('speedStep').addEventListener('keypress', inputFilterNumbersOnly);
})
