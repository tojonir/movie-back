const express = require("express");
const { PrismaClient } = require("@prisma/client");
const yup = require("yup");

const Router = express.Router();

const prisma = new PrismaClient();

const schema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  image: yup.string(),
  genre: yup.string(),
  type: yup.string(),
  cast: yup.string(),
  producer: yup.string(),
  release: yup.string(),
});

Router.get("/", async (req, res) => {
  try {
    const movies = await prisma.movies.findMany();
    res.json(movies);
  } catch (error) {
    console.log("error", error);
    res.status(404).send(error);
  }
});

Router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await prisma.movies.findFirst({
      where: {
        id,
      },
    });
    res.json(movie);
  } catch (err) {
    res.status(404).json(err.meta.message);
  }
});

Router.post("/", (req, res) => {
  schema
    .validate(req.body)
    .then(async () => {
      const movie = await prisma.movies.create({
        data: req.body,
      });
      res.json(movie);
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
});

Router.post("/:id", (req, res) => {
  const { id } = req.params;
  schema
    .validate(req.body)
    .then(async () => {
      const movie = await prisma.movies.update({
        where: { id },
        data: req.body,
      });
      res.json(movie);
    })
    .catch((err) => {
      res.status(404).json(err.meta.message);
    });
});

Router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await prisma.movies.delete({
      where: {
        id,
      },
    });
    res.json(movie);
  } catch (error) {
    res.status(404).send(error.meta.message);
  }
});

module.exports = Router;
