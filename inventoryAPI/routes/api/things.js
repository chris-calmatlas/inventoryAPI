const express = require('express');
const thingsRouter = express.Router();
const Thing = require('../../db/models/Thing');

const jsonParser = express.json();

// list of things
thingsRouter.get('/', function(req, res) {
  const things = Thing.find();
  things
    .then((things) => {
      return res.status(200).json({ success: true, result: things });
    })
    .catch((err) => {
      console.error(err);
      return res.sendStatus(500);
    });
});

// create a new thing
thingsRouter.post('/', jsonParser, function(req, res) {
  // If body is empty send status 400
  if (!req.body) return res.status(400).json({ success: false, message: 'Body is empty' });

  // Validate the body and build the thing
  const thing = new Thing(req.body);
  if (!thing.name ) {
    return res.status(400).json({ success: false, message: 'Missing required fields: name' });
  }
  if (thing.count.current === undefined) {
    thing.count.current = 0;
  }

  // Check for duplicates
  // Don't create if both name and description match
  const existingThing = Thing.findOne({ name: req.body.name, description: req.body.description });
  existingThing
    .then((dupe) => {
      if (dupe) {
        return res.status(409).json({ success: false, result: dupe, message: "Duplicate found" });
      } else {
        // Save the thing and send it back
        thing.save()
          .then(() => {
            return res.status(201).json({ success: true, result: thing });
          })
          .catch((err) => {
            console.error(err);
            return res.sendStatus(500);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.sendStatus(500);
    });
});

// get a specific thing by id
thingsRouter.get('/:id', function(req, res) {
  // validate req.params.id is a valid ObjectId based on 24 hex characters (mongodb)
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  const thing = Thing.findById(req.params.id);
  thing
    .then((thing) => {
      if (!thing) {
        return res.send(404).json({ success: false, message: 'Thing not found' });
      } else {
        return res.status(200).json({ success: true, result: thing });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.sendStatus(500);
    });
});

// update a specific thing by id
thingsRouter.put('/:id', function(req, res) {
  // validate req.params.id is a valid ObjectId
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  // If body is empty send status 400
  if (!req.body) return res.status(400).json({ success: false, message: 'Body is empty' });

  const thing = Thing.findById(req.params.id);
  thing
    .then((thing) => {
      if (!thing) {
        return res.status(404).json({ success: false, message: 'Thing not found' });
      } else {
        // Update the thing with the request body
        Object.assign(thing, req.body);
        // Validate required fields
        if (!thing.name ) {
          return res.status(400).json({ success: false, message: 'Missing required fields: name' });
        }
        if (thing.count.current === undefined) {
          thing.count.current = 0;
        }
        // Do not allow saving if it would create a duplicate
        const existingThing = Thing.findOne({ 
          _id: { $ne: thing._id }, // Exclude current thing from search
          name: thing.name, 
          description: thing.description 
        });
        existingThing
          .then((dupe) => {
            if (dupe) {
              return res.status(409).json({ success: false, result: dupe });
            } else {
              // Save the updated thing and send it back
              thing.save()
                .then(() => {
                  return res.status(200).json({ success: true, result: thing });
                })
                .catch((err) => {
                  console.error(err);
                  return res.sendStatus(500);
                });
            }
          })
          .catch((err) => {
            console.error(err);
            return res.sendStatus(500);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.sendStatus(500);
    });
});

// delete a specific thing by id
thingsRouter.delete('/:id', function(req, res) {
  // validate req.params.id is a valid ObjectId
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  const thing = Thing.findById(req.params.id);
  thing
    .then((thing) => {
      if (!thing) {
        return res.send(404).json({ success: false, message: 'Thing not found' });
      } else {
        // Delete the thing
        thing.deleteOne()
          .then(() => {
            return res.status(200).json({ 
              success: true, 
              message: 'Thing deleted successfully',
              result: thing });
          })
          .catch((err) => {
            console.error(err);
            return res.sendStatus(500);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.sendStatus(500);
    });
});

module.exports = thingsRouter;
