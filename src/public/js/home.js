// Función para obtener los productos
function fetchProducts() {
    fetch('/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener los productos: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Extraer los productos correctamente según la respuesta de la API
            const products = Array.isArray(data) ? data : data.products;

            if (Array.isArray(products)) {
                updateProductView(products); // Actualiza la vista si es un array
            } else {
                console.error("El formato de 'products' no es válido:", products);
            }
        })
        .catch(error => {
            console.error('Error al obtener productos:', error);
        });
}

// Función para actualizar la vista de productos
function updateProductView(products) {
    if (!Array.isArray(products)) {
        console.error('El formato de "products" no es válido:', products);
        return;
    }

    const productContainer = document.getElementById('product-list');
    if (!productContainer) {
        console.error('El contenedor con ID "product-list" no existe en el DOM.');
        return;
    }
    productContainer.innerHTML = ''; // Limpia la vista actual

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <p>Stock: ${product.stock}</p>
            <p>Categoria: ${product.category}</p>
            <p>Code:${product.code}</p>
            <button onclick="addToCart(${product.id})">Agregar al carrito</button>
        `;
        productContainer.appendChild(productElement);
    });
}

// Función para agregar un producto al carrito
async function addToCart(productId) {
    const cartId = 1; // Identificador del carrito (puedes usar otro si gestionas múltiples carritos)

    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.error) {
            alert(`Error al agregar el producto: ${data.error}`);
        } else {
            alert('Producto agregado al carrito');
            fetchProducts(); // Actualiza la lista de productos después de agregar
        }
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        alert('No se pudo agregar el producto al carrito. Inténtalo más tarde.');
    }
}

// Función para renderizar los productos en el DOM
function updateProductView(products) {
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = ''; // Limpiar el contenido actual

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');

        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoria: ${product.category}</p>
            <button onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                ${product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
        `;

        productContainer.appendChild(productElement);
    });
}

// Lógica para inicializar la vista principal al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(); // Cargar productos al iniciar la aplicación
});
