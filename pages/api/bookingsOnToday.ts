const { connectToDatabase } = require("../../lib/mongodb")
const ObjectId = require("mongodb").ObjectId
import type { NextApiRequest, NextApiResponse } from "next"
import dayjs from "dayjs"

type ResponseData = {
  message: string
}

const collectionName = "bookings"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  switch (req.method) {
    case "GET": {
      return getBookingsOnToday(req, res)
    }
    case "OPTIONS": {
      return res.status(200).send({ message: "ok" })
    }
  }

  async function getBookingsOnToday(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    try {
      let { db } = await connectToDatabase()
      let bookings = await db
        .collection(collectionName)
        .find({
          checkinDate: {
            $gte: dayjs().startOf("day").format(),
            $lte: dayjs().endOf("day").format(),
          },
        })
        .toArray()

      return res.json({
        message: JSON.parse(JSON.stringify(bookings)),
        success: true,
      })
    } catch (error) {
      return res.json({
        message: new Error(error as any).message,
        success: false,
      })
    }
  }
}
