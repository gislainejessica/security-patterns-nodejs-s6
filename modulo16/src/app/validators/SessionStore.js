import * as Yup from 'yup'

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    })

    await schema.validate(req.body, { abortEarly: false})
    return next()

  }catch(erro){
    return res.status(400).json({ error: 'Falha na validação', messagem: erro.inner } )
  }
}