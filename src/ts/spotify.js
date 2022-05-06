async function prep() {
    if(document.cookie.split('spotify=')[1] == undefined) {
        window.open('https://npbe.ramzihijjawi.me/login', '_self')
        
    }
    else{}
    }
document.getElementById('prep_btn').addEventListener('click',prep());

      