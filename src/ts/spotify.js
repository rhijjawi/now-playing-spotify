let session;
function prep() {
  window.open('https://npbe.ramzihijjawi.me/login', '_blank');
  let text = document.getElementById('session')
  text.style.hidden = false
  //let ico = document.getElementsByTagName('img')[1]

  text.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    let session = text.val
    text.style.hidden = true
    
  }
});
}
const _ = setInterval(async function() {
if (session !== undefined) {
  console.log("Spotify not initialised")
}
}, 1000)
                      
