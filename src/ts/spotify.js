document.addEventListener("DOMContentLoaded", function(event) { //Submit on Enter
    let text = document.getElementById('session')
    text.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    let session_token = text.value
    document.cookie = `spotify=${session_token}`
    console.log('Logged in as:')
    console.log(session_token)
    text.hidden = true
}})
});

async function prep() {
    if(document.cookie.split(document.cookie.split('spotify=')[1] == undefined)) {
        window.open('https://npbe.ramzihijjawi.me/login', '_self')
        
    }
    else{}
    }
document.getElementById('prep_btn').addEventListener('click',prep());

async function pause(uri) {
    if (spotify == true) {
        if (stillPaused == false) {
        let data = {'session': `${document.cookie.split('spotify=')[1]}`, 'uris':uri}
        await axios.put('https://npbe.ramzihijjawi.me/pause', data, config)
        stillPaused = true;
    }}}
      