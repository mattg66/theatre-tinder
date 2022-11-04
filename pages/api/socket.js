import { Server } from 'socket.io'
import fs from 'fs'

let swipeCount = 1

function SocketHandler(req, res) {
    let state = NumberOfPhotos();

    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io

        io.on('connection', socket => {
            socket.on('GET-STATUS', msg => {
                socket.emit('STATUS', state)
            })
            socket.on('GET-SWIPE-COUNT', () => {
                socket.emit('SWIPE-COUNT', swipeCount)
            })
            socket.on('IMAGES-UPDATED', msg => {
                let state = NumberOfPhotos();
                swipeCount = 1;
                socket.broadcast.emit('IMAGES-UPDATED', msg)
            })
            socket.on('SWIPE', dir => {
                console.log(dir)
                swipeCount++
                socket.broadcast.emit('SWIPE', {dir, swipeCount})
            })
            socket.on('input-change', msg => {
                socket.broadcast.emit('update-input', msg)
            })
        })
    }
    res.end()
}
function NumberOfPhotos() {
    fs.readdir(__dirname + '/image/uploads', (err, files) => {
        if (files === undefined) {
            return 0;
        } else {
            return files.length
        }
    });
}
export default SocketHandler
