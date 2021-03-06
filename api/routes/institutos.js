var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  const cantidadAVer = parseInt(req.query.cantidadAVer);
  const paginaActual = parseInt(req.query.paginaActual);

  console.log("Esto es un mensaje para ver en consola");
  models.instituto
    .findAll({
      attributes: ["id", "nombre", "director","id_universidad"],
      include:[{as:'Universidad-Relacionada', model:models.universidades, attributes: ["id","nombre"]}],
      offset: (paginaActual - 1) * cantidadAVer, 
      limit: cantidadAVer        
    })

    .then(instituto => res.send(instituto))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.instituto
    .create({ nombre: req.body.nombre, id_universidad: req.body.id_universidad, director: req.body.director })
    .then(instituto => res.status(201).send({ id: instituto.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra materia con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findInstituto = (id, { onSuccess, onNotFound, onError }) => {
  models.instituto
    .findOne({
      attributes: ["id", "nombre","director" ,"id_universidad"],
      where: { id }
    })
    .then(instituto => (instituto ? onSuccess(instituto) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findInstituto(req.params.id, {
    onSuccess: instituto => res.send(instituto),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = instituto =>
  instituto
      .update({ nombre: req.body.nombre, director: req.body.director }, { fields: ["nombre", "director"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra materia con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findInstituto(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = instituto =>
  instituto
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findInstituto(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
