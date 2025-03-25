document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    // Capturar el formulario
    const productForm = document.getElementById("addProductForm");

    productForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        // Capturar valores del formulario
        const title = document.getElementById("productName")?.value.trim();
        const price = document.getElementById("productPrice")?.value.trim();
        const description = document.getElementById("productDescription")?.value.trim();
        const code = document.getElementById("productCode")?.value.trim();
        const stock = document.getElementById("productStock")?.value.trim();
        const categoryInput = document.getElementById("productCategory")?.value.trim();

        // Convertir category en arreglo
        const category = categoryInput ? categoryInput.split(",").map(c => c.trim()) : [];

        // Array para almacenar errores locales (cliente)
        const errors = [];

        // Validaciones en el cliente
        if (!title) errors.push('El campo "Nombre" es obligatorio.');
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            errors.push('El campo "Precio" debe ser un número mayor que 0.');
        }
        if (!description) errors.push('El campo "Descripción" es obligatorio.');
        if (!code) errors.push('El campo "Código" es obligatorio.');
        if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
            errors.push('El campo "Stock" debe ser un número positivo.');
        }
        if (!Array.isArray(category) || category.some(c => typeof c !== "string" || !c)) {
            errors.push('El campo "Categoría" debe ser una lista de cadenas separadas por comas.');
        }

        // Mostrar errores del cliente
        if (errors.length > 0) {
            console.error("Errores detectados en el cliente:", errors);
            alert(errors.join("\n"));
            return;
        }

        // Construir el producto
        const product = {
            title,
            price: parseFloat(price),
            description,
            code,
            stock: parseInt(stock),
            category,
        };

        // Enviar datos al servidor
        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product),
            });

            const result = await response.json();

            if (!response.ok) {
                // Manejar errores del servidor
                console.error("Errores detectados en el servidor:", result.error);
                alert(result.error || "Error desconocido al agregar el producto.");
            } else {
                alert("Producto agregado correctamente.");
                productForm.reset(); // Limpiar formulario
                socket.emit("newProductAdded", result.product); // Emitir evento para tiempo real
            }
        } catch (error) {
            console.error("Error al comunicarse con el servidor:", error);
            alert("Error al comunicarse con el servidor.");
        }
    });

    // Actualizar lista de productos en tiempo real
    socket.on("refreshProducts", () => {
        location.reload(); // Recargar la página para ver productos actualizados
    });

    const fields = [
        { id: 'productName', type: 'string' },
        { id: 'productPrice', type: 'number' },
        { id: 'productDescription', type: 'string' },
        { id: 'productCode', type: 'string' },
        { id: 'productStock', type: 'number' },
        { id: 'productCategory', type: 'string' },
    ];
    
    fields.forEach(({ id, type }) => {
        const input = document.getElementById(id);
        input.addEventListener('input', () => {
            validateField(id, type);
        });
    });
    
    function validateField(id, type) {
        const input = document.getElementById(id);
        const value = input.value.trim();
        const errorElement = document.getElementById(`${id}Error`);
    
        if (!value) {
            errorElement.textContent = "Este campo es obligatorio.";
            input.classList.add("input-error");
            input.classList.remove("input-ok");
            return;
        }
    
        if (type === 'number' && (isNaN(value) || Number(value) < 0)) {
            errorElement.textContent = "Debe ser un número válido.";
            input.classList.add("input-error");
            input.classList.remove("input-ok");
            return;
        }
    
        errorElement.textContent = "";
        input.classList.remove("input-error");
        input.classList.add("input-ok");
    }    

});





