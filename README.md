# 📖 Blocker Bíblico

> Extensão para Google Chrome que transforma a leitura bíblica em uma
> forma de desbloquear tempo de tela.

------------------------------------------------------------------------

## 1. Visão Geral

O **Blocker Bíblico** é um projeto pessoal de desenvolvimento criado com
o objetivo de controlar o acesso a sites que podem consumir muito tempo,
utilizando a leitura da Bíblia como mecanismo para desbloquear esse
acesso.

A ideia central é simples:

``` text
Leitura bíblica
      ↓
Versículos lidos
      ↓
Tempo desbloqueado
      ↓
Acesso aos sites bloqueados
```

A regra inicial do projeto é:

> **1 versículo lido = 1 minuto de tempo desbloqueado.**

O projeto não tem como objetivo criar um sistema impossível de burlar. A
proposta é funcionar como uma ferramenta de disciplina e incentivo: se o
usuário quiser utilizar tempo em determinados sites, primeiro precisa
dedicar parte do seu tempo à leitura bíblica.

------------------------------------------------------------------------

## 2. Objetivos

### 2.1 Objetivo principal

Desenvolver uma extensão de navegador capaz de:

-   Bloquear sites definidos pelo usuário;
-   Detectar tentativas de acesso a sites bloqueados;
-   Exibir uma página de bloqueio;
-   Permitir que o usuário leia textos bíblicos;
-   Transformar versículos lidos em tempo de acesso;
-   Controlar o consumo desse tempo;
-   Registrar o progresso de leitura;
-   Exibir estatísticas sobre a leitura.

### 2.2 Objetivos de aprendizado

O projeto também será utilizado como ferramenta prática para estudar
desenvolvimento de software.

Principais conhecimentos a serem praticados:

-   HTML;
-   CSS;
-   JavaScript;
-   Manipulação do DOM;
-   Eventos;
-   Funções e módulos;
-   Objetos e estruturas de dados;
-   Armazenamento de dados;
-   APIs do navegador;
-   Chrome Extension API;
-   Manifest V3;
-   Arquitetura de aplicações;
-   Git e GitHub;
-   APIs REST;
-   Backend;
-   Banco de dados.

O desenvolvimento será incremental. Recursos mais complexos só serão
adicionados quando fizerem sentido para a evolução do projeto.

------------------------------------------------------------------------

# 3. Filosofia do Projeto

Um bloqueador convencional normalmente funciona através da simples
restrição:

``` text
"Você está usando demais este site.
O acesso foi bloqueado."
```

O Blocker Bíblico busca uma abordagem diferente:

``` text
"Você quer mais tempo de tela?
Primeiro dedique um pouco de tempo à leitura."
```

Dessa forma, o projeto não tenta apenas remover um comportamento. Ele
cria uma troca:

``` text
📖 Leitura → ⏱️ Crédito → 🌐 Tempo de tela
```

A intenção é transformar parte do tempo que seria utilizado de maneira
passiva em uma atividade considerada mais significativa pelo usuário.

------------------------------------------------------------------------

# 4. Funcionalidades

## 4.1 MVP

A primeira versão funcional do projeto deverá possuir:

-   [ ] Extensão instalável no Chrome;
-   [ ] Popup da extensão;
-   [ ] Lista de sites bloqueados;
-   [ ] Identificação de sites bloqueados;
-   [ ] Página de bloqueio;
-   [ ] Leitor bíblico;
-   [ ] Exibição de versículos;
-   [ ] Registro dos versículos lidos;
-   [ ] Conversão de versículos em minutos;
-   [ ] Contador de tempo desbloqueado;
-   [ ] Persistência dos dados.

## 4.2 Estatísticas

Após o funcionamento do núcleo da extensão:

-   [ ] Quantidade de versículos lidos;
-   [ ] Percentual do capítulo;
-   [ ] Percentual do livro;
-   [ ] Percentual da Bíblia;
-   [ ] Tempo desbloqueado;
-   [ ] Tempo utilizado;
-   [ ] Histórico de leitura;
-   [ ] Progresso diário;
-   [ ] Progresso semanal.

## 4.3 Configurações

-   [ ] Adicionar sites à lista de bloqueio;
-   [ ] Remover sites;
-   [ ] Visualizar tempo disponível;
-   [ ] Configurar preferências do leitor;
-   [ ] Configurar regras do sistema;
-   [ ] Outras configurações futuras.

------------------------------------------------------------------------

# 5. Regras do Sistema

Esta seção define o comportamento esperado da aplicação.

As regras podem ser modificadas durante o desenvolvimento, mas
alterações importantes devem ser registradas na seção **Decisões de
Projeto**.

## 5.1 Conversão de leitura em tempo

Regra inicial:

``` text
1 versículo = 1 minuto
```

Exemplos:

    Versículos lidos   Tempo desbloqueado
  ------------------ --------------------
                   1             1 minuto
                   5            5 minutos
                  10           10 minutos
                  30           30 minutos
                  60               1 hora

A conversão deverá ser centralizada no código para que a regra possa ser
alterada futuramente sem modificar várias partes da aplicação.

------------------------------------------------------------------------

## 5.2 Versículo considerado lido

A definição exata de quando um versículo será considerado lido será
estabelecida durante a implementação.

A primeira abordagem deverá priorizar simplicidade e baixo atrito para o
usuário.

O sistema não deverá exigir quizzes ou testes obrigatórios apenas para
dificultar possíveis tentativas de burlar o mecanismo.

### Princípio

> O objetivo é incentivar a leitura, não transformar a leitura em uma
> prova.

É possível que um usuário burle um sistema baseado em tempo ou
navegação. Isso é considerado aceitável dentro da proposta do projeto.

------------------------------------------------------------------------

## 5.3 Prevenção de crédito duplicado

Um mesmo versículo não deverá gerar crédito repetidamente apenas porque
o usuário voltou para ele.

O sistema deverá registrar quais versículos já foram contabilizados.

Exemplo:

``` text
Gênesis 1:1 → lido → +1 minuto

Voltar para Gênesis 1:1
→ não gerar outro minuto
```

A forma exata de armazenamento será definida durante a implementação.

------------------------------------------------------------------------

## 5.4 Consumo do tempo

O tempo desbloqueado será tratado como um crédito.

Exemplo:

``` text
Saldo inicial: 30 minutos

Usuário utiliza o site por 8 minutos

Saldo restante: 22 minutos
```

Quando o saldo chegar a zero, o site deverá voltar a ser bloqueado.

------------------------------------------------------------------------

# 6. Arquitetura

A arquitetura inicial será baseada nos componentes de uma extensão
Chrome.

``` text
                    BLOCKER BÍBLICO
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
      Popup            Background          Storage
        │                  │                  │
        │                  │                  │
        └──────────┬───────┴───────┬──────────┘
                   │               │
              Leitor Bíblico    Bloqueador
                   │               │
                   └───────┬───────┘
                           │
                    Sistema de Crédito
                           │
                      Estatísticas
```

## 6.1 Popup

Interface rápida da extensão.

Possíveis informações:

-   Tempo disponível;
-   Estado do bloqueador;
-   Progresso recente;
-   Atalhos para leitura;
-   Acesso às estatísticas;
-   Configurações.

## 6.2 Background

Responsável por funcionalidades que precisam continuar funcionando
independentemente da página atualmente aberta.

Possíveis responsabilidades:

-   Gerenciamento do estado;
-   Controle do bloqueador;
-   Comunicação entre componentes;
-   Gerenciamento de eventos da extensão;
-   Controle de créditos.

## 6.3 Página de bloqueio

Página apresentada quando o usuário tenta acessar um site bloqueado sem
tempo disponível.

Ela deverá informar:

-   Que o site está bloqueado;
-   Quanto tempo está disponível;
-   Como desbloquear mais tempo;
-   Atalho para o leitor bíblico.

## 6.4 Leitor bíblico

Responsável por:

-   Exibir o texto bíblico;
-   Permitir navegação;
-   Identificar versículos;
-   Registrar leitura;
-   Atualizar o progresso.

## 6.5 Storage

Responsável por persistir informações como:

``` text
sites bloqueados
tempo disponível
versículos lidos
progresso
configurações
histórico
```

------------------------------------------------------------------------

# 7. Tecnologias

  Tecnologia             Utilização
  ---------------------- ----------------------------
  HTML                   Estrutura das páginas
  CSS                    Interface e estilos
  JavaScript             Lógica da aplicação
  Chrome Extension API   Integração com o navegador
  Chrome Storage API     Persistência dos dados
  Manifest V3            Configuração da extensão
  Git                    Controle de versão
  GitHub                 Hospedagem do código

### Tecnologias futuras

Dependendo da evolução do projeto:

``` text
Frontend
HTML + CSS + JavaScript
        ↓
Chrome Extension API
        ↓
Backend
Node.js
        ↓
API REST
        ↓
Banco de dados
```

A adoção de backend e banco de dados não faz parte da primeira versão e
só deverá acontecer quando existir uma necessidade real.

------------------------------------------------------------------------

# 8. Estrutura de Arquivos

A estrutura poderá evoluir conforme o projeto crescer.

Estrutura planejada:

``` text
blocker-biblico/
│
├── manifest.json
│
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── blocker/
│   ├── blocker.html
│   ├── blocker.css
│   └── blocker.js
│
├── reader/
│   ├── reader.html
│   ├── reader.css
│   └── reader.js
│
├── statistics/
│   ├── statistics.html
│   ├── statistics.css
│   └── statistics.js
│
├── js/
│   ├── storage.js
│   ├── timer.js
│   ├── bible.js
│   └── blocker.js
│
├── data/
│   └── bible.json
│
└── README.md
```

Esta estrutura é uma proposta e não precisa existir integralmente desde
o início.

------------------------------------------------------------------------

# 9. Passo a Passo Geral de Desenvolvimento

O projeto deverá ser desenvolvido em pequenas etapas. Cada etapa deve
produzir algo funcional antes de avançar para a próxima.

------------------------------------------------------------------------

## Fase 1 --- Preparação

### Objetivo

Criar a estrutura inicial do projeto.

### Tarefas

-   [ ] Criar repositório Git;
-   [ ] Criar pasta do projeto;
-   [ ] Criar `manifest.json`;
-   [ ] Configurar Manifest V3;
-   [ ] Criar primeira página HTML;
-   [ ] Criar JavaScript básico;
-   [ ] Instalar a extensão no Chrome;
-   [ ] Testar o carregamento da extensão.

### Resultado esperado

Uma extensão mínima funcionando no navegador.

------------------------------------------------------------------------

# Fase 2 --- Popup

### Objetivo

Criar a primeira interface da extensão.

### Tarefas

-   [ ] Criar `popup.html`;
-   [ ] Criar `popup.css`;
-   [ ] Criar `popup.js`;
-   [ ] Exibir informações básicas;
-   [ ] Adicionar botões;
-   [ ] Testar eventos de clique;
-   [ ] Melhorar a interface.

### Resultado esperado

Um popup funcional capaz de executar ações básicas.

------------------------------------------------------------------------

# Fase 3 --- Primeiro Bloqueador

### Objetivo

Fazer a extensão reconhecer um site bloqueado.

### Tarefas

-   [ ] Criar uma lista de sites;
-   [ ] Detectar navegação;
-   [ ] Obter a URL da página;
-   [ ] Verificar se a URL pertence à lista de bloqueados;
-   [ ] Criar página de bloqueio;
-   [ ] Redirecionar o usuário;
-   [ ] Testar diferentes sites.

### Resultado esperado

Um bloqueador simples funcionando.

``` text
Usuário acessa site
        ↓
Extensão verifica URL
        ↓
Está bloqueado?
   ┌────┴────┐
  NÃO       SIM
   ↓          ↓
Permite     Bloqueia
```

------------------------------------------------------------------------

# Fase 4 --- Sistema de Tempo

### Objetivo

Criar o mecanismo de créditos.

### Tarefas

-   [ ] Criar variável de tempo disponível;
-   [ ] Criar contador;
-   [ ] Implementar timer;
-   [ ] Consumir crédito;
-   [ ] Impedir acesso sem crédito;
-   [ ] Bloquear novamente quando o crédito acabar;
-   [ ] Testar situações de pausa e encerramento.

### Resultado esperado

O bloqueador passa a funcionar com tempo disponível.

------------------------------------------------------------------------

# Fase 5 --- Leitor Bíblico

### Objetivo

Criar a parte principal de leitura.

### Tarefas

-   [ ] Definir estrutura dos dados bíblicos;
-   [ ] Criar dados de teste;
-   [ ] Criar página do leitor;
-   [ ] Exibir livros;
-   [ ] Exibir capítulos;
-   [ ] Exibir versículos;
-   [ ] Criar navegação;
-   [ ] Registrar versículos lidos.

### Resultado esperado

Um leitor bíblico funcional.

------------------------------------------------------------------------

# Fase 6 --- Conversão de Versículos em Crédito

### Objetivo

Conectar o leitor ao sistema de tempo.

### Fluxo

``` text
Versículo lido
      ↓
Sistema registra leitura
      ↓
Calcula crédito
      ↓
Adiciona tempo
      ↓
Atualiza saldo
```

### Tarefas

-   [ ] Criar função de conversão;
-   [ ] Registrar crédito;
-   [ ] Atualizar saldo;
-   [ ] Impedir duplicação;
-   [ ] Atualizar interface.

### Resultado esperado

A mecânica principal do Blocker Bíblico estará funcionando.

------------------------------------------------------------------------

# Fase 7 --- Persistência

### Objetivo

Garantir que os dados não desapareçam quando o usuário fechar o
navegador.

### Tarefas

-   [ ] Implementar Chrome Storage;
-   [ ] Salvar tempo;
-   [ ] Salvar sites;
-   [ ] Salvar versículos lidos;
-   [ ] Recuperar dados;
-   [ ] Testar reinicialização do navegador.

### Resultado esperado

O estado da extensão permanece salvo.

------------------------------------------------------------------------

# Fase 8 --- Estatísticas

### Objetivo

Transformar os dados de leitura em informações úteis.

### Tarefas

-   [ ] Contabilizar versículos;
-   [ ] Calcular progresso do capítulo;
-   [ ] Calcular progresso do livro;
-   [ ] Calcular progresso da Bíblia;
-   [ ] Criar barras de progresso;
-   [ ] Exibir tempo desbloqueado;
-   [ ] Criar histórico.

### Exemplo

``` text
📊 Estatísticas

Hoje
12 versículos

Capítulo
████████████░░░░ 75%

Livro
███████░░░░░░░░ 52%

Bíblia
███░░░░░░░░░░░░ 21%

Tempo desbloqueado
37 minutos
```

------------------------------------------------------------------------

# Fase 9 --- Configurações

### Objetivo

Permitir que o usuário controle o comportamento da extensão.

### Tarefas

-   [ ] Adicionar sites;
-   [ ] Remover sites;
-   [ ] Visualizar sites bloqueados;
-   [ ] Configurar preferências;
-   [ ] Criar interface de configurações;
-   [ ] Salvar configurações.

------------------------------------------------------------------------

# Fase 10 --- Refinamento

### Objetivo

Transformar o protótipo em uma aplicação mais completa.

### Tarefas

-   [ ] Melhorar UI/UX;
-   [ ] Corrigir bugs;
-   [ ] Refatorar código;
-   [ ] Organizar módulos;
-   [ ] Melhorar tratamento de erros;
-   [ ] Criar testes;
-   [ ] Revisar permissões da extensão;
-   [ ] Melhorar documentação.

------------------------------------------------------------------------

# 10. Testes

O projeto deverá ser testado durante todo o desenvolvimento.

## 10.1 Bloqueador

-   [ ] Site permitido abre normalmente;
-   [ ] Site bloqueado é identificado;
-   [ ] Site bloqueado sem crédito não abre;
-   [ ] Site desbloqueado funciona;
-   [ ] Site volta a ser bloqueado quando o crédito acaba.

## 10.2 Leitor

-   [ ] Versículos aparecem corretamente;
-   [ ] Navegação funciona;
-   [ ] Leitura é registrada;
-   [ ] Versículos não geram crédito duplicado;
-   [ ] Progresso é atualizado.

## 10.3 Storage

-   [ ] Dados continuam após fechar o Chrome;
-   [ ] Dados continuam após reiniciar o computador;
-   [ ] Configurações são recuperadas;
-   [ ] Dados corrompidos ou ausentes são tratados.

------------------------------------------------------------------------

# 11. Roadmap

``` text
v0.1
└── Extensão básica

v0.2
└── Popup

v0.3
└── Bloqueador funcional

v0.4
└── Sistema de tempo

v0.5
└── Leitor bíblico

v0.6
└── Sistema de créditos

v0.7
└── Persistência

v0.8
└── Estatísticas

v0.9
└── Configurações

v1.0
└── Primeira versão completa
```

### Possíveis versões futuras

``` text
v2.0
├── Backend
├── Conta de usuário
├── Banco de dados
├── Sincronização
└── Backup

v3.0
├── Planos de leitura
├── Metas
├── Streaks
├── Conquistas
└── Estatísticas avançadas
```

------------------------------------------------------------------------

# 12. Decisões de Projeto

Esta seção deverá funcionar como um registro das decisões técnicas e
conceituais importantes.

## Decisão 001 --- 1 versículo = 1 minuto

**Motivo:** criar uma regra simples e fácil de compreender.

## Decisão 002 --- Não utilizar quizzes obrigatórios

**Motivo:** o objetivo principal é incentivar a leitura. Adicionar
testes apenas para dificultar possíveis fraudes poderia quebrar o ritmo
da leitura e tornar a experiência artificialmente difícil.

## Decisão 003 --- Desenvolvimento incremental

**Motivo:** o projeto também é uma ferramenta de aprendizado. Cada etapa
deve introduzir conceitos novos sem exigir que toda a arquitetura esteja
pronta desde o início.

## Decisão 004 --- Não começar com backend

**Motivo:** a primeira versão pode funcionar localmente. Backend e banco
de dados só devem ser introduzidos quando houver uma necessidade
concreta, como contas, sincronização ou armazenamento remoto.

> Novas decisões importantes devem ser adicionadas nesta seção.

------------------------------------------------------------------------

# 13. Instalação --- Ambiente de Desenvolvimento

Durante o desenvolvimento, a extensão poderá ser carregada manualmente
no Chrome.

### Passo 1 --- Obter o projeto

Clonar o repositório:

``` bash
git clone <URL_DO_REPOSITORIO>
```

### Passo 2 --- Abrir as extensões

No Chrome, acessar:

``` text
chrome://extensions
```

### Passo 3 --- Ativar o modo desenvolvedor

Ativar:

``` text
Modo do desenvolvedor
```

### Passo 4 --- Carregar a extensão

Selecionar:

``` text
Carregar sem compactação
```

E escolher a pasta do projeto.

### Passo 5 --- Testar

A extensão deverá aparecer na lista de extensões instaladas.

------------------------------------------------------------------------

# 14. Como Utilizar

O fluxo esperado será:

``` text
1. Instalar a extensão
        ↓
2. Configurar sites bloqueados
        ↓
3. Tentar acessar um site bloqueado
        ↓
4. Ler os versículos necessários
        ↓
5. Receber tempo de crédito
        ↓
6. Utilizar o tempo desbloqueado
        ↓
7. Quando o crédito acabar, o bloqueio retorna
        ↓
8. Acompanhar o progresso nas estatísticas
```

------------------------------------------------------------------------

# 15. Futuras Funcionalidades

Ideias que poderão ser implementadas depois da primeira versão:

-   [ ] Diferentes traduções bíblicas;
-   [ ] Planos de leitura;
-   [ ] Metas diárias;
-   [ ] Sequência de dias (`streak`);
-   [ ] Conquistas;
-   [ ] Gráficos;
-   [ ] Estatísticas avançadas;
-   [ ] Temas;
-   [ ] Sincronização entre dispositivos;
-   [ ] Sistema de contas;
-   [ ] Backend;
-   [ ] Banco de dados;
-   [ ] Backup;
-   [ ] Aplicativo mobile;
-   [ ] Sistema de notificações;
-   [ ] Personalização das regras de crédito.

------------------------------------------------------------------------

# 16. Princípios de Desenvolvimento

Durante o projeto, alguns princípios devem ser mantidos:

### 1. Simplicidade antes de complexidade

Não implementar uma solução complexa quando uma solução simples resolve
o problema.

### 2. Aprender fazendo

Cada funcionalidade deve ser uma oportunidade para estudar um conceito
novo.

### 3. Funcionalidade antes de aparência

Primeiro fazer funcionar. Depois melhorar a interface.

### 4. Código compreensível

Como o projeto também possui finalidade educacional, o código deve
priorizar clareza.

### 5. Evolução incremental

Evitar tentar construir toda a extensão de uma vez.

### 6. Registrar decisões

Quando uma decisão importante for tomada, documentá-la.

------------------------------------------------------------------------

# 17. Estado Atual do Projeto

> Esta seção deverá ser atualizada durante o desenvolvimento.

### Atualmente

-   [ ] Extensão criada
-   [ ] Popup criado
-   [ ] Bloqueador criado
-   [ ] Sistema de tempo criado
-   [ ] Leitor bíblico criado
-   [ ] Sistema de crédito criado
-   [ ] Storage implementado
-   [ ] Estatísticas implementadas
-   [ ] Configurações implementadas

### Próximo objetivo

> Definir aqui a próxima funcionalidade a ser desenvolvida.

------------------------------------------------------------------------

# 18. Conclusão

O Blocker Bíblico é um projeto que combina **desenvolvimento de
software, controle de tempo de tela e leitura bíblica**.

Seu desenvolvimento será incremental, começando com uma extensão simples
e evoluindo gradualmente para um sistema completo.

O objetivo não é apenas produzir uma extensão funcional, mas utilizar o
projeto como uma forma prática de aprender programação e desenvolvimento
de aplicações.

A evolução planejada é:

``` text
HTML + CSS + JavaScript
          ↓
Chrome Extension
          ↓
Bloqueador
          ↓
Sistema de tempo
          ↓
Leitor bíblico
          ↓
Sistema de créditos
          ↓
Storage
          ↓
Estatísticas
          ↓
Backend / API
          ↓
Banco de dados
```

O projeto deverá crescer conforme novas necessidades forem
identificadas, mantendo sempre a ideia central:

> **Mais tempo de tela começa com mais tempo na Palavra.**
