const models = require('../models');

// keeping this file around fo reference

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};


const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
    level: req.body.level,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/games' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ csrfToken: req.csrfToken(), domos: docs });
  });
};

const deleteDomo = (request, response) => {
  console.log('made it into deleteDomo');

  const req = request;
  const res = response;

  Domo.DomoModel.remove({ name: req.body.domoName }, (err) => {
    console.dir(err);
    if (err) {
      return res.status(400).json({ error: 'An error occured while deleting the domo' });
    }
    return res.status(200).json({ success: 'success' });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.deleteDomo = deleteDomo;
module.exports.make = makeDomo;

