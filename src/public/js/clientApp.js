
// document.addEventListener("DOMContentLoaded", () => {
//     const socket = io();

//     const productForm = document.getElementById("addProductForm");
//     const productList = document.getElementById("product-list");

//     // Solicitar productos al cargar
//     socket.emit("requestProducts");

//     // Escuchar lista de productos inicial
//     socket.on("initialProducts", (products) => {
//         if (productList) {
//             productList.innerHTML = "";
//             products.forEach(product => {
//                 const div = document.createElement("div");
//                 div.innerHTML = `
//                     <strong>${product.title}</strong> - ${product.description} - $${product.price}
//                     <button onclick="deleteProduct(${product.id})">Eliminar</button>
//                 `;
//                 productList.appendChild(div);
//             });
//         }
//     });

//     // Agregar producto
//     if (productForm) {
//         productForm.addEventListener("submit", (e) => {
//             e.preventDefault();
//             const product = {
//                 title: document.getElementById("productName").value,
//                 price: parseFloat(document.getElementById("productPrice").value),
//                 description: document.getElementById("productDescription").value,
//                 code: document.getElementById("productCode").value,
//                 stock: parseInt(document.getElementById("productStock").value),
//                 category: document.getElementById("productCategory").value,
//             };
//             socket.emit("newProduct", product);
//             productForm.reset();
//         });
//     }

//     // Eliminar producto
//     window.deleteProduct = function (id) {
//         socket.emit("deleteProduct", id);
//     };
// });


// document.addEventListener("DOMContentLoaded", () => {
//     const socket = io();
//     const productForm = document.getElementById("addProductForm");
//     const productList = document.getElementById("product-list");

//     // Solicitar productos al cargar
//     socket.emit("requestProducts");

//     // Escuchar lista de productos inicial
//     socket.on("initialProducts", (products) => {
//         if (productList) {
//             productList.innerHTML = "";
//             products.forEach(product => {
//                 const div = document.createElement("div");
//                 div.innerHTML = `
//                     <strong>${product.title}</strong> - ${product.description} - $${product.price}
//                     <button onclick="deleteProduct(${product.id})">Eliminar</button>
//                     <button onclick="addToCart(${product.id})">Agregar al carrito</button>
//                 `;
//                 productList.appendChild(div);
//             });
//         }
//     });

//     // Agregar producto
//     if (productForm) {
//         productForm.addEventListener("submit", (e) => {
//             e.preventDefault();
//             const product = {
//                 title: document.getElementById("productName").value,
//                 price: parseFloat(document.getElementById("productPrice").value),
//                 description: document.getElementById("productDescription").value,
//                 code: document.getElementById("productCode").value,
//                 stock: parseInt(document.getElementById("productStock").value),
//                 category: document.getElementById("productCategory").value,
//             };
//             socket.emit("newProduct", product);
//             productForm.reset();
//         });
//     }

//     // Eliminar producto
//     window.deleteProduct = function (id) {
//         socket.emit("deleteProduct", id);
//     };

//     // Agregar producto al carrito
//     window.addToCart = function (productId) {
//         const cartId = 1; // Suponiendo que el carrito es el primero, puedes hacerlo dinámico si lo deseas
//         socket.emit("addProductToCart", { cartId, productId });
//     };
// });

// // Escuchar el evento de actualización del carrito
// socket.on("cartUpdated", (updatedCart) => {
//     console.log("Carrito actualizado:", updatedCart);
//     // Actualiza la vista del carrito con los nuevos datos
// });

// socket.on("cartDeleted", (cartId) => {
//     console.log(`Carrito ${cartId} eliminado`);
//     // Redirige al usuario a la página de inicio o muestra un mensaje
//     window.location.href = '/home';
// });

// document.addEventListener("DOMContentLoaded", () => {
//     const socket = io();
//     const productList = document.getElementById("product-list");

//     let cartId = document.body.getAttribute("data-cart-id");

//     // Función para crear carrito desde cliente si no tiene
//     async function createCartIfNeeded() {
//         if (!cartId) {
//             const res = await fetch("/api/carts", { method: "POST" });
//             const data = await res.json();
//             cartId = data.id;
//             document.cookie = `cartId=${cartId}; path=/`; // Guardar en cookie también
//             console.log("Carrito creado con ID:", cartId);
//         }
//     }

//     window.addToCart = async function(productId) {
//         await createCartIfNeeded();
//         socket.emit("addProductToCart", { cartId, productId });
//         alert(`Producto ${productId} agregado al carrito ${cartId}`);
//     };

//     window.deleteProduct = function(id) {
//         socket.emit("deleteProduct", id);
//     };

//     // Renderizado de productos cuando se actualiza lista
//     socket.on("initialProducts", (products) => {
//         if (productList) {
//             productList.innerHTML = "";
//             products.forEach(product => {
//                 const div = document.createElement("div");
//                 div.innerHTML = `
//                     <strong>${product.title}</strong> - ${product.description} - $${product.price}
//                     <button onclick="addToCart(${product.id})">Agregar al carrito</button>
//                     <button onclick="deleteProduct(${product.id})">Eliminar</button>
//                 `;
//                 productList.appendChild(div);
//             });
//         }
//     });
// });

document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    const productForm = document.getElementById("addProductForm");
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

    window.addToCart = function(productId) {
        const cartId = 1; // ID del carrito
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
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                alert('Producto agregado al carrito');
            }
        })
        .catch(error => {
            console.error('Error al agregar el producto al carrito:', error);
            alert('Error al intentar agregar el producto.');
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



