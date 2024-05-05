import express from 'express'
import jimp from 'jimp'


const app = express()
const PORT = process.env.PORT | 3000
const __dirname = import.meta.dirname

// MIDDLEWARE
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// handlers
const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (err) {
      return false
    }
}

const convertImage = (url) =>{
  jimp.read(url)
    .then( image => {
    return image
      .resize(256, 256) 
      .quality(60) 
      .greyscale() 
      .write(__dirname+'/public/src/img/image.png'); 
  })
  .catch((err) => {
    console.error(err);
  });

} 

const homeHandler = (req,res) => {
    res.sendFile(__dirname+'/public')
}

const imagenHandler = (req,res) => {
    const {url} = req.body
    if(!url) res.status(400).send('se requiere enlace')
    if(!isValidUrl(url)) res.status(400).send(`"${url}" no es una URL valida`)
    convertImage(url)
    res.redirect('/filter-image')
}

const filterImageHandler = (req,res)=>{
    res.sendFile(__dirname+'/public/image.html')
}

const downloadImage = (req,res)=>{
    res.download(__dirname+'/public/src/img/image.png')
}


// ROUTES

app.get('/', homeHandler)
app.get('/filter-image', filterImageHandler)
app.get('/dl-image', downloadImage)
app.post('/imagen',imagenHandler)


app.listen(PORT, console.log(` listen on PORT ${PORT}`))    