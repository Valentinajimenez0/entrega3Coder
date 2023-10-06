let carrito = [];
let producto = [];

producto.push(new Producto("kalimera", 1500))
producto.push(new Producto("Calinista", 1300))
producto.push(new Producto("Yasas", 6500))
producto.push(new Producto("Ticanis", 2500))
producto.push(new Producto("Kala", 1900))

localStorage.setItem("productos", JSON.stringify(producto));

const productosdrop = document.getElementById("todosLosProductos")
const btnAgregar = document.getElementById("agregarProducto")
const span = document.getElementById("span")
const botonComprar = document.querySelector("#boton-comprar")
 botonComprar.addEventListener("click", comprar )
let contador = 0;

 function traerProductosLS (){
     producto = JSON.parse(localStorage.getItem("productos")) || [];
      carrito =JSON.parse(localStorage.getItem(`carrito`)) || [];
      contador = carrito.reduce((total, item) => total + item.cantidad, 0);
      span.textContent = contador;
    }

 function elejirProducto () {
    producto.forEach (({nombre, precio}, index)=>{
    const option = document.createElement("option")
    option.textContent = `${nombre } ` +  `$ ${precio}`;  
    option.value = index
    productosdrop.appendChild(option)
    } )
 }

document.addEventListener(`DOMContentLoaded`, () =>{
    traerProductosLS();
    elejirProducto()
    hacerTabla()
    // carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    // carrito = carrito.map((item) => new Item(item.producto, item.cantidad));

    // // Calcular el contador
    // contador = carrito.reduce((total, item) => total + item.cantidad, 0);
    // span.textContent = contador;

    // hacerTabla();

    btnAgregar.addEventListener(`click`, () =>{
        const productoSelec = producto[+productosdrop.value]
        const agregoALCarrito = carrito.find((item) => item.producto.nombre === productoSelec.nombre);
        if(agregoALCarrito ){
            agregoALCarrito.cantidad++;
        }else{
            const item = new Item (productoSelec, 1)
            carrito.push(item)
        }

        // localStorage.setItem("carrito", JSON.stringify([...carrito]));
 
       ///localStorage.setItem("carrito", JSON.stringify(carrito))
        ///
        contador ++
        span.textContent = contador

        localStorage.setItem("carrito", JSON.stringify(carrito));

        hacerTabla()
    })
    
} )

 function hacerTabla (){
const bodyTabla = document.getElementById("body-tabla")
const total = document.getElementById("total")
bodyTabla.innerHTML = ``;
carrito.forEach((item) => {
    const {producto: {nombre:nombre2,precio}, cantidad} = item; 
   bodyTabla.innerHTML = bodyTabla.innerHTML + `
        <tr>
        <td>${nombre2} </td>
        <td>${precio} </td>
        <td>${cantidad} </td>
        <td>${cantidad * precio} </td>
        <td>
        <button id="bt-sacar" type="button" class="boton-eliminar btn btn-secondary btn-sm">eliminar</button>    </tr>
        </td>
        `;

        const botonEliminar = document.querySelectorAll(`.boton-eliminar`);
        botonEliminar.forEach((Boton,index) =>{
            Boton.addEventListener("click", () => {
                alert("Se eliminara toda la cantidad que selecciono de este producto")
                eliminarProducto(index);
            });
        });
    });
   total.textContent = carrito.reduce((acc, item) => acc + item.producto.precio*item.cantidad,0)
   localStorage.setItem("carrito", JSON.stringify(carrito))|| [];
 }
 
  function eliminarProducto (index){
    const cantidadEliminada = carrito[index].cantidad; 
    carrito.splice(index,1);
        localStorage.setItem("carrito",JSON.stringify(carrito)) || [];
        contador -= cantidadEliminada
        contador = contador < 0 ? 0 : contador;
         span.textContent = contador
         hacerTabla()
    };

 function comprar(){
     if (carrito.length === 0){
        alert("Tu carrito esta vacio! Agrega productos ant4es de comprar")
     }else{
        // const carritoClonado = [...carrito];
        // localStorage.setItem("carrito", JSON.stringify(carritoClonado));
        carrito = []

     const bodyTabla = document.getElementById("body-tabla")
     bodyTabla.innerHTML = " ";
     const total = document.getElementById("total")
     total.textContent = 0;
     contador = contador < 0 ? 0 : contador;
     contador = 0;
     span.textContent = contador
     localStorage.removeItem("carrito")|| [];
     alert("TU COMPRA FUE REALIZADA CON EXITO!")  ;
    }
 }


