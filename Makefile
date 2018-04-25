.PHONY:	install

install: blockly jsint

blockly:
	git clone https://github.com/google/blockly.git blockly

jsint:
	git clone https://github.com/NeilFraser/JS-Interpreter.git jsint
