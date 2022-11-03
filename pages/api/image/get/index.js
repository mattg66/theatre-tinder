// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
export default function handler(req, res) {
    try {
        var fs = require('fs');
        var files = fs.readdirSync(__dirname + '/uploads');
        res.end(JSON.stringify({ 'message': 'OK', 'images': files }, null, 2));
    } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(String("Invalid Image ID"));
    }
}
