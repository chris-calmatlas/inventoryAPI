// Express 5.x middleware by chris_calmatlas

// validate req.params.id is a valid ObjectId
exports.idValidator = (req, res, next) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    } else {
        return next();
    }
}

exports.requireBody = (req, res, next) => {
    // If body is empty send status 400
    if (!req.body) {
        return res.status(400).json({ error: 'Body is empty' });
    } else {
        return next();
    }
}