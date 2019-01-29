if(document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var submitButton = document.getElementsByName('submitBtn')[0]
    submitButton.addEventListener('click', submitClicked)
}

function submitClicked(event) {
    alert('Item Submitted.')
}
