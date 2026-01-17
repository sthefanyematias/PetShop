# 🐾 AuMigo & Cia: Plataforma E-commerce Petshop

Este projeto foi desenvolvido como trabalho final da disciplina de **Programação Web (PW)** do curso de **Análise e Desenvolvimento de Sistemas**. O objetivo foi simular o frontend completo de uma loja virtual, focando na manipulação de dados em tempo real e na persistência de informações via armazenamento interno do navegador.

A aplicação simula uma experiência completa de e-commerce, incluindo catálogo de produtos, gerenciamento de sessões de usuário, e um sistema de carrinho de compras individual.

## Tecnologias Utilizadas
O projeto é construído com as tecnologias base do desenvolvimento web e utiliza o ecossistema Node.js para simular o ambiente de produção/API:

* **HTML5:** Estrutura e semântica do conteúdo.
* **CSS3:** Estilização, layout e responsividade completa (Mobile-First).
* **JavaScript (Vanilla JS):** Lógica de negócios, manipulação do DOM e controle de estado.
* **Node.js / npx:** Utilizado para servir o projeto localmente (`npx serve`) e para simular o Backend/API de dados (`npx json-server`).

### Armazenamento de Dados (Persistência)
O projeto utiliza o armazenamento interno do navegador para gerenciar o estado:
* `localStorage`: Utilizado para persistir o **catálogo de produtos** e os **carrinhos de compra individuais** de cada usuário.
* `sessionStorage`: Utilizado para gerenciar a **sessão atual de login** do usuário.

## Integrantes da Equipe
O projeto foi desenvolvido em grupo por 4 integrantes:
* _Geovanna de Lima Novais_ | GitHub: **@geonovais**
* _Laís da Silva Ferreira_ | GitHub: **@laisdsf**
* _Patrícia Queiroz de Oliveira_ | GitHub: **@patriciaqueiroz2025**
* _Sthefany Evangelista Matias_ | GitHub: **@sthefanyematias**

## Como Executar o Projeto Localmente

Para rodar o projeto e a simulação da API, é necessário ter o **Node.js** instalado.

1.  **Clonar o Repositório**
    ```bash
    git clone [https://github.com/sthefanyematias/petshop-pw.git](https://github.com/sthefanyematias/petshop-pw1.git)
    cd petshop-pw1
    ```

2.  **Inicializar a Simulação da API (1º CMD)**

    Abra o primeiro terminal CMD ou Git Bash na pasta do projeto e execute:
    ```bash
    npx json-server products.json
    ```
    *Este terminal deve permanecer aberto.*

4.  **Iniciar o Servidor Web (2º CMD)**

    Abra um **segundo terminal** na mesma pasta e execute:
    ```bash
    npx serve . -p 5500
    ```
    O site estará acessível em: `http://localhost:5500`
