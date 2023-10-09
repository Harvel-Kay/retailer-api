const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

fs.appendFile("public/thumbnails/test.jpg", "" ,"utf8",()=>{})

const tnail = sharp('./public/test.jpg').resize(320)
    .toFile('./public/thumbnails/test.jpg')
    .then(data => console.log("Resize operation successful"))
    .catch(err => console.log("Error resizing Image",err))

// console.log("Resized thumbnail")
// console.log("Resized executed")