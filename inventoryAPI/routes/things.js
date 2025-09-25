const express = require('express');
const thingsRouter = express.Router();

const jsonParser = express.json();
const { requireBody, idValidator } = require('../middleware/calmexpress');
const thingsController = require('../controllers/things');

thingsRouter.route('/')
    // list of things
    .get(thingsController.listThings)
    // create a new thing
    .post(jsonParser, requireBody, thingsController.createThing);

thingsRouter.route('/:id')
    .all(idValidator)
    // get a specific thing by id
    .get(thingsController.getById)
    // update a specific thing by id
    .put(jsonParser, requireBody, thingsController.updateThing)
    // delete a specific thing by id
    .delete(thingsController.deleteThing);

module.exports = thingsRouter;