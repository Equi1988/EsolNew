const ProductsManager = require('../managers/productsManager');

// Middleware para validar campos requeridos y tipos (admite arreglos)
const validateRequiredFields = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = [];
        const wrongTypes = [];

        requiredFields.forEach(field => {
            const value = req.body[field];

            // Validar si el campo está ausente o vacío
            if (value === undefined || value === '') {
                missingFields.push(field);
            } else {
                // Validar tipos
                if (["title", "description", "code"].includes(field) && typeof value !== "string") {
                    wrongTypes.push(`${field} debe ser una cadena de texto (string).`);
                }
                if (field === "category") {
                    if (!Array.isArray(value)) {
                        wrongTypes.push(`El campo "${field}" debe ser un arreglo (array) de cadenas.`);
                    } else if (!value.every(item => typeof item === "string")) {
                        wrongTypes.push(`Todos los elementos de "${field}" deben ser cadenas de texto.`);
                    }
                }
                if (["price", "stock"].includes(field) && typeof value !== "number") {
                    wrongTypes.push(`${field} debe ser un número.`);
                }
            }
        });

        // Retornar errores si se detectaron problemas
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Faltan los campos: ${missingFields.join(", ")}` });
        }
        if (wrongTypes.length > 0) {
            return res.status(400).json({ error: `Errores de tipo: ${wrongTypes.join(", ")}` });
        }

        next();
    };
};

// Middleware para POST: unicidad total
const validateUniqueFieldsPost = async (req, res, next) => {
    const { title, code } = req.body;
    const existingProducts = await ProductsManager.getProducts();

    if (existingProducts.some(p => p.title === title)) {
        return res.status(409).json({ error: `El nombre "${title}" ya existe` });
    }
    if (existingProducts.some(p => p.code === code)) {
        return res.status(409).json({ error: `El código "${code}" ya existe` });
    }
    next();
};

// Middleware para PUT: unicidad excluyendo el producto actual
const validateUniqueFieldsPut = async (req, res, next) => {
    const { title, code } = req.body;
    const { pid } = req.params;
    const existingProducts = await ProductsManager.getProducts();
    const id = parseInt(pid);

    if (existingProducts.some(p => p.title === title && p.id !== id)) {
        return res.status(409).json({ error: `El nombre "${title}" ya está en uso por otro producto.` });
    }
    if (existingProducts.some(p => p.code === code && p.id !== id)) {
        return res.status(409).json({ error: `El código "${code}" ya está en uso por otro producto.` });
    }
    next();
};

module.exports = {
    validateRequiredFields,
    validateUniqueFieldsPost,
    validateUniqueFieldsPut
};



