// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import formidable from "formidable";
import fs from 'fs';
import path from "path";
import mime from 'mime-types'
import { Broadcast } from "../socket";
export const config = {
    api: {
        bodyParser: false,
    },
};
export default function handler(req, res) {
    const form = formidable({});
    let newFiles = []
    form.parse(req, (err, fields, files) => {
        if (err) {
            // example to check for a very specific error
            if (err.code === formidableErrors.maxFieldsExceeded) {

            }
            res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
            res.end(String(err));
            return;
        }
        if (!fs.existsSync(__dirname + '/uploads')) {
            fs.mkdirSync(__dirname + '/uploads', { recursive: true });
        }
        fs.readdir(__dirname + '/uploads', (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(__dirname + '/uploads', file), (err) => {
                    if (err) throw err;
                });
            }
        });
        for (let [key, value] of Object.entries(files)) {
            newFiles.push(value.newFilename + '.' + mime.extension(value.mimetype))
            fs.rename(value.filepath, __dirname + '/uploads/' + value.newFilename + '.' + mime.extension(value.mimetype), function (err) {
                if (err) throw err
                console.log('Successfully moved')
            })
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 'message': 'OK', 'images': newFiles }, null, 2));
    });

    return;
}
