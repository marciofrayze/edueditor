
/* Override console to show on the onscren-console but keeping reference to original console.log function. */
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
        let time = new Date().toLocaleTimeString('en-US', { hour12: false, 
                                                            hour: "numeric", 
                                                            minute: "numeric", second: "numeric"});

        console.log("Starting execution (" + time + ")...");

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
    alert("Help option is not implemented yet :(")
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

function autoPairingChanged(el) {
    if (el.checked) {
        editor.setBehavioursEnabled(true);
    } else {
        editor.setBehavioursEnabled(false);
    }
}

window.onload = function() { 
    /* Disables Ace editor missing semi colon warning message. */
    editor.session.$worker.call("changeOptions", [{asi: true}]);
    
    /* By default, do not auto-close parenthesis, brackets, etc */
    editor.setBehavioursEnabled(false);
}