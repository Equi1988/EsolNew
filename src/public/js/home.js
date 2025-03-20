const socket = io();

// Solo si hay un <ul id="productList">
const productList = document.getElementById("productList");
if (productList) {
    socket.on("initialProducts", (productos) => {
        updateProductList(productos);
    });

    socket.on("newProduct", (product) => {
        const newProduct = document.createElement("li");
        newProduct.id = `product-${product.id}`;
        newProduct.innerHTML = `${product.title} - $${product.price} <button onclick="deleteProduct(${product.id})">Eliminar</button>`;
        productList.appendChild(newProduct);
    });

    socket.on("deleteProduct", (id) => {
        const productElement = document.getElementById(`product-${id}`);
        if (productElement) {
            productElement.remove();
        }
    });
}

// Solo si hay un formulario de agregar producto
const addProductForm = document.getElementById("addProductForm");
if (addProductForm) {
    addProductForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("productName").value;
        const price = parseFloat(document.getElementById("productPrice").value);
        const description = document.getElementById("productDescription").value;
        const code = document.getElementById("productCode").value;
        const stock = parseInt(document.getElementById("productStock").value);
        const category = document.getElementById("productCategory").value;

        const newProduct = { 
            title, 
            price, 
            description, 
            code, 
            stock, 
            category, 
            status: true, 
            thumbnails: "" 
        };

        socket.emit("newProduct", newProduct);

        // Limpiar el formulario
        addProductForm.reset();
    });
}

function deleteProduct(id) {
    socket.emit("deleteProduct", id);
}

function updateProductList(productos) {
    if (!productList) return;

    productList.innerHTML = ""; // Limpiar la lista actual
    productos.forEach((product) => {
        const newProduct = document.createElement("li");
        newProduct.id = `product-${product.id}`;
        newProduct.innerHTML = `${product.title} - $${product.price} <button onclick="deleteProduct(${product.id})">Eliminar</button>`;
        productList.appendChild(newProduct);
    });
}

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        try {
            const res = await fetch(`/api/carts/1/product/${id}`, {
                method: 'POST'
            });

            if (res.ok) {
                alert('Producto agregado al carrito!');
            } else {
                alert('Error al agregar al carrito');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    });
});

