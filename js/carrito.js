let carrito = [];
let producto = [];

// producto.push(new Producto("kalimera", 1500))
// producto.push(new Producto("Calinista", 1300))
// producto.push(new Producto("Yasas", 6500))
// producto.push(new Producto("Ticanis", 2500))
// producto.push(new Producto("Kala", 1900))

localStorage.setItem("productos", JSON.stringify(producto));

const productosdrop = document.getElementById("todosLosProductos")
const btnAgregar = document.getElementById("agregarProducto")
const span = document.getElementById("span")
const botonComprar = document.querySelector("#boton-comprar")
botonComprar.addEventListener("click", comprar)
let contador = 0;

function traerProductosLS() {
    //producto = JSON.parse(localStorage.getItem("productos")) || [];
    carrito = JSON.parse(localStorage.getItem(`carrito`)) || [];
    contador = carrito.reduce((total, item) => total + item.cantidad, 0);
    span.textContent = contador;
}

async function traerProductos() {
    const response = await fetch(`../js/productos.json`)
    if (response.ok) {
        producto = await response.json()
        elejirProducto();

    } else {
        Toastify({
            text: `hubo un error`,
            duracion: 3000,
            gravity: `right`
        }).showtoast();
    }
}

function elejirProducto() {
    producto.forEach(({ nombre, precio, img }, index) => {
        const option = document.createElement("option")
        option.textContent = `${nombre} ` + `$ ${precio} `;
        option.value = index
        productosdrop.appendChild(option)
    })
}

document.addEventListener(`DOMContentLoaded`, () => {
    traerProductos();
    traerProductosLS();
    // elejirProducto()
    hacerTabla()

    btnAgregar.addEventListener(`click`, () => {
        const productoSelec = producto[+productosdrop.value]
        const agregoALCarrito = carrito.find((item) => item.producto.nombre === productoSelec.nombre);
        if (agregoALCarrito) {
            agregoALCarrito.cantidad++;
        } else {
            const item = new Item(productoSelec, 1)
            carrito.push(item)
        }

        contador++
        span.textContent = contador

        localStorage.setItem("carrito", JSON.stringify(carrito));

        hacerTabla()
    })

})

function hacerTabla() {
    const bodyTabla = document.getElementById("body-tabla")
    const total = document.getElementById("total")
    bodyTabla.innerHTML = ``;
    carrito.forEach((item) => {
        const { producto: { nombre: nombre2, precio }, cantidad } = item;
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

        const botonEliminar = document.querySelectorAll('.boton-eliminar');
        botonEliminar.forEach((Boton, index) => {
            Boton.addEventListener('click', () => {
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: 'Se eliminará toda la cantidad que seleccionó de este producto.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'ACEPTAR',
                    confirmButtonColor: "#98FB98",
                    cancelButtonText: 'CANCELAR',
                    cancelButtonColor: "#FFA07A",
                }).then((result) => {
                    if (result.isConfirmed) {
                        eliminarProducto(index);
                    }
                });
            });
        });
    });
    total.textContent = carrito.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0)
    localStorage.setItem("carrito", JSON.stringify(carrito)) || [];
}

function eliminarProducto(index) {
    const cantidadEliminada = carrito[index].cantidad;
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito)) || [];
    contador -= cantidadEliminada
    contador = contador < 0 ? 0 : contador;
    span.textContent = contador
    hacerTabla()
};

function comprar() {
    if (carrito.length === 0) {
        // alert("Tu carrito esta vacio! Agrega productos antes de comprar")
        Toastify({
            text: "Tu carrito esta vacio ! Agrega productos antes de comprar",
            duration: 5000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true,
            style: {
                background: "#ff0000",
            },
            onClick: function () { } // Callback after click
        }).showToast();
    } else {
        carrito = []

        const bodyTabla = document.getElementById("body-tabla")
        bodyTabla.innerHTML = " ";
        const total = document.getElementById("total")
        total.textContent = 0;
        contador = contador < 0 ? 0 : contador;
        contador = 0;
        span.textContent = contador
        localStorage.removeItem("carrito") || [];
        //alert("TU COMPRA FUE REALIZADA CON EXITO!");

        Swal.fire({
            title: 'TU COMPRA FUE REALIZADA CON EXITO!',
            text: 'Te esperamos la proxima',
            icon: 'success',
            confirmButtonText: 'Cerrar'
        })
    }
}

// const iconoCarrito = document.getElementById("iconoCarrito");
// const contenedorCarrito = document.getElementById("contenedorCarrito");
// iconoCarrito.addEventListener('click', () => {
//     carrito.forEach((item) => {
//         const resumenProductos = document.createElement("div")
//         resumenProductos.innerHTML = `
//         <p>${item.producto.nombre} </p>
//         <p>${item.cantidad} </p>

//          `
//         contenedorCarrito.append(resumenProductos);
//     });
// });



