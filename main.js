// Decorate console.log function to also print it in in the on-screen console.
let _console = console.log
console.log = function(somethingToLog) {
    let resultTextArea = document.getElementById("executionresult")
    resultTextArea.value = resultTextArea.value + somethingToLog + "\n"
    _console(somethingToLog)
}

function clearConsole() {
    let resultTextArea = document.getElementById("executionresult")
    resultTextArea.value = ""
}

function printExecutionHeaderOnConsole() {
    console.log("Starting execution (" + currentFormattedTime() + ")...")
}

function currentFormattedTime() {
    return new Date().toLocaleTimeString(
        'en-US', {
            hour12: false,
            hour: "numeric",
            minute: "numeric",
            second: "numeric"}
    )
}

function disableAutoClose() {
    editor.setBehavioursEnabled(false)
}

function logWarningEditorLibraryNotLoaded() {
    console.log("\nERROR:\nThe Editor library is not loaded yet. Please try again in a few seconds.")
}

function isRubyLibraryLoaded() {
    return typeof Opal !== 'undefined'
}

function isEditorLoaded() {
    return (typeof editor !== 'undefined')
}

function isPythonLibraryLoaded() {
    return typeof brython !== 'undefined'
}

function autoCompleteChanged(el) {
    if (isEditorLoaded() === false) {
        logWarningEditorLibraryNotLoaded()
        el.checked = false
        return
    }

    editor.setOptions({
        enableBasicAutocompletion: el.checked
    })
}

function autoPairingChanged(el) {
    if (isEditorLoaded() === false) {
        logWarningEditorLibraryNotLoaded()
        el.checked = false
        return
    }

    editor.setBehavioursEnabled(el.checked)
}

function languageSelectChanged(el) {
    if (isEditorLoaded() === false) {
        logWarningEditorLibraryNotLoaded()
        el.options.selectedIndex = 0
        return
    }

    let selectedLanguage = el.value

    switch(selectedLanguage) {
        case "javascript":
            editor.getSession().setMode("ace/mode/javascript")
            disableAceEditorMissingSemiColonWarningMessage()
            break
        case "ruby":
            editor.getSession().setMode("ace/mode/ruby")
            break
        case "python":
            editor.getSession().setMode("ace/mode/python")
            break
        default:
            console.log("\nERROR:\nLanguage not supported: " + selectedLanguage)
    }
}

function themeSelectChanged(el) {
    if (isEditorLoaded() === false) {
        logWarningEditorLibraryNotLoaded()
        el.options.selectedIndex = 0
        return
    }

    let selectedTheme = el.value

    switch(selectedTheme) {
        case "bright":
            editor.setTheme("ace/theme/tomorrow")
            break
        case "dark":
            editor.setTheme("ace/theme/twilight")
            break
        default:
            console.log("\nERROR:\nTheme not supported: " + selectedTheme)
    }
}

function getSelectedLanguage() {
    return document.getElementById("selectLanguage").value
}

function disableAceEditorMissingSemiColonWarningMessage() {
    editor.session.$worker.call("changeOptions", [{asi: true}])
}

function executeCode() {
    clearConsole()
    printExecutionHeaderOnConsole()

    if (isEditorLoaded() === false) {
        logWarningEditorLibraryNotLoaded()
        return
    }

    let codeToEval = editor.getValue()
    let selectedLanguage = getSelectedLanguage()
    
    try {
        let result
        switch(selectedLanguage) {
            case "javascript":
                result = executeJavaScriptCode(codeToEval)
                break
            case "python":
                result = executePythonCode(codeToEval)
                break
            case "ruby":
                result = executeRubyCode(codeToEval)
                break
            default:
                console.log("\nERROR:\nLanguage not supported: " + selectedLanguage)
        }

        if (result != null) {
            console.log(result)
        }
        console.log("Execution finished successfully.")

    } catch(exception) {
        console.log("\nERROR:\n" + exception.message + "\n")
    }
}

function executeRubyCode(codeToEval) {
    if (isRubyLibraryLoaded() === false) {
        console.log("\nERROR:\nThe Ruby library is not loaded yet. Please try again in a few seconds.")
        return
    }

    let transpiledCodeFromRubyToJS = Opal.compile(codeToEval)

    return eval(transpiledCodeFromRubyToJS)
}

function executePythonCode(codeToEval) {
    if (isPythonLibraryLoaded() === false) {
        console.log("\nERROR:\nThe Python library is not loaded yet. Please try again in a few seconds.")
        return
    }

    return brython.$eval(codeToEval)
}

function executeJavaScriptCode(codeToEval) {
    return eval(codeToEval)
}

window.onload = function() {
    disableAceEditorMissingSemiColonWarningMessage()
    disableAutoClose()
}

// Adding keyboard shortcut for "Run" button.
document.onkeydown = function(event) {
    // For IEs window event-object.
    event = event || window.event

    if (pressedAltR(event)) {
        executeCode()
     }
}

function pressedAltR(event) {
    return event.altKey && event.key === 'r'
}