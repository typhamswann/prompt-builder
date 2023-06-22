$(document).ready(function() {
    let promptCounter = 1;
    let variableCounter = 1;

    let responses = []; // Array to store responses

    $("#add-prompt").click(function(){
        promptCounter++;
        let newPrompt = '<div class="prompt"><textarea id="prompt-input-'+promptCounter+'" class="prompt-input" placeholder="Enter your prompt"></textarea></div>';
        let newResponse = '<div class="response"><textarea id="response-output-'+promptCounter+'" class="response-output" readonly></textarea></div>';
        $("#prompts").append(newPrompt);
        $("#responses").append(newResponse);
    });

    $("#remove-prompt").click(function(){
        if (promptCounter > 1) {
            $('#prompt-input-'+promptCounter).parent().remove();
            $('#response-output-'+promptCounter).parent().remove();
            promptCounter--;
        }
    });

    $("#add-variable").click(function(){
        variableCounter++;
        let newVariable = '<div class="variable"><div><label for="variable-name-'+variableCounter+'">Variable</label><input type="text" id="variable-name-'+variableCounter+'" class="variable-name"></div><div><label for="variable-value-'+variableCounter+'">Value</label><input type="text" id="variable-value-'+variableCounter+'" class="variable-value"></div></div>';
        $("#variable").append(newVariable);
    });    

    $("#remove-variable").click(function(){
        if (variableCounter > 1) {
            $('#variable-name-'+variableCounter).parent().remove();
            $('#variable-value-'+variableCounter).parent().remove();
            variableCounter--;
        }
    });

    $("#generate").click(async function(){ // make the function asynchronous
        let content;
        for (let i = 1; i <= promptCounter; i++) {
            content = $("#prompt-input-"+i).val();
            for (let j = 1; j <= variableCounter; j++) {
                let variableName = $("#variable-name-"+j).val();
                let variableValue = $("#variable-value-"+j).val();
                let regex = new RegExp("\\$" + variableName + "\\$", "g");
                content = content.replace(regex, variableValue);
            }
    
            // replace $output# with response from the corresponding prompt
            content = content.replace(/\$output(\d+)\$/g, function(match, number) {
                return responses[number] || match;
            });
    
            // convert AJAX call to a Promise and await it
            await new Promise(resolve => {
                $.ajax({
                    url: '/generate',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ content: content }),
                    dataType: 'json',
                    success: function(data) {
                        responses[i] = data.response;  // Store response
                        $("#response-output-"+i).val(data.response);
                        resolve(); // Resolve promise after AJAX call is complete
                    }
                });
            });
        }
    });    

    $("#export").click(function() {
        console.log('h')
        let exportContent = "";
        for (let i = 1; i <= promptCounter; i++) {
            let prompt = $("#prompt-input-"+i).val();
            exportContent += "prompt" + i + ": " + prompt + "\n\n";
        }
        exportContent += "Final Output: " + responses[promptCounter];
        
        // Copy to clipboard
        navigator.clipboard.writeText(exportContent).then(function() {
            console.log('Export content copied to clipboard');
        })
        .catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    });

});

