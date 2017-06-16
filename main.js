
/* Override console to show on the onscren-console and keeping reference to original console.log function */
let _console = console.log;
console.log = function(somethingToLog){
    let resultTextArea = document.getElementById("executionresult");
    resultTextArea.value = resultTextArea.value + somethingToLog + "\n";
    _console(somethingToLog);
}

function clearConsole() {
    let resultTextArea = document.getElementById("executionresult");
    resultTextArea.value = "";
}

function executeCode() {

    clearConsole();
    let codeToEval = editor.getValue();

    try {

        console.log("Starting execution...");

        let result = eval(codeToEval);

        if (result != null) {
            console.log(result);
        }

        console.log("Execution finished successfully.");

    } catch (e) {
        console.log("\nERROR:\n" + e.message + "\n");
    }

}

function loadSample() {
    alert("Load sample option is not implemented yet :(")
}

function helpMe() {
    alert("Help me option is not implemented yet :(")
}

function autoCompleteChanged(el) {
  if (el.checked) {
    editor.setOptions({
        enableBasicAutocompletion: true
    });    
  } else {
    editor.setOptions({
        enableBasicAutocompletion: false
    });    
  }
}