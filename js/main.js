document.addEventListener('DOMContentLoaded', () => {
    const pageId = document.body.id;

    switch (pageId) {
        case 'page-index':
            initIndexPage();
            break;
        case 'page-breeds':
            initBreedsPage();
            break;
        case 'page-favorites':
            initFavoritesPage();
            break;
    }
});

const API_BASE_URL = 'https://dog.ceo/api';

// --- Funções da Página Inicial (index.html) ---

function initIndexPage() {
    const imageContainer = document.getElementById('image-container');
    const btnNew = document.getElementById('btn-new');
    const btnFav = document.getElementById('btn-fav');

    async function fetchRandomDog() {
        imageContainer.innerHTML = '<p>Carregando imagem...</p>';
        try {
            const response = await fetch(`${API_BASE_URL}/breeds/image/random`);
            if (!response.ok) throw new Error('Falha na rede');
            const data = await response.json();

            if (data.status === 'success') {
                const img = document.createElement('img');
                img.src = data.message;
                img.alt = 'Cão aleatório';
                imageContainer.innerHTML = '';
                imageContainer.appendChild(img);
            } else {
                throw new Error('Falha ao buscar imagem');
            }
        } catch (error) {
            imageContainer.innerHTML = `<p style="color: red;">Erro: ${error.message}</p>`;
        }
    }

    function addFavorite() {
        const imgSrc = imageContainer.querySelector('img')?.src;
        if (!imgSrc) {
            showNotification('Nenhuma imagem para favoritar.', 'error');
            return;
        }

        const favorites = getFavorites();
        if (favorites.includes(imgSrc)) {
            showNotification('Esta imagem já está nos favoritos!', 'error');
        } else {
            favorites.push(imgSrc);
            localStorage.setItem('dogFavorites', JSON.stringify(favorites));
            showNotification('Adicionado aos favoritos com sucesso!', 'success');
        }
    }

    btnNew.addEventListener('click', fetchRandomDog);
    btnFav.addEventListener('click', addFavorite);


    fetchRandomDog();
}


function initBreedsPage() {
    const selectBreed = document.getElementById('select-breed');
    const imageContainer = document.getElementById('image-container');

    async function fetchAllBreeds() {
        try {
            const response = await fetch(`${API_BASE_URL}/breeds/list/all`);
            if (!response.ok) throw new Error('Falha na rede');
            const data = await response.json();

            if (data.status === 'success') {
                selectBreed.innerHTML = '<option value="">Selecione uma raça</option>';
                const breeds = Object.keys(data.message);
                breeds.forEach(breed => {
                    const option = document.createElement('option');
                    option.value = breed;
                    option.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
                    selectBreed.appendChild(option);
                });
            } else {
                throw new Error('Falha ao buscar lista de raças');
            }
        } catch (error) {
            selectBreed.innerHTML = `<option>Erro: ${error.message}</option>`;
        }
    }

    async function fetchBreedImage(breed) {
        if (!breed) {
            imageContainer.innerHTML = '<p>Selecione uma raça para ver uma imagem.</p>';
            return;
        }
        imageContainer.innerHTML = '<p>Carregando imagem...</p>';
        try {
            const response = await fetch(`${API_BASE_URL}/breed/${breed}/images/random`);
            if (!response.ok) throw new Error('Falha na rede');
            const data = await response.json();

            if (data.status === 'success') {
                const img = document.createElement('img');
                img.src = data.message;
                img.alt = `Cão da raça ${breed}`;
                imageContainer.innerHTML = '';
                imageContainer.appendChild(img);
            } else {
                throw new Error('Falha ao buscar imagem da raça');
            }
        } catch (error) {
            imageContainer.innerHTML = `<p style="color: red;">Erro: ${error.message}</p>`;
        }
    }

    selectBreed.addEventListener('change', (e) => fetchBreedImage(e.target.value));

    fetchAllBreeds();
}


function initFavoritesPage() {
    const favoritesGrid = document.getElementById('favorites-grid');

    function loadFavorites() {
        const favorites = getFavorites();
        favoritesGrid.innerHTML = '';

        if (favorites.length === 0) {
            favoritesGrid.innerHTML = '<p>Você ainda não tem cães favoritos.</p>';
            return;
        }

        favorites.forEach(imgSrc => {
            const item = document.createElement('div');
            item.className = 'favorite-item';
            item.innerHTML = `
                <img src="${imgSrc}" alt="Cão favorito">
                <button class="remove-fav" data-src="${imgSrc}"><i class="fa-solid fa-trash"></i></button>
            `;
            favoritesGrid.appendChild(item);
        });
    }

    function removeFavorite(imgSrc) {
        let favorites = getFavorites();
        favorites = favorites.filter(src => src !== imgSrc);
        localStorage.setItem('dogFavorites', JSON.stringify(favorites));
        loadFavorites(); // Recarrega a grade
    }

    favoritesGrid.addEventListener('click', (e) => {
        if (e.target.closest('.remove-fav')) {
            const button = e.target.closest('.remove-fav');
            const imgSrcToRemove = button.dataset.src;
            removeFavorite(imgSrcToRemove);
        }
    });

    loadFavorites();
}

// --- Funções Utilitárias ---

function getFavorites() {
    return JSON.parse(localStorage.getItem('dogFavorites')) || [];
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}