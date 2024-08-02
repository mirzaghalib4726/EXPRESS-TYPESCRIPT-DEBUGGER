import { error } from "console";
import { Request, Response } from "express";
import moment from "moment-timezone";
import { NotificationModel } from "../modals/notification";
import { UserModel } from "../modals/user";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.create(req.body);
    return res.status(201).send({ status: 201, data: user });
  } catch (e: any) {
    if (e.code == 11000) {
      return res.status(500).send({
        status: 409,
        message: "Duplicate data found",
        data: { keys: e.keyPattern },
      });
    }
    return res
      .status(500)
      .send({ status: e.status, message: e.message, data: null });
  }
};

export const getUserTimezone = async (req: Request, res: Response) => {
  try {
    const user = (await UserModel.find({}, { timezone: 1 }).lean()).map(
      (obj) => obj.timezone
    );
    return res.status(200).send({ status: 200, data: user });
  } catch (e: any) {
    return res
      .status(500)
      .send({ status: e.status, message: e.message, data: null });
  }
};

function filterFCMTokensByTimezone(users: Array<any>) {
  const fcmTokens: any = [];
  const localtime: any = [];
  const timezone: any = [];

  if (!Array.isArray(users) || users.length === 0) {
    return { fcmTokens: [], localtime: [], timezone: [] };
  }

  const now = moment().toISOString();
  users
    .filter((obj) => {
      const currentTimeInTimeZone = moment.tz(now, obj.timezone).hour();
      return currentTimeInTimeZone >= 9 && currentTimeInTimeZone < 21;
    })
    .forEach((obj) => {
      const localTime = moment.tz(now, obj.timezone).toString();
      fcmTokens.push(obj.fcmToken);
      localtime.push(localTime);
      timezone.push(obj.timezone);
    });

  return { fcmTokens, localtime, timezone };
}

async function filterFCMTokensByDatabaseEntries(
  fcmtokens: Array<any>,
  localtimes: Array<any>,
  timezones: Array<any>
) {
  try {
    const fcmTokens: any = [];
    const localtime: any = [];
    const timezone: any = [];
    const repeatingFcmTokens: any = [];
    let status = false;

    const notification = await NotificationModel.findOne({ sent: true }).lean();
    if (!notification) {
      return {
        status: true,
        update: {
          fcmTokens: fcmtokens,
          localtime: localtimes,
          timezone: timezones,
        },
        send: { fcmTokens: fcmtokens },
      };
    }

    fcmtokens.forEach((obj, ind) => {
      const index = notification.fcmTokens.indexOf(obj);
      if (index == -1) {
        if (!status) {
          status = true;
        }
        fcmTokens.push(fcmtokens[ind]);
        localtime.push(localtimes[ind]);
        timezone.push(timezones[ind]);
      } else {
        const now = moment().toISOString();
        const databaseLocalT = notification.localtime[index];
        const jsDate = new Date(databaseLocalT);
        const parsedDate = moment(jsDate);
        const today = moment.tz(now, notification.timezone[index]);
        if (!parsedDate.isSame(today, "day")) {
          if (!status) {
            status = true;
          }
          repeatingFcmTokens.push(fcmtokens[ind]);
          notification.localtime[index] = localtimes[ind];
        }
      }
    });
    return {
      status,
      update: {
        fcmTokens: [...notification.fcmTokens, ...fcmTokens],
        localtime: [...notification.localtime, ...localtime],
        timezone: [...notification.timezone, ...timezone],
      },
      send: { fcmTokens: [...fcmTokens, ...repeatingFcmTokens] },
    };
  } catch (e) {
    throw error(e);
  }
}

export const mongoTimezone = async (req: Request, res: Response) => {
  try {
    console.clear();

    const users = await UserModel.find({}, { fcmToken: 1, timezone: 1 }).lean();

    const { fcmTokens, localtime, timezone } = filterFCMTokensByTimezone(users);
    const data = await filterFCMTokensByDatabaseEntries(
      fcmTokens,
      localtime,
      timezone
    );
    if (data?.status) {
      await NotificationModel.updateOne(
        { sent: true },
        {
          fcmTokens: data?.update?.fcmTokens ?? [],
          localtime: data?.update?.localtime ?? [],
          timezone: data?.update?.timezone ?? [],
          time: Date.now(),
        },
        {
          upsert: true,
        }
      );
      if (data.send.fcmTokens.length) {
        // send Notification
      }
    }

    return res.status(200).json({ status: 200, data: data?.send?.fcmTokens });
  } catch (e) {
    throw error(e);
  }
};
