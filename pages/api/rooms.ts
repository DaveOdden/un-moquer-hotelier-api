const { connectToDatabase } = require('../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

const collectionName = "rooms"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  switch (req.method) {
    case 'GET': {
      return getRooms(req, res);
    }
    case 'OPTIONS': {
      return res.status(200).send({message: 'ok'});
    }
  }

  async function getRooms(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ){
    try {
      let { db } = await connectToDatabase();
      let rooms;

      if(req.query.id) {
        rooms = await db
          .collection(collectionName)
          .findOne({
            _id: parseInt(req.query.id as any)
          })
      } else {
        rooms = await db
          .collection(collectionName)
          .find()
          .sort({_id:1})
          .toArray(); 
      }

      return res.json({
        message: JSON.parse(JSON.stringify(rooms)),
        success: true,
      });
    } catch (error) {
      return res.json({
        message: new Error(error as any).message,
        success: false,
      });
    }
  }
}