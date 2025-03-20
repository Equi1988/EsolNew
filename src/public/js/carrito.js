const socket = io();

const cartContent = document.getElementById('cart-content');


// Solicitar carrito
fetch(`/api/carts/${cartId}`)
    .then(response => response.json())
    .then(cart => {
        if (cart && cart.products && cart.products.length > 0) {
            cart.products.forEach(product => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <strong>${product.title}</strong> - $${product.price} x ${product.quantity}
                `;
                cartContent.appendChild(div);
            });
        } else {
            cartContent.innerHTML = "El carrito está vacío.";
        }
    })
    .catch(error => {
        console.error("Error al obtener el carrito:", error);
        cartContent.innerHTML = "Error al cargar el carrito.";
    });

// Eliminar carrito
document.getElementById('deleteCartButton').addEventListener('click', () => {
    fetch(`/api/carts/${cartId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(`Carrito eliminado: ${data.message}`);
        window.location.href = '/home';  // Redirigir a la página de inicio
    })
    .catch(error => {
        console.error("Error al eliminar el carrito:", error);
        alert("Error al eliminar el carrito.");
    });
});