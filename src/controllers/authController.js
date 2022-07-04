import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { db } from '../dbStrategy/mongo.js';
import joi from 'joi';

export async function createUser(req, res) {
  const usuario = req.body;

  console.log(req.body)

  const usuarioSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    password2: joi.string().required()
  });

  const { error } = usuarioSchema.validate(usuario);

  if (error || (usuario.password !== usuario.password2)) {
    return res.sendStatus(422);
  }

  // Caso tudo esteja validado vamos criptografar os dados antes
  // de entrar no banco de dados.
  const senhaCriptografada = bcrypt.hashSync(usuario.password, 10);


  //Cadastrar de fato os dados no banco com o a senha criptografada.
  await db.collection('wallet').insertOne({name: usuario.name, email: usuario.email, password: senhaCriptografada, transacoes:[]});
  res.sendStatus(201);
}

export async function loginUser(req, res) {
  const usuario = req.body;

  const usuarioSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
  });

  const { error } = usuarioSchema.validate(usuario);

  if (error) {
    return res.sendStatus(422);
  }

  //Preciso pegar o user pelo email
  const user = await db.collection('wallet').findOne({ email: usuario.email });

  if (user && bcrypt.compareSync(usuario.password, user.password)) {
    const token = uuid();

    await db.collection('wallet').insertOne({
      token,
      userId: user._id
    });

    return res.status(201).send({ token, name: user.name, email: user.email, transacoes:user.transacoes });
  } else {
    return res.status(401).send('Senha ou email incorretos!');
  }
}