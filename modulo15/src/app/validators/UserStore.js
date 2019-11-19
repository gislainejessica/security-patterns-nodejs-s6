import * as Yup from 'yup'

export default async (req, res, next) => {
  try{
    // Validação de entrada
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    })
    await schema.validate(req.body, { abortEarly: false})
    return next()
  }catch(erro){
    return res.status(400).json({ error: 'Falha na validação', messagem: erro.inner } )

  }
}