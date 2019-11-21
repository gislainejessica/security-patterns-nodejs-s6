## Passo a Passo seguido na refatoração dessa aplicação em NodeJs
- 1 Criar uma pasta dentro do __app__ para abstrair parte do codigo que se encontra nos controles relacionados com validação. **Services** & **validators**
- 2 Dentro da pasta **validators**, criar middlewares para a validação da cada região de código que estaja fazendo uma validação no controller
- 3 Chamar esse middleware de validação nas rotas que usam o controle onde aquela validação precisa ser feita, sempre antes dos controllers
- 4 Dentro da pasta **Services** para colocar parte do código que pode vir a ser utilizado em outros controllers futuramente
- 5 Chamar o services dentro dos controles que precisam de determinada lógica 

---
### Cache
- 1 Criar dentro da pasta lib um arquivo cache.js para fazer as configurações de cache
- 2 Instalar biblioteca para lidar com cache
  - `yarn add ioredis`
- 3 Construir a classe de cache que vai manipular operações de cacheamento

- 4 Usar o cache para armazenar prestadores de serviços 
  - Importar a Cache.js criado anteriormente
    ```js
      import Cache from '../../lib/Cache'
    ```
  - Antes de retorna a lista de prestadores, salvar lista no cache
    ```js
      await Cache.set('providers', providers)
    ```
  - Criar uma lógica no inicio do Controller para verificar se info já está em cache, se sim retorna essa info do cache diretamente.
    ```js
      const cached = Cache.get('providers')
      if (cached){
        return cached
      }
    ```