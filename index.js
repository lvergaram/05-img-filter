import express from 'express'
import jimp from 'jimp'
import { v4 as uuidv4 } from 'uuid';


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

const convertImage = async(url,id) =>{
  
  await jimp.read(url)
    .then( image => {
    return image
      .resize(350,  jimp.AUTO) 
      .quality(60) 
      .greyscale() 
      .write(__dirname+`/public/src/img/${id}.jpg`); 
  })
  .catch((err) => {
    console.error(err);
  });

} 

const homeHandler = (req,res) => {
    res.sendFile(__dirname+'/public')
}

const imagenHandler = async (req,res) => {
    const {url} = req.body
    const id = uuidv4()
    if(!url) res.status(400).send('se requiere enlace')
    if(!isValidUrl(url)) res.status(400).send(`"${url}" no es una URL valida`)
    await convertImage(url,id)
    return await res.redirect(`/filter-image/${id}`)
}

const filterImageHandler = async(req,res)=>{
    const {id} = req.params
    await res.sendFile(__dirname+'/public/src/img/'+id+'.jpg')
}

const downloadImage = (req,res)=>{
    res.download(__dirname+'/public/src/img/image.png')
}


// ROUTES

app.get('/', homeHandler)
app.get('/filter-image/:id', filterImageHandler)
app.get('/dl-image', downloadImage)
app.post('/imagen',imagenHandler)


app.listen(PORT, console.log(` listen on PORT ${PORT}`))    