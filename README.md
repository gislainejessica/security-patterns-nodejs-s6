# Conceitos Básicos de padrões de projetos
- São regras de organização de código
- As padrões estão em constante evolução, coloque na pratica, pra ver se o padrão lhe serve ou não
- Otimização prematura, não se preocupe em otimizar demais antes da hora, refatorar com sabedoria. Seja realista e economize tempo se dedicando na solução com um minimo de organização
  - **Singleton**: Class variável é instanciada apenas uma vez.
  - Repository: (Não tá usando ORM, dái tu pode abstrair a conexão com o Banco, por exemplo)
  - **Service**: Abstrair a lógica, tirar um pouco da lógica do controller para ele não fica tão grande, daí tu pode pegar algumas pontos da lógica e colocar no service, ou quando tem muitas condicionais (vias de mão dupla), ou regra de negócio repetida. Por exemplo, validação.
  - Observer: comunicação de eventos

-- Padroes até certo ponto
- Micro-Services
- Serveless
Ou seja, tá crescendo demais, faz um microserviço ou gera um servelles, onde podemos colocar parte de codigo separado

Ou podemos usar um framework como o Adonis que consegue gerenciar bem aplicações com padrãos já bem estruturados, assim não precisamos nos preocupar muito em que padrão usar, só seguir a base do Framework
