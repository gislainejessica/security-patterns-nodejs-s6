## Redis
__Notas sobre a aplicação__:
Na hora de enviar os emails para notificar o cancelamento dos agendamentos, há um pequeno delay na hora de retornar e resposta para o front-end, esse tempo de resposta poderia ser melhorado facilmente, simplesmente tirando o await na hora de enviar o email de cancelamento, pois, a priori, não é necessário que o processo de envio de email seja finializado totalmente para que a aplicação prossiga.

Porém há um problema, nessa abordagem, pois se houver algum erro na hora de enviar esse email de cancelamento o front-end não vai ficar sabendo, por que tirado o await agente não vai ter a resposta se deu certo ou não aquele envio de email.

- Uma melhor Solução seria usar __filas__ ou __Background Jobs__, ou seja, configurar alguns serviços em segundo plano que executam essas atividades que não precisam de retorno imediato ao front-end. Como elas não auteram diretamente no fluxo da aplicação, podemos fazer o cancelamento e seguir, e em segundo plano um serviço vai tentando enviar esses emails e caso tenha algum problema, aí sim o front-end é notificado para fazer alguma coisa.

Aí é que entra o [Redis](https://redis.io), um banco de dados não relacional, no esquema chave e valor, ele é bem performatico mesmo com muitos dados cadastrados

---
### Inicializando com Redis

1) Vamos usar um container do Docker para rodar nosso banco [Redis Docker Hub](https://hub.docker.com/_/redis)
  - `sudo docker run --name redisgobarber -p 6379:6369 -d -t redis:alpine `
2) Instalar o [Bee queue](https://github.com/bee-queue/bee-queue) para fazer o controle das filas
  `yarn add bee-queue`

  2.1 Se quiser controlar prioridade de Jobs é mais indicado usar uma outra bibliteca, como a [Kue](https://github.com/Automattic/kue) que trabalha com fila de prioridades.
  - Aqui, basicamente, agente consegue monitorar esses jobs, fazer retentativas caso necessario.

3) Criar uma arquivo (`Queue.js`) para fazer as configurações dessa fila, dentro da pasta _lib_
4) Criar um pasta de _jobs_ na pasta _src/app_ para armazenar todos os jobs da aplicação
5) Criar  na pasta raiz _src_ uma arquivo `queue.js` pra fazer as configurações finais
  - Para chamar o processo da fila pra rodar separado do programa principal, pra ficar rodando em paralelo
  `node src/queue.js`, a principio vai dar erro, porque não tem o sucrase
  - Criar um script para rodar esse proceso `nodemon src/queue.js`

__Issuies__
Quando eu tava criando o docker com a imagem do redis coloquei a porta errada
sudo docker run --name redisgobarber -p 6379:6369 -d -t redis:alpine
mas devia ter feito
sudo docker run --name redisgobarber -p 6379:6379 -d -t redis:alpine

---

#### Captando erros nas filas
-> Vamos fazer uma configuração no arquivo `Queue.js` da pasta _lib_ para que os falhas que ocorram na fila sejam monitorados.
  - `bee.process(handle)` alterar para `bee.process(handle)`
