function submit() {
    var textarea = document.getElementById("textarea");
    var result = convertToJsonParam(textarea.value);
    window.location.replace(`animated.html?text=${JSON.stringify(result)}`);
}

function convertToJsonParam(text) {
    var lyrics = text.replace('\t', '').replace('.', '\n').split('\n');
    return { lyrics };
}