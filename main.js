document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://dummyjson.com/products';

    // Roteamento simples baseado no nome do arquivo
    const path = window.location.pathname.split("/").pop();

    if (path === 'index.html' || path === '') {
        carregarProdutos();
    } else if (path === 'produto.html') {
        carregarDetalhesDoProduto();
    } else if (path === 'adicionar.html') {
        configurarFormularioAdicionar();
    }

    // --- Funções para a Página Principal (index.html) ---

    async function carregarProdutos() {
        const container = document.getElementById('produtos-container');
        if (!container) return;

        try {
            // Método GET para buscar produtos
            const response = await fetch(`${API_URL}?limit=12`);
            const data = await response.json();
            
            container.innerHTML = ''; // Limpa o container
            data.products.forEach(produto => {
                const card = document.createElement('div');
                card.className = 'produto-card';
                card.innerHTML = `
                    <img src="${produto.thumbnail}" alt="${produto.title}">
                    <div class="produto-info">
                        <h3>${produto.title}</h3>
                        <p>Preço: $${produto.price.toFixed(2)}</p>
                    </div>
                    <div class="produto-botoes">
                        <a href="produto.html?id=${produto.id}" class="btn-detalhes">Ver Detalhes</a>
                        <button class="btn-deletar" data-id="${produto.id}">Deletar</button>
                    </div>
                `;
                container.appendChild(card);
            });

            // Adiciona event listeners para os botões de deletar
            document.querySelectorAll('.btn-deletar').forEach(button => {
                button.addEventListener('click', deletarProduto);
            });

        } catch (error) {
            container.innerHTML = '<p>Erro ao carregar os produtos.</p>';
            console.error('Erro:', error);
        }
    }

    async function deletarProduto(event) {
        const produtoId = event.target.dataset.id;
        if (!confirm(`Tem certeza que deseja deletar o produto ${produtoId}?`)) {
            return;
        }

        try {
            // Método DELETE para remover um produto
            const response = await fetch(`${API_URL}/${produtoId}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (data.isDeleted) {
                alert(`Produto ${data.title} deletado com sucesso!`);
                // Remove o card do produto da tela
                event.target.closest('.produto-card').remove();
            } else {
                alert('Falha ao deletar o produto.');
            }
        } catch (error) {
            alert('Erro ao deletar o produto.');
            console.error('Erro:', error);
        }
    }

    // --- Funções para a Página de Detalhes (produto.html) ---

    async function carregarDetalhesDoProduto() {
        const container = document.getElementById('produto-detalhe-container');
        if (!container) return;

        const params = new URLSearchParams(window.location.search);
        const produtoId = params.get('id');

        if (!produtoId) {
            container.innerHTML = '<p>ID do produto não fornecido.</p>';
            return;
        }

        try {
            // Método GET para buscar um único produto
            const response = await fetch(`${API_URL}/${produtoId}`);
            const produto = await response.json();

            container.innerHTML = `
                <h2>${produto.title}</h2>
                <img src="${produto.thumbnail}" alt="${produto.title}">
                <p><strong>Descrição:</strong> ${produto.description}</p>
                <p><strong>Preço:</strong> $${produto.price.toFixed(2)}</p>
                <p><strong>Avaliação:</strong> ${produto.rating} / 5</p>
                <p><strong>Estoque:</strong> ${produto.stock} unidades</p>
                <p><strong>Marca:</strong> ${produto.brand}</p>
                <p><strong>Categoria:</strong> ${produto.category}</p>
            `;
        } catch (error) {
            container.innerHTML = '<p>Erro ao carregar os detalhes do produto.</p>';
            console.error('Erro:', error);
        }
    }

    // --- Funções para a Página de Adicionar (adicionar.html) ---

    function configurarFormularioAdicionar() {
        const form = document.getElementById('form-adicionar-produto');
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const novoProduto = {
                title: document.getElementById('titulo').value,
                description: document.getElementById('descricao').value,
                price: parseFloat(document.getElementById('preco').value),
            };

            try {
                // Método POST para adicionar um novo produto
                const response = await fetch(`${API_URL}/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoProduto)
                });
                const data = await response.json();
                alert(`Produto "${data.title}" adicionado com sucesso com o ID: ${data.id}!`);
                form.reset();
            } catch (error) {
                alert('Erro ao adicionar o produto.');
                console.error('Erro:', error);
            }
        });
    }
});