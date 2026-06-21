
# AuMigo & Cia: Plataforma E-commerce Petshop

Projeto desenvolvido como trabalho final da disciplina de **Programação Web (PW)** do curso de **Análise e Desenvolvimento de Sistemas**. O objetivo foi construir o frontend completo de uma loja virtual, com foco na manipulação dinâmica do DOM, persistência de dados via Web Storage API e simulação de um fluxo real de e-commerce no lado do cliente.

<br>

## Sobre o Projeto

A aplicação cobre as principais etapas de uma jornada de compra: navegação pelo catálogo com filtragem por categoria, adição de produtos ao carrinho, autenticação de usuário e finalização do pedido. Visitantes não autenticados podem navegar e adicionar itens ao carrinho normalmente — o login é exigido apenas no momento do checkout, e os itens selecionados são preservados após a autenticação.

<br>

## Tecnologias

O projeto é construído inteiramente com as tecnologias base da web, sem frameworks ou bibliotecas externas.

- **HTML5** — estrutura e semântica das páginas
- **CSS3** — estilização, layout responsivo e abordagem mobile-first
- **JavaScript (Vanilla ES6+)** — lógica de negócio, manipulação do DOM e controle de estado
- **Node.js / npx** — ambiente local de desenvolvimento
- **json-server** — simulação de API REST para o catálogo de produtos
- **npx serve** — servidor HTTP estático para execução local

<br>

## Persistência de Dados

Nenhum banco de dados externo é utilizado. O estado da aplicação é gerenciado inteiramente pelo armazenamento do navegador:

- **`localStorage`** persiste o catálogo de produtos e os carrinhos individuais de cada usuário, indexados por ID
- **`sessionStorage`** controla a sessão ativa do usuário autenticado

<br>

## Como Executar

É necessário ter o **Node.js** instalado.

**1. Clonar o repositório**
```bash
git clone https://github.com/sthefanyematias/petshop-pw1.git
cd petshop-pw1
```

**2. Subir a API de produtos** — execute em um terminal e mantenha-o aberto:
```bash
npx json-server products.json
```

**3. Servir a aplicação** — execute em um segundo terminal:
```bash
npx serve . -p 5500
```

Acesse em `http://localhost:5500`.

<br>

## Equipe

- Geovanna de Lima Novais — [@geonovais](https://github.com/geonovais)
- Laís da Silva Ferreira — [@laisdsf](https://github.com/laisdsf)
- Patrícia Queiroz de Oliveira — [@patriciaqueiroz2025](https://github.com/patriciaqueiroz2025)
- Sthefany Evangelista Matias — [@sthefanyematias](https://github.com/sthefanyematias)
