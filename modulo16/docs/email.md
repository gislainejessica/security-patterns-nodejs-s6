### Notificação para email

*Configurando o NodeMailer*

1) `yarn add nodemailer`
2) Dentro da pasta _config_ criar um arquivo `mail.js`

- Serviços de configuração de emails, exemplos para produção:
  - [*Amozon SES*](https://aws.amazon.com/pt/ses/)
  - [*Mailgun*](https://www.mailgun.com/smtp/)
  - [*Sparkpost*](https://www.sparkpost.com)
  - [*Mandril(Mailchimp)*](http://mandrill.com/)
  - Gmail tem limite (smtp limitado)

3) Vamos configurar para essa aplicação o ambiente para desenvolvimento, quando colocar a aplicação em produção tem que migrar para uma das opções acima
  - [MailTrap (Dev)](https://mailtrap.io)

4) Criar uma pasta lib na raiz do src onde algumas configurações adcionais, como envio de emails

5) Fazer o envio de email quando acontecer um cancelamento

---
### Criando um templete engine para envio de emails

- [Handlebar](https://handlebarsjs.com)

1) Instalar `yarn add express-handlebars` que é a integração do express com o handlebars
2) Instalar `yarn add nodemailer-express-handlebars` que é a integração do nodemailer com a parte de cima
3) Na pasta lib no arquivo Mail.js fazer as configurações para a aplicação entender onde estão os templetes e como pode usa-las
4) Criar uma pasta de views n dentro da pasta app, contento a pasta emails (layouts, partials, cacelation.hbs)
5) Criar os templetes para serem enviados
6) Dentro do controller que faz o envio das mensagens
  - Fazer algumas alterações no envio de emails.
    ```js
    await Mail.sendMail({
        to: `${agendamento.provider.name}<${agendamento.provider.email}>`,
        subjet: 'Cancelamento de Agendamento',
        templete: 'cancelation',
        context: {
          provider: agendamento.provider.name,
          user: agendamento.user.name,
          date: format(agendamento.date, "'dia' dd 'de' MMMM', ás' H:mm'h", {
            locale: pt,
          }),
        },
      })
    ```
---
