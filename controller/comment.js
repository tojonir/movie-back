const express = require("express");
const { PrismaClient } = require("@prisma/client");
const yup = require("yup");

const Router = express.Router();

const prisma = new PrismaClient();

const schema = yup.object().shape({
  content: yup.string().required(),
  user: yup.string().required(),
  movie: yup.string().required(),
  parrentComment: yup.string(),
});

const getSubComment = async (parrent) => {
  for (const element of parrent) {
    const subComment = await prisma.comment.aggregateRaw({
      pipeline: [{ $match: { parrentComment: element._id["$oid"] } }],
    });
    element.comment = subComment;
    if (subComment.length > 0) {
      await getSubComment(subComment);
    }
  }
};

Router.get("/", async (req, res) => {
  try {
    const comment = await prisma.comment.aggregateRaw({
      pipeline: [{ $match: { parrentComment: "" } }],
    });
    await getSubComment(comment);
    res.json(comment);
  } catch (error) {
    res.status(404).send(error);
  }
});

Router.get("/:movie", async (req, res) => {
  const { movie } = req.params;
  try {
    const comment = await prisma.comment.aggregateRaw({
      pipeline: [{ $match: { movie, parrentComment: "" } }],
    });
    await getSubComment(comment);
    res.json(comment);
  } catch (err) {
    res.status(404).json(err.meta.message);
  }
});

Router.post("/", (req, res) => {
  schema
    .validate(req.body)
    .then(async () => {
      const comment = await prisma.comment.create({
        data: req.body,
      });
      res.json(comment);
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
      const movie = await prisma.comment.update({
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
    const comment = await prisma.comment.delete({
      where: {
        id,
      },
    });
    res.json(comment);
  } catch (error) {
    res.status(404).send(error.meta.message);
  }
});

module.exports = Router;
