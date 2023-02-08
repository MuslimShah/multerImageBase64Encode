const express = require('express')
const multer = require('multer');
const path = require('path')
const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({});
app.set('view engine', 'ejs');
app.get('/upload', (req, res) => {
    res.render('index')
})
app.post('/upload', upload.single('image'), (req, res) => {

    const encoded = req.file.buffer.toString('base64');
    console.log(encoded);

    res.send('file uploaded here')
})

app.listen(PORT, () => console.log(`connected port:${PORT}`))