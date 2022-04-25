document.addEventListener("DOMContentLoaded", function(event) { //Submit on Enter
    let text = document.getElementById('session')
    text.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    let session_token = text.value
    document.cookie = `spotify=${session_token}`
    console.log(session_token)
    text.hidden = true
}})
});

document.getElementById('prep_btn').addEventListener('click', async function prep() {
    let text = document.getElementById('session')
    text.hidden = false
    if(document.cookie.split('spotify=')[1] !== undefined) {
      let w = await axios.get(`https://npbe.ramzihijjawi.me/?id=${document.cookie.split('spotify=')[1]}`)
      if(getDataJSON.hasOwnProperty('status')){
          if (getDataJSON.status == 'not_playing') {
              changeIfChanged($('#title'), `<a>Not Playing</a>`)
              window.open('https://npbe.ramzihijjawi.me/login', '_blank')}
      text.value = document.cookie.split('spotify=')[1]
      text.hidden = true
}}});

async function pause(uri) {
    if (spotify == true) {
        if (stillPaused == false) {
        let data = {"session": `${session_token}`, "uri":uri}
        await axios.put('https://npbe.ramzihijjawi.me/pause', data, config)
        stillPaused = true;
    }}}
      