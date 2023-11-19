import mongoose from "mongoose";
import { IPagination, RequestHandler } from "../types/index.js";

export const paginate =
  (Model, isNext = true): RequestHandler =>
  async (req, res, next) => {
    const limit = parseInt(req?.query?.limit) || 999;
    const page = parseInt(req?.query?.page) || 1;
    const startIndex = (page - 1) * limit;
    const select = req.query?.select?.split(",");
    const exclude = req.query?.exclude?.split(",").filter(Boolean);
    const include = req.query?.include?.split(",")?.filter(Boolean);

    let items: IPagination["items"],
      count: IPagination["count"],
      docsCount: IPagination["docsCount"];

    try {
      if (req.query?.include !== undefined && req.query?.include !== null) {
        items = await Model.find({
          _id: { $nin: exclude, $in: include },
        })
          .limit(limit)
          .skip(startIndex)
          .select(select)
          .exec();
        docsCount = await Model.find({
          _id: { $nin: exclude, $in: include },
        }).countDocuments();
        count = docsCount / limit;
        res.paginated = { items, count: Math.ceil(count), docsCount };
      } else {
        items = await Model.find({ _id: { $nin: exclude } })
          .limit(limit)
          .skip(startIndex)
          .select(select)
          .exec();
        docsCount = await Model.find({
          _id: { $nin: exclude },
        }).countDocuments();
        count = docsCount / limit;
        res.paginated = { items, count: Math.ceil(count), docsCount };
      }
      if (isNext) next();
      else return true;
    } catch (err) {
      next(err);
    }
  };
