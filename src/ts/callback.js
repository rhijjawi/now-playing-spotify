function callback_handler() {
    let session = document.location.search
    if (session.split('=')[1] !== undefined){
        document.cookie = `spotify=${session.split('=')[1]}`
    }
}