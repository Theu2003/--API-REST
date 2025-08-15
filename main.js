const API_URL = '/api/cars';

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.endsWith('index.html') || path === '/') {
        fetchAndDisplayCars();
    } else if (path.endsWith('add-car.html')) {
        setupAddCarForm();
    } else if (path.endsWith('details.html')) {
        fetchCarDetails();
    }
});

async function fetchAndDisplayCars() {
    const carListContainer = document.getElementById('car-list');
    if (!carListContainer) return;

    carListContainer.innerHTML = '<div class="loader"></div>'; // Mostra o loader

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cars = await response.json();
        carListContainer.innerHTML = ''; // Limpa a lista antes de adicionar os novos carros

        if (cars.length === 0) {
            carListContainer.innerHTML = '<p class="message">Nenhum carro encontrado.</p>';
            return;
        }

        cars.forEach(car => {
            // Criação segura dos elementos para evitar XSS
            const carCard = document.createElement('div');
            carCard.className = 'car-card';

            const carImage = document.createElement('img');
            carImage.src = car.imageUrl;
            carImage.alt = `${car.brand} ${car.model}`;

            const cardContent = document.createElement('div');
            cardContent.className = 'car-card-content';

            cardContent.innerHTML = `
                <h2>${escapeHTML(car.brand)} ${escapeHTML(car.model)}</h2>
                <p>Ano: ${escapeHTML(String(car.year))}</p>
                <p>Preço: R$ ${Number(car.price).toLocaleString('pt-BR')}</p>
                <a href="details.html?id=${car.id}">Ver Detalhes</a>
            `;

            carCard.appendChild(carImage);
            carCard.appendChild(cardContent);
            carListContainer.appendChild(carCard);
        });
    } catch (error) {
        console.error('Erro ao buscar carros:', error);
        carListContainer.innerHTML = '<p class="message" style="color: red;">Falha ao carregar os carros. Tente novamente mais tarde.</p>';
    }
}

function setupAddCarForm() {
    const form = document.getElementById('add-car-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const imageFile = document.getElementById('imageFile').files[0];
        if (!imageFile) {
            showFeedback('Por favor, selecione uma imagem.', 'error', form);
            return;
        }

        const submitButton = form.querySelector('button');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        try {
            const imageUrl = await readFileAsDataURL(imageFile);

            const newCar = {
                brand: document.getElementById('brand').value,
                model: document.getElementById('model').value,
                year: parseInt(document.getElementById('year').value),
                price: parseFloat(document.getElementById('price').value),
                imageUrl: imageUrl,
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCar),
            });

            if (response.ok) {
                alert('Carro adicionado com sucesso!');
                window.location.href = 'index.html';
            } else {
                throw new Error('Falha na resposta da API');
            }
        } catch (error) {
            console.error('Erro ao adicionar carro:', error);
            showFeedback('Ocorreu um erro ao adicionar o carro.', 'error', form);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Adicionar Carro';
        }
    });
}

async function fetchCarDetails() {
    const detailsContainer = document.getElementById('car-details-container');
    if (!detailsContainer) return;

    const params = new URLSearchParams(window.location.search);
    const carId = params.get('id');

    if (!carId) {
        detailsContainer.innerHTML = '<p class="message">ID do carro não fornecido.</p>';
        return;
    }

    detailsContainer.innerHTML = '<div class="loader"></div>';

    try {
        const response = await fetch(`${API_URL}/${carId}`);
          if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Carro não encontrado.');
            }
            throw new Error(`Erro na API: ${response.statusText}`);
        }

        const car = await response.json();

        // Limpa o loader
        detailsContainer.innerHTML = '';

        // Cria os elementos de forma segura
        const carImage = document.createElement('img');
        carImage.src = car.imageUrl;
        carImage.alt = `${escapeHTML(car.brand)} ${escapeHTML(car.model)}`;
        carImage.style.maxWidth = '100%';
        carImage.style.borderRadius = '8px';

        const title = document.createElement('h2');
        title.textContent = `${escapeHTML(car.brand)} ${escapeHTML(car.model)}`;

        const carInfo = document.createElement('div');
        carInfo.innerHTML = `
            <p><strong>Ano:</strong> ${escapeHTML(String(car.year))}</p>
            <p><strong>Preço:</strong> R$ ${Number(car.price).toLocaleString('pt-BR')}</p>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.id = 'delete-button';
        deleteButton.textContent = 'Excluir Carro';
        deleteButton.addEventListener('click', () => deleteCar(carId));

        detailsContainer.append(carImage, title, carInfo, deleteButton);
    } catch (error) {
        detailsContainer.innerHTML = `<p class="message" style="color: red;">Falha ao carregar detalhes: ${error.message}</p>`;
        console.error('Erro ao buscar detalhes do carro:', error);
    }
}

async function deleteCar(id) {
    if (!confirm('Tem certeza que deseja excluir este carro?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Carro excluído com sucesso!');
            window.location.href = 'index.html';
        } else {
            alert('Falha ao excluir o carro.');
        }
    } catch (error) {
        console.error('Erro ao excluir carro:', error);
    }
}

/**
 * Lê um arquivo como Data URL (Base64).
 * @param {File} file O arquivo a ser lido.
 * @returns {Promise<string>} Uma promessa que resolve com a string Base64.
 */
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Exibe uma mensagem de feedback para o usuário.
 * @param {string} message A mensagem a ser exibida.
 * @param {'success' | 'error'} type O tipo de mensagem.
 * @param {HTMLElement} container O elemento onde a mensagem será inserida.
 */
function showFeedback(message, type, container) {
    let messageDiv = container.querySelector('.feedback-message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.className = 'message feedback-message';
        container.prepend(messageDiv);
    }
    messageDiv.textContent = message;
    messageDiv.style.color = type === 'error' ? 'red' : 'green';
}

/**
 * Escapa caracteres HTML para prevenir ataques XSS.
 * @param {string | number} str A string a ser escapada.
 * @returns {string} A string segura.
 */
function escapeHTML(str) {
    const p = document.createElement("p");
    p.textContent = String(str);
    return p.innerHTML;
}