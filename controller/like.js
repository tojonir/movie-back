const express = require("express");
const { PrismaClient } = require("@prisma/client");
const yup = require("yup");

const prisma = new PrismaClient();

const Router = express.Router();

const schema = yup.object({
  user: yup.string().required(),
  parrentId: yup.string().required(),
});

Router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let like = await prisma.like.aggregateRaw({
      pipeline: [
        {
          $match: {
            parrentId: id,
          },
        },
        {
          $count: "count",
        },
      ],
    });
    res.send(like[0]);
  } catch (error) {
    res.status(404).json({ meesage: error });
  }
});

Router.post("/", (req, res) => {
  schema
    .validate(req.body)
    .then(async () => {
      let like = await prisma.like.aggregateRaw({
        pipeline: [
          { $match: { user: req.body.user, parrentId: req.body.parrentId } },
        ],
      });
      if (like.length === 0) {
        like = await prisma.like.create({
          data: req.body,
        });
      } else {
        like = await prisma.like.delete({
          where: {
            id: like[0]._id["$oid"],
          },
        });
      }
      res.json(like);
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
});

module.exports = Router;
