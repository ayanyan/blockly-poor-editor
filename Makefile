.PHONY:	install

install: blockly jsint filesaver sweetalert

blockly:
	git clone https://github.com/google/blockly.git blockly

jsint:
	git clone https://github.com/NeilFraser/JS-Interpreter.git jsint

filesaver:
	git clone https://github.com/eligrey/FileSaver.js.git filesaver

sweetalert:
	git clone https://github.com/t4t5/sweetalert.git sweetalert
