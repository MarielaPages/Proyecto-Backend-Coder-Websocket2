const socket = io();

const button = document.getElementById('button')
button.addEventListener("click", () => {
    socket.emit("newProduct")
})

let tableContainer = document.getElementById('tableContainer')

socket.on('productosEnviados', productos =>{
    if(productos.length>0){
        tableBody = document.getElementById("tbody")
        productos.forEach(product => {
            const tr = document.createElement("tr")
            tr.innerHTML = `<td> ${product.title} </td>
                            <td> ${product.price} </td>
                            <td>
                                <img src="${product.thumbnail}" alt="${producto.title}" class="imgProd"> <!--El src lo va a ir a buscar a public porque alli declare que estan mis archivos estaticos-->
                            </td>`
            tableBody.appendChild(tr)
        });                    
    }
    else{
        tableContainer.setAttribute("style", "display:none;")
        divProducts.innerHTML = `<p>There are no products</p>`
    }
})

const button2 = document.getElementById('button2')
const email = document.getElementById('email')
const message = document.getElementById('message')

button2.addEventListener("click", () => {
    const d = new Date();
    const day = d.getDay()
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    const hour = d.getHours()
    const minutes = d.getMinutes()
    const second = d.getMilliseconds()
    const date = `${day}/${month}/${year} ${hour}:${minutes}:${second}`
    const personMessage = {email: email.value, fecha: date , message: message.value}
    socket.emit("newMessage", personMessage)
    button2.value = ''
    email.value=''
    message.value=''
})

const messagesContainer = document.getElementById("messagesContainer")

socket.on('mensajesEnviados', mensajes =>{
    messagesContainer.classList.add("mensajesContainerStyles")
    if(mensajes.length>0){
        const div = document.createElement('div')
        mensajes.forEach(mensaje => {
            div.innerHTML = `<p><span class="mail">${mensaje.email} </span>
                            <span class="fecha">[${mensaje.fecha}]: </span>
                            <span class="msj">${mensaje.message}</span></p>`
        messagesContainer.appendChild(div)
        });
    }
    else{
        messagesContainer.innerHTML = ''
        messagesContainer.classList.remove("mensajesContainerStyles")
    }
})

