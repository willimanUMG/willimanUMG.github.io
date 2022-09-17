const items = document.getElementById("items");
const listado = document.getElementById("listado");
const btnAgregar = document.getElementById("btnAgregar");

const templateProductos = document.getElementById("template-productos").content;
const fragment = document.createDocumentFragment();

let cotizacion = {};

items.addEventListener("click", (e) => {
  btnEliminar(e);
});

btnAgregar.addEventListener("click", (e) => {
  clickAddProducto(e);
});

const clickAddProducto = (e) => {
  if (cotizacion.hasOwnProperty(document.getElementById("fieldCodigo").value)) {
    window.alert("Producto ya ingresado");
  } else {
    const producto = {
      id: document.getElementById("fieldCodigo").value,
      descripcion: document.getElementById("fieldDescripcion").value,
      cantidad: document.getElementById("fieldCantidad").value,
      precioUnitario: document.getElementById("fieldPrecio").value,
      descuento: 0,
      precioTotal: 0,
    };

    if (producto.cantidad >= 10) {
      producto.descuento = 5;
    } else if (producto.cantidad >= 6) {
      producto.descuento = 4;
    } else if (producto.cantidad >= 3) {
      producto.descuento = 3;
    }

    const totalTmp = producto.cantidad * producto.precioUnitario;
    producto.precioTotal = totalTmp - (totalTmp * producto.descuento) / 100;

    cotizacion[producto.id] = { ...producto };

    document.getElementById("fieldCodigo").value = "",
    document.getElementById("fieldDescripcion").value = "",
    document.getElementById("fieldCantidad").value = "",
    document.getElementById("fieldPrecio").value = "",

    actualizarListadoProductos();
  }
  e.stopPropagation();
};

const actualizarListadoProductos = () => {
  items.innerHTML = "";

  if (Object.keys(cotizacion).length === 0) {
    items.innerHTML = `
           <tr>
              <th scope="row" colspan="7">Cotizacion vacía!</th>
            </tr>
          `;
  } else {
    Object.values(cotizacion).forEach((producto) => {      
      templateProductos.getElementById("listID").textContent = producto.id;
      templateProductos.getElementById("listDescripcion").textContent = producto.descripcion;
      templateProductos.getElementById("listCantidad").textContent = producto.cantidad;
      templateProductos.getElementById("listPrecioUnitario").textContent = producto.precioUnitario;
      templateProductos.getElementById("listDescuento").textContent = producto.descuento;
      templateProductos.getElementById("listTotal").textContent = producto.precioTotal;
      templateProductos.getElementById("removeProducto").dataset.id = producto.id;

      const clone = templateProductos.cloneNode(true);
      fragment.appendChild(clone);
    });
    items.appendChild(fragment);
  }

  totalizarCotizacion();
  localStorage.setItem("cotizacion", JSON.stringify(cotizacion));
};

const totalizarCotizacion = () => {
  if (Object.keys(cotizacion).length === 0) {
    document.getElementById("totalCotizacion").textContent = 0;
  } else {
    const nPrecio = Object.values(cotizacion).reduce((acc, { precioTotal }) => acc + precioTotal,0);

    document.getElementById("totalCotizacion").textContent = nPrecio;
  }
};

const btnEliminar = (e) => {
  const producto = cotizacion[e.target.dataset.id];
  delete cotizacion[e.target.dataset.id];

  actualizarListadoProductos();

  e.stopPropagation();
};
