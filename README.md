# Dog Lovers Project

**Nome:** Mateus Martins Peres.

---

### Descrição e Objetivo

Este é um projeto front-end desenvolvido como parte de uma atividade acadêmica. O objetivo é criar uma interface web interativa que consome uma API pública para exibir informações e imagens.

A API escolhida foi a **[Dog API](https://dog.ceo/dog-api/)**, que fornece uma vasta coleção de imagens de cães organizadas por raça.

O projeto consiste em três páginas:
1.  **Página Inicial:** Exibe uma imagem aleatória de um cão e permite ao usuário "favoritar" a imagem.
2.  **Página de Raças:** Lista todas as raças de cães disponíveis e mostra uma imagem ao selecionar uma raça.
3.  **Página de Favoritos:** Mostra todas as imagens que o usuário marcou como favoritas, permitindo também removê-las da lista.

### Tecnologias Utilizadas

- **HTML5:** Estruturação semântica do conteúdo.
- **CSS3:** Estilização e layout (utilizando Flexbox).
- **JavaScript (ES6+):** Manipulação do DOM, interatividade e consumo da API.
- **Fetch API:** Realização das requisições HTTP para a Dog API.
- **LocalStorage API:** Armazenamento local dos dados de "favoritos" para simular operações de POST e DELETE.

### Requisições Utilizadas

Como a Dog API é somente leitura (permite apenas `GET`), as operações de `POST` (adicionar favorito) e `DELETE` (remover favorito) foram simuladas utilizando o `localStorage` do navegador.

| Página | Tipo Requisição | Endpoint / Operação | Descrição |
| :--- | :--- | :--- | :--- |
| `index.html` | `GET` | `https://dog.ceo/api/breeds/image/random` | Busca uma imagem aleatória de um cão. |
| `index.html` | `POST (simulado)` | `localStorage.setItem()` | Adiciona a URL da imagem atual à lista de favoritos. |
| `breeds.html` | `GET` | `https://dog.ceo/api/breeds/list/all` | Busca a lista completa de raças de cães. |
| `breeds.html` | `GET` | `https://dog.ceo/api/breed/{breed}/images/random` | Busca uma imagem aleatória de uma raça específica. |
| `favorites.html` | `GET (simulado)` | `localStorage.getItem()` | Carrega a lista de favoritos do armazenamento local. |
| `favorites.html` | `DELETE (simulado)` | `localStorage.setItem()` | Remove uma imagem específica da lista de favoritos. |


### Créditos

- **API:** Dog API
- **Fonte (Ícones):** Font Awesome
- **Fonte (Tipografia):** Google Fonts

---