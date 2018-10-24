function submit(redirection) {
    var textarea = document.getElementById("textarea");
    var result = convertToJsonParam(textarea.value);
    debugger
    console.log(result)
    var encodedResult = encodeURI(JSON.stringify(result))
    window.location.replace(`${redirection}?text=${btoa(encodedResult)}`);
}

function convertToJsonParam(text) {
    var data = text.replace('\t', '').replace('.', '\n').split('\n');
    return { data };
}