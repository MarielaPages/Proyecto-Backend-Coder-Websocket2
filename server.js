const express = require("express");
const app = express();
//const multer = require('multer')
const {Server : ioServer} = require('socket.io')
const http = require('http')
const Contenedor = require("./contenedor")
const Mensajes = require('./mensajes')


const archivoNuevo = new Contenedor();
const mensajesLlegados = new Mensajes('mensajes.txt')

//Creo los servidores
const httpServer = http.createServer(app)
const io = new ioServer(httpServer) 

//Seteo donde se guardaran los files y con que nombres
//const storage = multer.diskStorage({
//  destination: function(req, file, cb){
//    cb(null, __dirname+"/public/files")
//  },
//  filename: function(req, file, cb){
//    cb(null, file.originalname)
//  }
//})

//middlewares
//app.use(multer({storage}).single("thumbnail"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public"));

//Rutas
app.get("/", (req, resp) => {
  const productos = archivoNuevo.getAll();
  resp.render('pages/index', {productos: productos}) // lo busca en views
})

// app.post('/', (request, response) => {
//   const producto = request.body; // esto es el objeto que llega con los datos. Lo uso para pasarselo al save
//   const imagen = request.file;
//   producto.thumbnail = '/files/'+imagen.filename; // agrego esta propiedad al objeto
//   const productoAgregado = archivoNuevo.save(producto);
// })


//Le digo donde van a estar mis templates y prendo el motor
app.set('views', './views') // este no es necesario??
app.set('view engine', 'ejs')


let messages = []
let productos = []

async function devolverMensajes(){
  messages = await mensajesLlegados.getAll()
  io.sockets.emit('mensajesEnviados', messages)
}
//Levanto el servidor io
io.on('connection', socket => {
  console.log("cliente conectado")
  
  io.sockets.emit('productosEnviados', productos)
  socket.on('newProduct', (product) =>{
    archivoNuevo.save(product);
    productos = archivoNuevo.getAll()
    io.sockets.emit('productosEnviados', productos);
  })

  devolverMensajes()
  socket.on('newMessage', async data =>{
    await mensajesLlegados.save(data)
    messages = await mensajesLlegados.getAll()
    io.sockets.emit('mensajesEnviados', messages)
  })
});

//empiezo el server
const PORT = 8080;
const server = httpServer.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});

server.on('error', error => console.log(`Error en el servidor ${error}`))