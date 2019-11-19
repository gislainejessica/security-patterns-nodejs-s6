## Trabalhando com agendamentos

1) Criar uma migration pra criar a tabela de agendamento
`yarn sequelize migration:create --name=create-agendamentos`

2) Gerar tabela
`yarn sequelize db:migrate`

3) Criar um modelo para representar essa tabela na aplicação
`Agendamento.js`

4) Ir no `index.js` do database e adicionar o modelo de agendamento

---

## Controlar o agendamento
- Criar um `AgendamentoController.js`
- Criar uma rota para manipular os agendamentos

  `routes.post('/agendamentos', AgendamentoController.store)`

---

## Validações dentro do agendamento
- `yarn add date-fns@next`
1) Validar data, sempre pegar datas futuras de acordo com o tempo atual

  ```js
    const horaStart = startOfHour(parseISO(data))
      if (isBefore(horaStart, new Date())) {
        return res.status(400).json({
          error:
            'Não dá pra fazer agendamento no passado, informe uma data futura',
        })
      }
  ```

2) Validar se data está disponivel para agendamento
  ```js
    const agendaCheck = await Agendamento.findOne({
      where: {
        provider_id,
        canceled_at: null,
        data: horaStart,
      },
    })

    if (agendaCheck) {
      return res
        .status(400)
        .json({ error: 'Horário não está disponível para agendamento' })
    }
  ```

---

## Listar agendamentos
- Criar rota de listagem

  `routes.get('/agendamentos', AgendamentoController.index)`

- Criar um metodo index no controle dos agendamentos

---

### Paginação
Quanto de informação será levada por vez

```js
  const { page = 1 } = req.query
  ...
  limit: 20,
  offset: (page - 1) * 20,
  ...
```

---

### Lista Agenda de um determinado provedor
Apesar de provedor ser tambem um usuario, vamos fazer uma listagem diferenciada para ele, então:
- Criar um novo controller para ele.

  `ScheduleController.js`

- Criar a rota para acessar a essa agenda

  `routes.get('/schedule', ScheduleController.index)`

---

### Cancelar agendamento
- Regra: só pode ser cancelado um agendamento há mais de duas horas para acontecer
1) Rota para deletar o agendamento
  `routes.delete('/agendamentos/:id', AgendamentoController.delete)`
2) Criar no controller de agendamento um metodo de delete

---

### Listando para o provedor os horários disponíveis
1) Criar uma rota para fazer as listagens
  - `routes.get('/providers/:providerId/available', AvailableController.index)`
2) Criar um `AvailableController.js` paralidar com essa nova rota e verificar quais horarios estão disponíveis

---



