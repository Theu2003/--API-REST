# Projeto Catálogo de Produtos com API

Este é um projeto desenvolvido como parte da atividade #10, que consiste em criar uma aplicação web simples que consome uma API pública ou uma "Fake-API".

## 🚀 Sobre o Projeto

O projeto é um catálogo de produtos que permite visualizar, adicionar e deletar itens. Ele foi construído utilizando HTML, CSS e JavaScript puros, e consome a API `https://dummyjson.com` para obter e manipular os dados dos produtos.

### ✨ Funcionalidades

-   **Listagem de Produtos:** A página inicial exibe uma galeria com produtos obtidos via requisição `GET`.
-   **Detalhes do Produto:** Ao clicar em "Ver Detalhes", o usuário é levado a uma página com informações completas sobre o produto.
-   **Adicionar Produto:** Uma página com um formulário permite adicionar um novo produto ao catálogo usando uma requisição `POST`.
-   **Deletar Produto:** É possível deletar um produto diretamente da página inicial usando uma requisição `DELETE`.

## 🛠️ Tecnologias Utilizadas

-   **HTML5**
-   **CSS3** (com Grid Layout para a galeria)
-   **JavaScript (ES6+)** (com `fetch` e `async/await` para as requisições)
-   **API:** DummyJSON

## 📝 Relato de Implementação

### Desafios e Soluções

Um dos principais desafios foi estruturar o código JavaScript para lidar com as diferentes páginas (`index.html`, `produto.html`, `adicionar.html`) a partir de um único arquivo `js/main.js`. A solução foi criar um "roteador" simples que verifica o `window.location.pathname` para determinar qual função de inicialização deve ser chamada para cada página.

O tratamento das requisições assíncronas com a API foi feito utilizando `async/await`, o que simplificou bastante o código, tornando-o mais legível e fácil de manter em comparação com o uso de Promises com `.then()` aninhados. O tratamento de erros foi implementado com blocos `try...catch` para capturar falhas na comunicação com a API e informar o usuário.

### Próximos Passos

-   [ ] Implementar a funcionalidade de edição (PUT).
-   [ ] Adicionar um feedback visual (loading spinner) durante as requisições.
-   [ ] Melhorar a responsividade do layout para dispositivos móveis.