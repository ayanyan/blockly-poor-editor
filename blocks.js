// Blockly.Msg.LOGIC_HUE = '210';
// Blockly.Msg.LOOPS_HUE = '120';
// Blockly.Msg.MATH_HUE = '230';
// Blockly.Msg.TEXTS_HUE = '160';
// Blockly.Msg.LISTS_HUE = '260';
// Blockly.Msg.COLOUR_HUE = '20';
// Blockly.Msg.VARIABLES_HUE = '330';
// Blockly.Msg.VARIABLES_DYNAMIC_HUE = '310';
// Blockly.Msg.PROCEDURES_HUE = '290';
var myTextsColour = Blockly.Msg.TEXTS_HUE || Blockly.Constants.Text.HUE || 160;
var myNumColour = Blockly.Msg.MATH_HUE || Blockly.Constants.Math.HUE || 230;
var myListColour = Blockly.Msg.LISTS_HUE || Blockly.Constants.Lists.HUE || 260;

Blockly.defineBlocksWithJsonArray([
  {
    "type": "text_2_number",
    "message0": "get number from text %1",
    "args0": [
      {"type": "input_value", "name": "VALUE", "check": "String"},
    ],
    "output": "Number",
    "colour": myTextsColour,
    "tooltip": "Return the number denoted by the text."
  },
  {
    "type": "number_2_text",
    "message0": "create text from number %1",
    "args0": [
      {"type": "input_value", "name": "VALUE", "check": "Number"},
    ],
    "output": "String",
    "colour": myTextsColour,
    "tooltip": "Create a text whose content is the number."
  },
]);

Blockly.JavaScript["text_2_number"] =
  function (block) {
    var arg =
        Blockly.JavaScript.valueToCode(
          block, "VALUE", Blockly.JavaScript.ORDER_NONE
        ) || '""';
    return ['Number(' + arg + ')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

Blockly.JavaScript["number_2_text"] =
  function (block) {
    var arg =
        Blockly.JavaScript.valueToCode(
          block, "VALUE", Blockly.JavaScript.ORDER_NONE
        ) || '0';
    return ['String(' + arg + ')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

Blockly.defineBlocksWithJsonArray([
  {
    "type": "table_row",
    "message0": "height of %1",
    "args0": [
      {"type": "input_value", "name": "TABLE", "check": "Array"},
    ],
    "output": "Number",
    "colour": myListColour,
    "tooltip": "Return the number of rows in the table."
  },
  {
    "type": "table_col",
    "message0": "width of %1",
    "args0": [
      {"type": "input_value", "name": "TABLE", "check": "Array"},
    ],
    "output": "Number",
    "colour": myListColour,
    "tooltip": "Return the number of culumns in the table."
  },
  {
    "type": "table_cell",
    "message0": "in table %1 get cell at row %2 col %3",
    "args0": [
      {"type": "input_value", "name": "TABLE", "check": "Array"},
      {"type": "input_value", "name": "ROW", "check": "Number"},
      {"type": "input_value", "name": "COL", "check": "Number"},
    ],
    "output": null,
    "inputsInline": true,
    "colour": myListColour,
    "tooltip": "Return the content of the specified cell."
  },
  {
    "type": "table_setValue",
    "message0": "in table %1 change cell to %4 at row %2 col %3",
    "args0": [
      {"type": "input_value", "name": "TABLE", "check": "Array"},
      {"type": "input_value", "name": "ROW", "check": "Number"},
      {"type": "input_value", "name": "COL", "check": "Number"},
      {"type": "input_value", "name": "VALUE"},
    ],
    "nextStatement": null,
    "previousStatement": null,
    "inputsInline": true,
    "colour": myListColour,
    "tooltip": "Change the content of the specified cell."
  },
  {
    "type": "table_create",
    "message0": "create table as height %1 width %2",
    "args0": [
      {"type": "input_value", "name": "ROW", "check": "Number"},
      {"type": "input_value", "name": "COL", "check": "Number"},
    ],
    "output": "Array",
    "inputsInline": true,
    "colour": myListColour,
    "tooltip": "Create an empty table that has the specified number of cells."
  },
]);

Blockly.JavaScript["table_row"] =
  function (block) {
    var table =
        Blockly.JavaScript.valueToCode(
          block, "TABLE", Blockly.JavaScript.ORDER_MEMBER
        );
    if (! table) { return ['0', Blockly.JavaScript.ORDER_ATOMIC]; }
    return [table + '.length', Blockly.JavaScript.ORDER_MEMBER];
  };

Blockly.JavaScript["table_col"] =
  function (block) {
    var table =
        Blockly.JavaScript.valueToCode(
          block, "TABLE", Blockly.JavaScript.ORDER_MEMBER
        );
    if (! table) { return ['0', Blockly.JavaScript.ORDER_ATOMIC]; }
    return [table + '[0].length', Blockly.JavaScript.ORDER_MEMBER];
  };

Blockly.JavaScript["table_cell"] =
  function (block) {
    var table =
        Blockly.JavaScript.valueToCode(
          block, "TABLE", Blockly.JavaScript.ORDER_MEMBER
        );
    var row =
        Blockly.JavaScript.valueToCode(
          block, "ROW", Blockly.JavaScript.ORDER_ADDITION
        ) || '1';
    var col =
        Blockly.JavaScript.valueToCode(
          block, "COL", Blockly.JavaScript.ORDER_ADDITION
        ) || '1';
    if (! table) { return ['0', Blockly.JavaScript.ORDER_ATOMIC]; }
    return [table + '[' + row + ' - 1][' + col + ' - 1]', Blockly.JavaScript.ORDER_MEMBER];
  };

Blockly.JavaScript["table_setValue"] =
  function (block) {
    var table =
        Blockly.JavaScript.valueToCode(
          block, "TABLE", Blockly.JavaScript.ORDER_MEMBER
        );
    var row =
        Blockly.JavaScript.valueToCode(
          block, "ROW", Blockly.JavaScript.ORDER_ADDITION
        ) || '1';
    var col =
        Blockly.JavaScript.valueToCode(
          block, "COL", Blockly.JavaScript.ORDER_ADDITION
        ) || '1';
    var value =
        Blockly.JavaScript.valueToCode(
          block, "VALUE", Blockly.JavaScript.ORDER_ASSIGNMENT - 1
        );
    if (! table) { return ''; }
    var cell = table + '[' + row + ' - 1][' + col + ' - 1]';
    return cell + ' = ' + value + ';' + "\n";
  };

Blockly.JavaScript["table_create"] =
  function (block) {
    var row =
        Blockly.JavaScript.valueToCode(
          block, "ROW", Blockly.JavaScript.ORDER_NONE
        ) || '2';
    var col =
        Blockly.JavaScript.valueToCode(
          block, "COL", Blockly.JavaScript.ORDER_NONE
        ) || '2';
    return ['Array(' + row + ').fill(0).map((x)=> Array(' + col + ').fill(0))', Blockly.JavaScript.ORDER_MEMBER];
  };
