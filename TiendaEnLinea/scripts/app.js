const cardsProductos = document.getElementById("cardsProductos");
const items = document.getElementById("items");
const resumen = document.getElementById("resumen");

const templateProductos = document.getElementById("template-productos").content;
const templateCompras = document.getElementById("template-compras").content;
const templateResumen = document.getElementById("template-resumen").content;
const fragment = document.createDocumentFragment();

let compras = {};

document.addEventListener("DOMContentLoaded", (e) => {
  fetchProductos();
  if (localStorage.getItem("compras")) {
    compras = JSON.parse(localStorage.getItem("compras"));
    mostrarCompra();
  }
});
cardsProductos.addEventListener("click", (e) => {
  addCompra(e);
});
items.addEventListener("click", (e) => {
  btnAumentarDisminuir(e);
});

// Traer productos
const fetchProductos = async () => {
  try {
    const res = await fetch("./json/productos.json");
    const data = await res.json();
    mostrarCard(data);
  } catch (error) {
    console.log(error);
  }
};

const mostrarCard = (data) => {
  data.forEach((producto) => {
    templateProductos.querySelector("#nombreProduco").textContent =
      producto.title;
    templateProductos.querySelector("#precioProducto").textContent =
      producto.precio;
    templateProductos
      .querySelector("#imagenProducto")
      .setAttribute("src", producto.thumbnailUrl);
    templateProductos.querySelector("#comprarProducto").dataset.id =
      producto.id;

    const clone = templateProductos.cloneNode(true);
    fragment.appendChild(clone);
  });

  cardsProductos.appendChild(fragment);
};

const addCompra = (e) => {
  if (e.target.id == "comprarProducto") {
    setCompra(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCompra = (objeto) => {
  const producto = {
    id: objeto.querySelector("#comprarProducto").dataset.id,
    title: objeto.querySelector("#nombreProduco").textContent,
    precio: objeto.querySelector("#precioProducto").textContent,
    cantidad: 1,
  };

  if (compras.hasOwnProperty(producto.id)) {
    producto.cantidad = compras[producto.id].cantidad + 1;
  }

  compras[producto.id] = { ...producto };

  mostrarCompra();
};

const mostrarCompra = () => {
  items.innerHTML = "";

  Object.values(compras).forEach((producto) => {
    templateCompras.getElementById("listID").textContent = producto.id;
    templateCompras.getElementById("listNombre").textContent = producto.title;
    templateCompras.getElementById("listCantidad").textContent =
      producto.cantidad;
    templateCompras.getElementById("listPrecio").textContent =
      producto.precio * producto.cantidad;

    templateCompras.getElementById("addProducto").dataset.id = producto.id;
    templateCompras.getElementById("removeProducto").dataset.id = producto.id;

    const clone = templateCompras.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  mostrarResumen();
  localStorage.setItem("compras", JSON.stringify(compras));
};

const mostrarResumen = () => {
  resumen.innerHTML = "";

  if (Object.keys(compras).length === 0) {
    resumen.innerHTML = `
        <th scope="row" colspan="5">Pedido vacío!</th>
        `;
    return;
  }

  // sumar cantidad y sumar totales
  const nCantidad = Object.values(compras).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(compras).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  templateResumen.getElementById("cantTotal").textContent = nCantidad;
  templateResumen.getElementById("precioTotal").textContent = nPrecio;

  const clone = templateResumen.cloneNode(true);
  fragment.appendChild(clone);

  resumen.appendChild(fragment);

  const boton = document.querySelector("#vaciar-compras");
  boton.addEventListener("click", () => {
    compras = {};
    mostrarCompra();
  });
};

const btnAumentarDisminuir = (e) => {
  if (e.target.id == "addProducto") {
    const producto = compras[e.target.dataset.id];
    producto.cantidad++;
    compras[e.target.dataset.id] = { ...producto };
    mostrarCompra();
  }

  if (e.target.id == "removeProducto") {
    const producto = compras[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete compras[e.target.dataset.id];
    } else {
      compras[e.target.dataset.id] = { ...producto };
    }
    mostrarCompra();
  }
  e.stopPropagation();
};

const ConfirmarClick = () => {  
  if (Object.keys(compras).length > 0){
    window.location.replace("./pages/confirmacionCompra.html");
  }  
};
