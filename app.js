const express = require('express');
const multer = require('multer');
const path = require('path');
var crypto = require("crypto");
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');

//for fast uploading optional in api
app.get('/upload', (req, res) => {
        res.render('index');
    })
    //------------------------------

app.get('/image/:hash', (req, res) => {
    //getting hash from user url
    const hash = req.params.hash;
    const filePath = path.join(__dirname, 'uploads', `${hash}.png`);
    //reading data from file of specified hash name
    res.sendFile(filePath);
})

app.post('/upload', multer({}).single("image"), function(req, res, next) {
    //encoding image to base64 
    const encoded = req.file.buffer.toString('base64');
    //converting base64 to hash256
    const encodedSha256 = crypto.createHash('sha256').update(encoded).digest('hex');

    //storing hash values
    const hashPath = path.join(__dirname, 'hashFiles', `${encodedSha256}`);
    fs.writeFile(hashPath, encodedSha256, (err) => {
            if (!err) {
                console.log(`hash stored ${encodedSha256}`);
            }
        })
        //saving file with name of hash calculated
    const imagePath = path.join(__dirname, 'uploads', `${encodedSha256}.png`);
    fs.writeFile(imagePath, req.file.buffer, (err) => {
            if (!err) {
                console.log('image saved on server');
            }
        })
        //sending success message and hash for finding image    
    res.json({ msg: 'file uploaded successfully', hash: encodedSha256 });
})



app.listen(PORT, () => console.log(`connected port:${PORT}`));