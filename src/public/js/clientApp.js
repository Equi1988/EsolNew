const socket = io();

// Escuchar lista inicial de productos
socket.on("initialProducts", (productos) => {
    updateProductList(productos);
});

// Escuchar cuando se agrega un nuevo producto
socket.on("newProduct", (product) => {
    const productList = document.getElementById("productList");
    const newProduct = document.createElement("li");
    newProduct.id = `product-${product.id}`;
    newProduct.innerHTML = `${product.title} - $${product.price} <button onclick="deleteProduct(${product.id})">Eliminar</button>`;
    productList.appendChild(newProduct);
});

// Escuchar cuando un producto es eliminado
socket.on("deleteProduct", (id) => {
    const productElement = document.getElementById(`product-${id}`);
    if (productElement) {
        productElement.remove();
    }
});

// Manejo del formulario de agregar producto
document.getElementById("addProductForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("productName").value;
    const price = parseFloat(document.getElementById("productPrice").value);

    const newProduct = { title, price, description: "", code: "", stock: 0, category: "", status: true, thumbnails: "" };

    socket.emit("newProduct", newProduct);

    // Limpiar el formulario
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
});

// Función para eliminar un producto
function deleteProduct(id) {
    socket.emit("deleteProduct", id);
}

// Función para actualizar la lista de productos
function updateProductList(productos) {
    const productList = document.getElementById("productList");
    productList.innerHTML = ""; // Limpiar la lista actual

    productos.forEach((product) => {
        const newProduct = document.createElement("li");
        newProduct.id = `product-${product.id}`;
        newProduct.innerHTML = `${product.title} - $${product.price} <button onclick="deleteProduct(${product.id})">Eliminar</button>`;
        productList.appendChild(newProduct);
    });
}


