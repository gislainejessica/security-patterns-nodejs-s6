## Upload de imagens no NodeJs
Json não suporta upload de arquivos, envio de arquivos, por isso usar __Multipart-Form-Data__ para fazer envio de imagens e arquivos, para manipular esse tipo de requisição usaremos o **Multer**

  - `yarn add multer`

1. Criar na raiz do projeto uma pasta __temp__

2. Criar na pasta config dentro so src o arquivo `multer.js`
  - Configuração pra upload de arquivos

3. Fazer a configuração para upload

  - Exemplo de config:
    ```js
    export default {
      storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        filename: (req, file, cb) => {
          crypto.randomBytes(16, (err, res) => {
            if (err) {
              return cb(err)
            }
            return cb(null, res.toString('hex') + extname(file.originalname))
          })
        },
      }),
    }
    ```
4. Criar uma rota para fazer o upload de arquivos.
  - Criar uma variavel de uplod como o multer que vai captar os arquivos da rota
    `const upload = multer(multerConfig)`
  - A rota ficaria assim nesse ponto
    ```js
      routes.post('/files', upload.single('file'), (req, res) => {
      return res.json({ ok: true })})
    ```

Algumas observações sobre essa configuração:
- __storage__ define como o _multer_ vai guardar os arquivos de imagem

  - _CDN_: Content Delivery Network => servidores online para armazenar arquivos fisicos num servidor, por ex:  _Digital Ocean Spaces_ e _Amazon S3_
  - _DiskStorage_ é a opção que vamos utilizar, nesse caso, para armazenar os arquivos localmente.
    - Antes de salvar os arquivos vamos formatar o nome do arquivo de imagem:
      - Pra não ter carateres especiais que podem dá problemas na hora de armazenar,
      - E caso as imagens tenham nomes repetidos, não dá conflito na hora de referenciar
---

## Referenciar imagem na base de dados

1) Vamos primeiro criar um controler pra lidar com as requisições da rota `/files` que criamos anteriormente, vamos dar o nome de `FileController.js`

2) Vamos precisar mexer no banco de dados, pois no momento não temos onde armazer nas tabelas até o momento
  - Criar então a migration que vai criar tabela para armazer esses arquivos

    - `yarn sequelize migration:create --name=create-files`

  - Criada a migrations, fazer as devidas modificaçoes e então gerar a tabela no banco:

    - `yarn sequelize db:migrate`
3) Vamos agora criar  um modelo para representar essa tabela na nossa aplicação
  - Criar `file.js` nos Models

4) Ir no `index.js` dentro da pasta _database_ e importar esse novo modelo

5) Fazer a referencia de qual usuario pertence aquela imagem salva
  - Opção 1: Desfazer a migration que criou tabela do __users__ e adicionar um coluna nova
    - _Problema_: Como a tabela de __files__ é criada depois, na tabela de __users__ não pode haver referência à tabela de __files__, ou seja, nada feito por aqui.

  - Opção 2: Criar uma nova migration, separada só pra criar essa nova coluna na tabela de __users__
    - Como essa migration vai está depois das outras na linha do tempo, poderá ser criada, sem problemas,
      uma nova coluna na tabela __users__ referenciando a tabela de __files__, pois essa migration tem acesso a essa informações de ambas as tabelas por ter sido criada depois.

      - `yarn sequelize migration:create --name=add-avatar-fields-to-users`

    - Depois, again:
      - `yarn sequelize db:migrate`

  * Alguns problemas na hora de salvar usando os modelos da aplicação.
    - As referências entre os models users e files tem que existem também na aplicação,
      já que foi criada nas migrations, para isso faremos o seguinte:

      - 1) No modelo `User.js` faremos a seguinte alteração:
        ```js
          static associate(models) {
          this.belongsTo(models.File, { foreignKey: 'avatar_id' })}
        ```
      - 2) Chamar esse metodo de associate no `index.js` do _database_
        ```js
          ...
            models.map(model => {
            model.associate && model.associate(this.connection.models)
            })
          ...
        ```
---
### Providers
1) Criar uma rota de provides no `routes.js`
2) Criar um ProviderController para lidar com as requisições de providers, pois apesar de um provider ser um tipo de usuario, lá no UserController já temos um metodo index que lista os usuarios, então se precisamos de um outro index pra listar os que são provedores, temos que criar um novo controller.
3) Criar um midlleware no app.js usando express.static pra referenciar os uploads

- __Issues__ encontrados no caminho

  - Na hora de acessar a rota dava erro, aconteceu porque eu tinha escrito a palavra _references_ errado na migration de criação de files, então ela não tava fazendo a referencia com a tabela de users, ou seja, eu tentava listar os provides e dava errado porque eu tava tentando acessar uma referencia que não existia no banco, porque foi criada a coluna sem a referencia de chave estrangeira.

  - Erro na hora de voltar as informação de avatar pq o usuario que eu tava chamado tava sem avatar, então retornava null
