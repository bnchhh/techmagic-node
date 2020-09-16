const schema = require('../models/validateTodo');

const schemaValidator = async (req, res, next) => {
    try {
        await schema.validateAsync(req.body);
        next();
    }
    catch (error) {
        res.status(206);
        next(error);
    }
}

module.exports = schemaValidator;