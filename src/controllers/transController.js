import { db, objectId } from '../dbStrategy/mongo.js';
import joi from 'joi';
import dayjs from 'dayjs';

export async function getTrans(req, res) {
  const session = res.locals.session;

  const trans = await db
    .collection('wallet')
    .find({_id: new objectId(session.userId)})
    .toArray();

  res.send(trans);
}


export async function createTrans(req, res) {
  const trans = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  const transSchema = joi.object({
    valor: joi.number().required(),
    descricao: joi.string().required(),
    tipo: joi.string().required()
  });

  const { error } = transSchema.validate(trans);

  if (error) {
    return res.sendStatus(422);
  }

  const session = await db.collection('wallet').findOne({ token });
  

  if (!session) {
    return res.sendStatus(401);
  }


  await db.collection('wallet').updateOne({_id: new objectId(session.userId)}, {$push: { transacoes: {
        horario: dayjs().format('HH:mm:ss'),
        tipo: trans.tipo,
        nome: trans.descricao,
        valor: trans.valor
    }}});

    const user = await db
  .collection('wallet')
  .find({ _id: new objectId(session.userId) })
  .toArray();
  
  res.sendStatus(201);
}
