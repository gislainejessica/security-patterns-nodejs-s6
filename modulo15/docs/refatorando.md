## Passo a Passo seguido na refatoração dessa aplicação em NodeJs
- 1 Criar uma pasta dentro do __app__ para abstrair parte do codigo que se encontra nos controles relacionados com validação
- 2 Dentro dessa pasta, criar middlewares para a validação da cada região de código que estaja fazendo uma validação no controller
- 3 Chamar esse middleware de validação nas rotas que usam o controle onde aquela validação precisa ser feita, sempre antes dos controllers