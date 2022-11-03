
import fs from 'fs'
const path = require("path");

export default function handler(req, res) {
    try {
        const { imageId } = req.query
        const imageBuffer = fs.readFileSync(path.resolve(__dirname, '../uploads/', imageId))
        res.setHeader('Content-Type', 'image/jpeg')
        res.send(imageBuffer)
    } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(String("Invalid Image ID"));
    }
}
