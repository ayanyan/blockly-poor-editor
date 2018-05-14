// settings

var useFileSaver = (typeof(FileSaver.saveAs) != 'undefined');
var useSweetAlert = (typeof(swal) != 'undefined');

Blockly.JavaScript.addReservedWords('code');
Blockly.JavaScript.addReservedWords('highlightBlock');

// general functions

function safeString(x) {
  return ((x == null) ? '' : x.toString());
}

function sleep(t) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > t) { break; }
  }
}

function smartAlert(m, type) {
  if (useSweetAlert) {
    if (type) {
      swal(m, null, type);
    } else {
      return swal(m);
    }
  } else {
    window.alert(m);
    return (function(f) {});
  }
}

function alertAndCopy(answer, prefix, suffix) {
  var message = safeString(prefix) + safeString(answer) + safeString(suffix);
  if (useSweetAlert) {
    swal({
      title: message,
      text: 'Copy it to clipboard?',
      icon: 'success',
      buttons: {
        cancel: 'Cancel',
        confirm: 'OK'
      }
    }).then(function(isConfirmed) {
      if (isConfirmed) {
        intoClipboard(answer);
      }
    });
  } else {
    var isConfirmed = window.confirm(messsage);
    if (isConfirmed) {
      intoClipboard(answer);
    }
  }
}

function intoClipboard(s) {
  var sandbox = document.getElementById('invisibleArea');
  if (sandbox) {
    try {
      sandbox.textContent = safeString(s);
      sandbox.style.display = 'inline';
      sandbox.select();
      document.execCommand('copy');
      sandbox.blur();
      sandbox.style.display = 'none';
      return s;
    } catch(e) {
      return false;
    }
  } else {
    return false;
  }
}

function hideAllPane() {
  document.getElementById('blocklyPane').style.display = 'none';
  document.getElementById('jsPane').style.display = 'none';
  document.getElementById('xmlPane').style.display = 'none';
}

function showPane(id) {
  hideAllPane();
  document.getElementById(id).style.display = 'table-row';
}

// showcase including workspaces

class Showcase {

  constructor(workspace, js, xml, blocks, name) {
    this.workspace = workspace;
    this.jsElement = document.getElementById(js);
    this.xmlElement = document.getElementById(xml);
    this.initBlocks = document.getElementById(blocks);
    this.name = name || 'blocklyblocks';
  }

  generateCodes() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
      'if (--window.LoopTrap == 0) throw "Maybe infinite loop!";\n';
    this.jsElement.value = Blockly.JavaScript.workspaceToCode(this.workspace);
    this.xmlElement.value = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(this.workspace));
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return this.jsElement.value;
  }

  runCode() {
    var code = this.jsElement.value;
    try {
      window.LoopTrap = 1000000;
      var answer = null;
      answer = eval(code + '; answer;');
      if (answer != null) {
        alertAndCopy(answer, 'Finally, answer is ');
      }
    } catch(e) {
      window.alert(e);
    }
  }

  regenerateBlocks(dom) {
    var blocks = dom || Blockly.Xml.textToDom(this.xmlElement.value);
    if (blocks) {
      this.workspace.clear();
      Blockly.Xml.domToWorkspace(blocks, this.workspace);
    }
  }

  initializeWorkspace() {
    this.regenerateBlocks(this.initBlocks);
  }

  clearBlocks() {
    var showcase = this;
    if (useSweetAlert) {
      swal({
        title: 'Workspace will be reset',
        text: 'Really clear all blocks?',
        icon: 'warning',
        dangerMode: true,
        buttons: {
          cancel: 'Cancel',
          confirm: 'Clear',
        }
      }).then(function(isConfirmed) {
        if (isConfirmed) {
          showcase.initializeWorkspace();
        }
      });
    } else {
      var isConfirmed = window.confirm('Really clear all blocks?');
      if (isConfirmed) {
        this.initializeWorkspace();
      }
    }
  }

  saveBlocks() {
    this.generateCodes();
    downloadCode(this.xmlElement.id, 'xml');
  }

  loadBlocks(id) {
    var workspace = this.workspace;
    var fileElement = document.getElementById(id);
    var reader = new FileReader();
    reader.addEventListener('load', function() {
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(reader.result), workspace);
    });
    reader.readAsText(fileElement.files[0], 'UTF-8');
  }

  autoSave() {
    var xml = this.xmlElement.value;
    try {
      if (typeof(Storage) != 'undefined') {
        localStorage.setItem(this.name, xml);
      } else {
        this.putCookie(this.name, xml, 180);
      }
    } finally {}
  }

  autoLoad() {
    var xml = null;
    try {
      if (typeof(Storage) != 'undefined') {
        xml = localStorage.getItem(this.name);
      } else {
        xml = getCookie(this.name);
      }
    } finally {
      if (xml) {
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.workspace);
        this.generateCodes();
      } else {
        this.initializeWorkspace();
      }
    }
  }

  putCookie(key, value, days) {
    if (! days) { days = 1; }
    var expires = (days * 24 * 60 * 60).toString();
    var path = '/';
    document.cookie =
      encodeURIComponent(key) + '=' + encodeURIComponent(value) + '; ' +
      'max-age=' + expires + '; ' +
      'path=' + path + ';';
  }

  getCookie(key) {
    var name = encodeURIComponent(key) + '=';
    var value = '';
    var allPieces = document.cookie.split(';');
    for (var i = 0; i < allPieces.length; i++) {
      var piece = allPieces[i];
      while (piece.charAt(0) === ' ') {
        piece = piece.substring(1);
      }
      if (piece.indexOf(name) === 0) {
        value = piece.substring(name.length, piece.length);
      }
    }
    while (value.charAt(0) === ' ') {
      value = value.substring(1);
    }
    return decodeURIComponent(value);
  }

} // class ends

// downloader

function downloadCode(id, type) {
  var text = document.getElementById(id).value;
  var blob = new Blob([text], {type: contentType(type)});
  var url = URL.createObjectURL(blob);
  if (useFileSaver) {
    FileSaver.saveAs(blob, guessFilename(type));
  } else {
    try {
      var link = document.getElementById('saveLink');
      link.href = url;
      link.download = guessFilename(type);
      link.target = '_blank';
      link.click();
    } catch(e) {
      window.alert('Cannot download');
    }
  }
  URL.revokeObjectURL(url);
}

function guessFilename(type) {
  var prefix = '';
  var ext = '.txt';
  switch (type) {
  case 'text':
    prefix = ''; ext = '.xml';
    break;
  case 'xml':
    prefix = 'Blockly-'; ext = '.xml';
    break;
  case 'js':
    prefix = 'JS-'; ext = '.js';
    break;
  case 'py':
    prefix = 'Python-'; ext = '.py';
    break;
  }
  var date = new Date();
  return prefix +
    date.getFullYear().toString() +
    ('0' + (date.getMonth() + 1).toString()).slice(-2) +
    ('0' + date.getDate().toString()).slice(-2) +
    ('0' + date.getHours().toString()).slice(-2) +
    ('0' + date.getMinutes().toString()).slice(-2) +
    ext;
}

function contentType(type) {
  var ctype = 'text/plain';
  switch (type) {
  case 'text':
    ctype = 'text/plain';
  case 'xml':
    ctype = 'text/xml';
    break;
  case 'js':
    ctype = 'application/javascript';
    break;
  case 'py':
    ctype = 'application/python';
    break;
  }
  return ctype;
}

// interpreter

var highlightBlock = function (id) {};
var highlightPause = false;

class MyInterpreter {

  static initApi(interpreter, scope) {
    // Add an API function for the alert() block.
    var wrapper = function(text) {
      text = safeString(text);
      return interpreter.createPrimitive(alert(text));
    };
    interpreter.setProperty(scope, 'alert',
                            interpreter.createNativeFunction(wrapper));
    // Add an API function for the prompt() block.
    var wrapper = function(text) {
      text = safeString(text);
      return interpreter.createPrimitive(prompt(text));
    };
    interpreter.setProperty(scope, 'prompt',
                            interpreter.createNativeFunction(wrapper));
    // Add an API function for highlighting blocks.
    var wrapper = function(id) {
      id = safeString(id);
      return interpreter.createPrimitive(highlightBlock(id));
    };
    interpreter.setProperty(scope, 'highlightBlock',
                            interpreter.createNativeFunction(wrapper));
  }

  constructor(workspace) {
    this.workspace = workspace;
    this.interpreter = null;
  }

  parseCode() {
    highlightBlock = function (id) {
      highlightPause = true;
      workspace.highlightBlock(id);
    }
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    Blockly.JavaScript.STATEMENT_PREFIX = null;
    this.interpreter = new Interpreter(code, MyInterpreter.initApi);
    window.alert('Ready to execute the code');
    highlightPause = false;
    workspace.highlightBlock(null);
  }

  // You need to execute parseCode() in advance.
  stepCode() {
    var ok = false;
    try {
      ok = this.interpreter.step();
    } finally {
      if (!ok) {
        window.alert('No more executable block');
        this.workspace.highlightBlock(null);
        return;
      }
    }
    if (highlightPause) {
      highlightPause = false;
    } else {
      this.stepCode();
    }
  }

} // class ends
