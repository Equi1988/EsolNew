document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    const productForm = document.getElementById("addProductForm");
    const productList = document.getElementById("product-list");

    // Solicitar productos al cargar
    socket.emit("requestProducts");

    // Escuchar lista de productos inicial + refrescos
    socket.on("initialProducts", (products) => {
        if (productList) {
            productList.innerHTML = "";
            products.forEach(product => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <strong>${product.title}</strong> - ${product.description} - $${product.price}
                    <button onclick="addToCart(${product.id})">Agregar al carrito</button>
                    <button onclick="deleteProduct(${product.id})">Eliminar</button>
                `;
                productList.appendChild(div);
            });
        }
    });

    // Enviar nuevo producto
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const product = {
            title: document.getElementById("productName").value,
            price: parseFloat(document.getElementById("productPrice").value),
            description: document.getElementById("productDescription").value,
            code: document.getElementById("productCode").value,
            stock: parseInt(document.getElementById("productStock").value),
            category: document.getElementById("productCategory").value,
        };
        socket.emit("newProduct", product);
        productForm.reset();
    });

    // Modificar producto
window.modifyProduct = function(productId) {
    const productName = prompt("Nuevo nombre del producto (deja vacío para no cambiar):");
    const productPrice = prompt("Nuevo precio del producto (deja vacío para no cambiar):");
    const productDescription = prompt("Nueva descripción del producto (deja vacío para no cambiar):");

    // Solo se envían los campos que tienen valores
    const updatedProduct = {};

    if (productName) updatedProduct.title = productName;
    if (productPrice) updatedProduct.price = parseFloat(productPrice);
    if (productDescription) updatedProduct.description = productDescription;

    fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
    })
    .then(response => response.json())
    .then(data => {
        alert("Producto actualizado con éxito.");
    })
    .catch(error => {
        console.error("Error al modificar el producto:", error);
        alert("No se pudo modificar el producto.");
    });
};

    // Eliminar producto
    window.deleteProduct = function (id) {
        socket.emit("deleteProduct", id);
    };

    // Función para agregar productos al carrito
    window.addToCart = function(productId) {
        const cartId = 1; // ID del carrito, ajusta este valor según sea necesario

        // Llamada a la API para agregar un producto al carrito
        fetch(`/api/carts/${cartId}/producto/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al agregar al carrito: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Producto agregado exitosamente al carrito.');
        })
        .catch(error => {
            console.error('Error al agregar el producto al carrito:', error);
            alert('No se pudo agregar el producto al carrito.');
        });
    };
});



