import { error } from "console";
import { Request, Response } from "express";
import moment from "moment-timezone";

export const mongoTimezone = (req: Request, res: Response) => {
  try {
    console.log(moment().format("YYYY DD MM hh:mm:ss A"));
    console.log(
      moment.tz(Date.now(), "Asia/Bangkok").format("YYYY DD MM hh:mm:ss A")
    );
    console.log(4);

    return res.status(200).json({ status: 200, data: {} });
  } catch (e) {
    throw error(e);
  }
};
