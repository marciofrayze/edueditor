
// Overrides console to show on the onscren-console but keeping reference to original console.log function.
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
    printExecutionHeaderOnConsole();
    let codeToEval = editor.getValue();

    let selectedLanguage = getSelectedLanguage();
    
    try {
        result = null;
        switch(selectedLanguage) {
            case "javascript":
                result = executeJavaScriptCode(codeToEval);
                break;
            case "python":
                result = executePythonCode(codeToEval);
                break;                
            case "ruby":
                result = executeRubyCode(codeToEval);
                break;                
            default:
                console.log("\nERROR:\n Language not supported: " + selectedLanguage);
        }

        if (result != null) {
            console.log(result);
        }    

        console.log("Execution finished successfully.");

    } catch (e) {
        console.log("\nERROR:\n" + e.message + "\n");
    }
}

function executeRubyCode(codeToEval) {

    // Testing if Opan is loaded. If not, just shows a warning message and do not try to run the code.
    if (Opal == null || Opan.compile == null) {
        console.log("The Ruby library (Opan) is not loaded yet. Please try again in a few seconds.")
        return;
    }

    let transpiledCodeFromRubyToJS = Opal.compile(codeToEval)

    let result = eval(transpiledCodeFromRubyToJS);

    // TODO: For some reason it is adding a blank link (or in some cases object) in the end of the result.

    return result;
}

function executePythonCode(codeToEval) {

    // Testing if Brython is loaded. If not, just shows a warning message and do not try to run the code.
    if (brython == null || brython.$eval == null) {
        console.log("The Python library (Brython) is not loaded yet. Please try again in a few seconds.")
        return;
    }

    let result = brython.$eval(codeToEval);

    // TODO: For some reason it is adding a blank link (or in some cases object) in the end of the result.

    return result;
}

function printExecutionHeaderOnConsole() {
    let time = new Date().toLocaleTimeString('en-US', { hour12: false, 
                                                        hour: "numeric", 
                                                        minute: "numeric", second: "numeric"});

    console.log("Starting execution (" + time + ")...");
}

function executeJavaScriptCode(codeToEval) {
    let result = eval(codeToEval);

    return result;
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

function languageSelectChanged(el) {
    
    let selectedLanguage = el.value;

    switch(selectedLanguage) {
        case "javascript":
            editor.getSession().setMode("ace/mode/javascript");
            disableAceEditorMissingSemiColonWarningMessage();
            break;
        case "ruby":
            editor.getSession().setMode("ace/mode/ruby");
            break;
        case "python":
            editor.getSession().setMode("ace/mode/python");
            break;            
        default:
            console.log("\nERROR:\n Language not supported: " + selectedLanguage);           
    }    
}

function getSelectedLanguage() {
    return document.getElementById("selectLanguage").value;
}

function disableAceEditorMissingSemiColonWarningMessage() {
    editor.session.$worker.call("changeOptions", [{asi: true}]);
}

window.onload = function() { 
    disableAceEditorMissingSemiColonWarningMessage();

    // By default, do not auto-close parenthesis, brackets, etc.
    editor.setBehavioursEnabled(false);
}

// Adding keyboard shortcut for "Run" button.
document.onkeydown = function(e) {

    // For IEs window event-object.
    var e = e || window.event; 

    // The "R" key is the 82 code, so let's Run the code when the user presses CTR + R.
    if (e.altKey && e.which == 82) { 
        executeCode();
     }

}