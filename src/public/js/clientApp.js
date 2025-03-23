document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    const productForm = document.getElementById("addProductForm");;
    const productList = document.getElementById("product-list");

    // Solicitar productos al cargar
    socket.emit("requestProducts");

    
    // Escuchar lista de productos inicial + refrescos
    socket.on("initialProducts", (products) => {
        productList.innerHTML = "";
        products.forEach(product => {
            const div = document.createElement("div");
            div.innerHTML = `
                <strong>${product.title}</strong> - ${product.description} - $${product.price}
                <button onclick="deleteProduct(${product.id})">Eliminar</button>
            `;
            productList.appendChild(div);
        });
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

    // Eliminar producto
    window.deleteProduct = function (id) {
        socket.emit("deleteProduct", id);
    };

    // Definimos la función y la exponemos en el ámbito global
window.addToCart = function(productId) {
    const cartId = 1; // ID del carrito (puedes ajustar este valor según sea necesario)
    fetch(`/api/carts/${cartId}/product/${productId}`, {
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

    


    
        // Renderizado de productos cuando se actualiza lista
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

});



