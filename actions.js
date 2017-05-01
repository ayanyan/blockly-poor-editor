var useFileSaver = true;

Blockly.JavaScript.addReservedWords('code');
Blockly.JavaScript.addReservedWords('highlightBlock');

function generateCodes(workspace) {
    var jsElement = document.getElementById('jsCode');
    var xmlElement = document.getElementById('xmlArea');
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Maybe infinite loop!";\n';
    jsElement.value = Blockly.JavaScript.workspaceToCode(workspace);
    xmlElement.value = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return jsElement.value;
}

function runCode(workspace) {
    var code = document.getElementById('jsCode').value;
    try {
        window.LoopTrap = 10000;
        var answer = null;
        eval(code);
        if (answer != null) {
            window.alert('Finally, answer is ' + answer);
        }
    } catch (e) {
        alert(e);
    }
}

function downloadCode(id, type) {
    var text = document.getElementById(id).value;
    var blob = new Blob([text], {type: contentType(type)});
    var url = URL.createObjectURL(blob);
    if (useFileSaver) {
        saveAs(blob, filename(type));
    } else {
        var link = document.getElementById('saveLink');
        link.href = url;
        link.download = filename(type);
        link.target = '_blank';
        link.click();
    }
    URL.revokeObjectURL(url);
}

function saveBlocks(workspace) {
    generateCodes(workspace);
    downloadCode('xmlArea', 'xml');
}

function clearBlocks(workspace) {
    workspace.clear();
    Blockly.Xml.domToWorkspace(document.getElementById('initBlocks'), workspace);
}

function loadBlocks(workspace) {
    var fileElement = document.getElementById('file');
    var reader = new FileReader();
    reader.addEventListener('load', function() {
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(reader.result), workspace);
    });
    reader.readAsText(fileElement.files[0], 'UTF-8');
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

// interpreter

var highlightBlock = function (id) {};
var highlightPause = false;

function initApi(interpreter, scope) {
    // Add an API function for the alert() block.
    var wrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(alert(text));
    };
    interpreter.setProperty(scope, 'alert',
                            interpreter.createNativeFunction(wrapper));
    // Add an API function for the prompt() block.
    var wrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(prompt(text));
    };
    interpreter.setProperty(scope, 'prompt',
                            interpreter.createNativeFunction(wrapper));
    // Add an API function for highlighting blocks.
    var wrapper = function(id) {
        id = id ? id.toString() : '';
        return interpreter.createPrimitive(highlightBlock(id));
    };
    interpreter.setProperty(scope, 'highlightBlock',
                            interpreter.createNativeFunction(wrapper));
}

function parseCode(workspace) {
    highlightBlock = function (id) {
        highlightPause = true;
        workspace.highlightBlock(id);
    }
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    Blockly.JavaScript.STATEMENT_PREFIX = null;
    var myInterpreter = new Interpreter(code, initApi);
    alert('Ready to execute the code:\n\n' + code);
    highlightPause = false;
    workspace.highlightBlock(null);
    return myInterpreter;
}

function stepCode(myInterpreter, workspace) {
    var ok = false;
    try {
        ok = myInterpreter.step();
    } finally {
        if (!ok) {
            window.alert('No more executable block.');
            workspace.highlightBlock(null);
            return;
        }
    }
    if (highlightPause) {
        highlightPause = false;
    } else {
        stepCode(myInterpreter, workspace);
    }
}

function autoSave(workspace) {
    var xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    localStorage.setItem('blocks', xml);
}

function autoLoad(workspace) {
    var xml = localStorage.getItem('blocks');
    if (xml) {
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
    } else {
        Blockly.Xml.domToWorkspace(document.getElementById('initBlocks'), workspace);
    }
}

function putCookie(key, value, days) {
    if (! days) { days = 1; }
    var expires = (days * 24 * 60 * 60).toString();
    var path = '/';
    document.cookie =
        encodeURIComponent(key) + "=" + encodeURIComponent(value) + "; " +
        'max-age=' + expires + '; ' +
        'path=' + path + ';';
}

function getCookie(key) {
    var name = encodeURIComponent(key) + "=";
    var value = '';
    var allPieces = document.cookie.split(';');
    for (var i = 0; i < allPieces.length; i++) {
        var piece = allPieces[i];
        while (piece.charAt(0) == ' ') {
            piece = piece.substring(1);
        }
        if (piece.indexOf(name) == 0) {
            value = piece.substring(name.length, piece.length);
        }
    }
    while (value.charAt(0) == ' ') {
        value = value.substring(1);
    }
    return decodeURIComponent(value);
}

function sleep(t) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > t) { break; }
    }
}

function filename(type) {
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
