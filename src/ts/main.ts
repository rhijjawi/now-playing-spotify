import '../css/main.css'
import io, { Socket } from 'socket.io-client'

type ListeningData = {
  device: string
  trackName: string
  trackUrl: string
  trackProgress: number
  trackDuration: number
  albumName: string
  artistName: string
  artistUrl: string
  albumImageUrl: string
  albumUrl: string
  playing: boolean
}

let $ = (selector: string) => document.querySelector(selector)

function changeIfChanged(el: Element, content: string) {
  if (el.innerHTML !== content) {
    el.innerHTML = content
  }
}

function changeImageIfChanged(el: HTMLImageElement, url: string) {
  if (el.src !== url) {
    el.src = url
  }
}

function addClass(el: Element, className: string) {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

function removeClass(el: Element, className: string) {
  if (el.classList.contains(className)) {
    el.classList.remove(className)
  }
}

// @ts-ignore
let sock: Socket

if (process.env.NODE_ENV !== 'production') {
  sock = io('http://localhost:3000', {
    path: '/io',
  })
} else {
  sock = io('https://npbe.cnnd.dev', {
    path: '/io',
  })
}

sock.on('update', (data: string) => {
  let ld: ListeningData = JSON.parse(data)
  let playingStatement = `Playing on <span class="bold">${ld['device']}</span>`
  changeImageIfChanged($('#album-art') as HTMLImageElement, ld.albumImageUrl)
  changeIfChanged($('#title'), `<a href="${ld.trackUrl}">${ld.trackName}</a>`)
  changeIfChanged(
    $('#album'),
    `<span class="muted">on</span> <a href="${ld.albumUrl}">${ld.albumName}</a>`,
  )
  changeIfChanged(
    $('#artist'),
    `<span class="muted">by</span> <a href="${ld.artistUrl}">${ld.artistName}</a>`,
  )
  if (ld.playing) {
    changeIfChanged($('#status'), playingStatement)
    addClass($('#album-art'), 'spin')
    removeClass($('#album-art'), 'pause-spin')
  }
  if (!ld.playing) {
    changeIfChanged($('#status'), 'Paused')
    addClass($('#album-art'), 'pause-spin')
  }
})
