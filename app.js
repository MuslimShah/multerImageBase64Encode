const express = require('express');
const multer = require('multer');
const path = require('path');
var crypto = require("crypto");
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({});
app.set('view engine', 'ejs');
app.get('/upload', (req, res) => {
    res.render('index');
})
app.get('/image/:hash', (req, res) => {
    //getting hash from user url
    const hash = req.params.hash;
    const filePath = path.join(__dirname, 'hashFiles', `${hash}`);
    //reading data from file of specified hash name
    fs.readFile(filePath, (err, content) => {
        if (!err) {
            res.json({ img: `${content}.png` })
        } else {
            res.json({ error: 'image not found' })
        }
    })
})

app.post('/upload', upload.single('image'), (req, res) => {
    //getting image from buffer
    const encoded = req.file.buffer.toString('base64');
    //converting to sha256
    const encodedSha256 = crypto.createHash('sha256').update(encoded).digest('hex')
        //path to store hased value
    const filePath = path.join(__dirname, 'hashFiles', `${encodedSha256}`);
    //storing hash in a file with the same name as hash and with no extension
    fs.writeFile(filePath, encodedSha256, (err) => {
            if (!err) {
                console.log('image converted and stored as hash');
            }
        })
        //return base64 to user
    res.json({ encoding: "base64", encodedImage: encoded });
})

app.listen(PORT, () => console.log(`connected port:${PORT}`));