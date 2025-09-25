const Thing = require('../db/models/Thing');

exports.listThings = (req, res) => {
  // This lists all the things
  Thing.find()
    .then((things) => {
      return res.json({ result: things });
    })
}

exports.createThing = (req, res, next) => {
  (new Thing(req.body)).save()
    .then((thing) => {
      return res.status(201).json({ result: thing });
    })
    .catch((err) => {
      handleSaveErrors(err, res, next);
    });
}

exports.getById = (req, res) => {
  Thing.findById(req.params.id)
    .then((thing) => {
      if (!thing) {
        return res.status(404).json({ error: 'Thing not found' });
      } else {
        return res.json({ result: thing });
      }
    })
}

exports.updateThing = (req, res) => {
  const thing = req.body;
  Thing.findByIdAndUpdate(thing.id, thing, { new: true })
    .then((thing) => {
      return res.json({ result: thing });
    })
    .catch((err) => {
      handleSaveErrors(err, res, next);
    });
  }

exports.deleteThing = (req, res) => {
  Thing.findByIdAndDelete(req.params.id)
    .then((thing) => {
      if (!thing) {
        return res.status(404).json({ error: 'Thing not found' });
      }
    })
}

function handleSaveErrors(err, res, next) {
  if (err.name === 'DuplicateError') {
        return res.status(409).json({ error: err.message, result: err.duplicate });
      } else if (err.name === 'ValidationError'){
        const { path, kind } = err.errors['name'];
        return res.status(400).json({ error: `${path} ${kind}` });
      } else {
        return next(err);
      }
}