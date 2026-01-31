import { validate as isUUID } from 'uuid';

/**
 * Middleware to validate UUID parameters
 * @param {string[]} paramNames - Array of parameter names to validate as UUIDs
 */
export const validateUUIDs = (...paramNames) => {
    return (req, res, next) => {
        for (const paramName of paramNames) {
            const value = req.params[paramName] || req.body[paramName] || req.query[paramName];

            if (value && !isUUID(value)) {
                return res.status(400).json({
                    error: `Invalid ${paramName} format. Must be a valid UUID.`
                });
            }
        }
        next();
    };
};

/**
 * Validate a single UUID value
 * @param {string} value - UUID string to validate
 * @returns {boolean} - True if valid UUID
 */
export const isValidUUID = (value) => {
    return isUUID(value);
};
