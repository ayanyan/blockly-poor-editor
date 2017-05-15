
Blockly.defineBlocksWithJsonArray([
  {
    "type": 'text_2_number',
    "message0": 'get number from text %1',
    "args0": [
      {
        "type": 'input_value',
        "name": 'VALUE',
        "check": 'String'
      }
    ],
    "output": 'Number',
    "colour": Blockly.Blocks.texts.HUE,
    "tooltip": 'Return the number meant by the text.'
  },
  {
    "type": 'number_2_text',
    "message0": 'create text from number %1',
    "args0": [
      {
        "type": 'input_value',
        "name": 'VALUE',
        "check": 'Number'
      }
    ],
    "output": 'String',
    "colour": Blockly.Blocks.texts.HUE,
    "tooltip": 'Create a text whose content is the number.'
  }
]);

Blockly.JavaScript['text_2_number'] =
  function (block) {
    var argument0 =
      Blockly.JavaScript.valueToCode(
        block, 'VALUE', Blockly.JavaScript.ORDER_NONE
      ) || '\'\'';
    return ['Number(' + argument0 + ')', Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

Blockly.JavaScript['number_2_text'] =
  function (block) {
    var argument0 =
      Blockly.JavaScript.valueToCode(
        block, 'VALUE', Blockly.JavaScript.ORDER_NONE
      ) || '\'\'';
    return ['(' + argument0 + ').toString()', Blockly.JavaScript.ORDER_MEMBER];
  };
