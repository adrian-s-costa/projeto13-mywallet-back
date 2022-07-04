import { db, objectId } from '../dbStrategy/mongo.js';
import joi from 'joi';
import dayjs from 'dayjs';

export async function getTrans(req, res) {
  const session = res.locals.session;

  const posts = await db
    .collection('wallet')
    .find({ userId: new objectId(session.userId) })
    .toArray();

  res.send(posts);
}

export async function createTrans(req, res) {
  const trans = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  const transSchema = joi.object({
    valor: joi.string().required(),
    descricao: joi.string().required(),
    tipo: joi.string().required()
  });

  const { error } = transSchema.validate(trans);

  if (error) {
    return res.sendStatus(422);
  }

  const session = await db.collection('sessoes').findOne({ token });
  

  if (!session) {
    return res.sendStatus(401);
  }

  const userID = session.userId;

  await db.collection('wallet').findOne({ userID })
  await db.collection('wallet').updateOne({_id: userID}, {$set: {...transacoes, transacoes:[{
        horario : dayjs().format('HH:mm:ss'),
        tipo: trans.tipo,
        nome: trans.descricao,
        valor: trans.valor
    }
    ]}});
    const obj = await db.collection('wallet').findOne({ userID })
  res.status(201);
  res.send(obj);
}
