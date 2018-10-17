function submit() {
    var textarea = document.getElementById("textarea");
    var result = convertToJsonParam(textarea.value);
    var encodedResult = encodeURI(JSON.stringify(result))
    window.location.replace(`animated.html?text=${btoa(encodedResult)}`);
}

function convertToJsonParam(text) {
    var lyrics = text.replace('\t', '').replace('.', '\n').split('\n');
    return { lyrics };
}