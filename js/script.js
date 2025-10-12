// script.js
class RickAndMortyAPI {
    constructor() {
        this.baseURL = 'https://rickandmortyapi.com/api';
        this.currentPage = 1;
        this.totalPages = 1;
        this.currentFilters = {
            name: '',
            status: 'all',
            species: 'all',
            gender: 'all'
        };
        this.allCharacters = [];
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadCharacters();
    }

    initializeElements() {
        // Elementos DOM
        this.elements = {
            charactersContainer: document.getElementById('characters-container'),
            loadingElement: document.getElementById('loading'),
            paginationElement: document.getElementById('pagination'),
            prevPageButton: document.getElementById('prev-page'),
            nextPageButton: document.getElementById('next-page'),
            pageInfoElement: document.getElementById('page-info'),
            statusFilter: document.getElementById('status-filter'),
            speciesFilter: document.getElementById('species-filter'),
            genderFilter: document.getElementById('gender-filter'),
            searchInput: document.getElementById('search-input'),
            applyFiltersButton: document.getElementById('apply-filters'),
            resetFiltersButton: document.getElementById('reset-filters'),
            modal: document.getElementById('character-modal'),
            modalBody: document.getElementById('modal-body'),
            closeModal: document.querySelector('.close-modal'),
            stats: {
                total: document.getElementById('total-characters'),
                alive: document.getElementById('alive-characters'),
                dead: document.getElementById('dead-characters'),
                unknown: document.getElementById('unknown-characters')
            }
        };
    }

    setupEventListeners() {
        // Filtros
        this.elements.applyFiltersButton.addEventListener('click', () => this.applyFilters());
        this.elements.resetFiltersButton.addEventListener('click', () => this.resetFilters());
        
        // Busca em tempo real
        this.elements.searchInput.addEventListener('input', (e) => {
            this.currentFilters.name = e.target.value;
            this.debounce(() => this.applyFilters(), 500);
        });

        // Paginação
        this.elements.prevPageButton.addEventListener('click', () => this.changePage(this.currentPage - 1));
        this.elements.nextPageButton.addEventListener('click', () => this.changePage(this.currentPage + 1));

        // Modal
        this.elements.closeModal.addEventListener('click', () => this.closeModal());
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) this.closeModal();
        });

        // Teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    async loadCharacters() {
        this.showLoading();
        
        try {
            const response = await fetch(`${this.baseURL}/character`);
            const data = await response.json();
            
            this.allCharacters = data.results;
            this.totalPages = data.info.pages;
            this.updateStatistics();
            this.displayCharacters(this.allCharacters);
            
        } catch (error) {
            console.error('Erro ao carregar personagens:', error);
            this.showError('Erro ao carregar personagens. Tente novamente mais tarde.');
        } finally {
            this.hideLoading();
        }
    }

    async fetchCharacters(page = 1) {
        this.showLoading();
        
        try {
            let apiUrl = `${this.baseURL}/character/?page=${page}`;
            
            // Adicionar filtros
            const filters = Object.entries(this.currentFilters)
                .filter(([key, value]) => value && value !== 'all')
                .map(([key, value]) => `${key}=${value}`)
                .join('&');
            
            if (filters) apiUrl += `&${filters}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) throw new Error('Erro ao buscar dados da API');
            
            const data = await response.json();
            
            this.currentPage = page;
            this.totalPages = data.info.pages;
            this.updatePagination();
            this.updateStatistics(data.results);
            this.displayCharacters(data.results);
            
        } catch (error) {
            console.error('Erro:', error);
            this.showError('Erro ao carregar personagens. Tente novamente mais tarde.');
        } finally {
            this.hideLoading();
        }
    }

    displayCharacters(characters) {
        this.elements.charactersContainer.innerHTML = '';
        
        if (!characters || characters.length === 0) {
            this.elements.charactersContainer.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.2rem;">Nenhum personagem encontrado com os filtros selecionados.</p>
                </div>
            `;
            return;
        }
        
        characters.forEach(character => {
            const characterCard = this.createCharacterCard(character);
            this.elements.charactersContainer.appendChild(characterCard);
        });
    }

    createCharacterCard(character) {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.addEventListener('click', () => this.showCharacterDetails(character));
        
        const statusClass = `status-${character.status.toLowerCase()}`;
        
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}" class="character-image">
            <div class="character-info">
                <h3 class="character-name">${character.name}</h3>
                <div class="character-details">
                    <div class="detail-item">
                        <span class="status-indicator ${statusClass}"></span>
                        <span>${this.capitalizeFirst(character.status)} - ${character.species}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-venus-mars"></i>
                        <span>${this.capitalizeFirst(character.gender)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-globe"></i>
                        <span>${character.origin.name}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${character.location.name}</span>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    showCharacterDetails(character) {
        const statusClass = `status-${character.status.toLowerCase()}`;
        
        this.elements.modalBody.innerHTML = `
            <div class="modal-character">
                <img src="${character.image}" alt="${character.name}">
                <h3>${character.name}</h3>
                <div class="modal-details">
                    <div class="detail-item">
                        <span class="status-indicator ${statusClass}"></span>
                        <strong>Status:</strong> ${this.capitalizeFirst(character.status)}
                    </div>
                    <div class="detail-item">
                        <strong>Espécie:</strong> ${character.species}
                    </div>
                    <div class="detail-item">
                        <strong>Gênero:</strong> ${this.capitalizeFirst(character.gender)}
                    </div>
                    <div class="detail-item">
                        <strong>Origem:</strong> ${character.origin.name}
                    </div>
                    <div class="detail-item">
                        <strong>Localização:</strong> ${character.location.name}
                    </div>
                    <div class="detail-item">
                        <strong>Episódios:</strong> ${character.episode.length}
                    </div>
                    <div class="detail-item">
                        <strong>Criado em:</strong> ${new Date(character.created).toLocaleDateString('pt-BR')}
                    </div>
                </div>
            </div>
        `;
        
        this.elements.modal.style.display = 'block';
    }

    closeModal() {
        this.elements.modal.style.display = 'none';
    }

    applyFilters() {
        this.currentFilters = {
            name: this.elements.searchInput.value,
            status: this.elements.statusFilter.value,
            species: this.elements.speciesFilter.value,
            gender: this.elements.genderFilter.value
        };
        
        this.currentPage = 1;
        this.fetchCharacters(this.currentPage);
    }

    resetFilters() {
        this.elements.searchInput.value = '';
        this.elements.statusFilter.value = 'all';
        this.elements.speciesFilter.value = 'all';
        this.elements.genderFilter.value = 'all';
        
        this.currentFilters = {
            name: '',
            status: 'all',
            species: 'all',
            gender: 'all'
        };
        
        this.currentPage = 1;
        this.fetchCharacters(this.currentPage);
    }

    changePage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.fetchCharacters(page);
    }

    updatePagination() {
        this.elements.pageInfoElement.textContent = `Página ${this.currentPage} de ${this.totalPages}`;
        
        this.elements.prevPageButton.disabled = this.currentPage === 1;
        this.elements.nextPageButton.disabled = this.currentPage === this.totalPages;
        
        this.elements.paginationElement.style.display = this.totalPages <= 1 ? 'none' : 'flex';
    }

    updateStatistics(characters = null) {
        if (!characters) return;
        
        const stats = {
            total: characters.length,
            alive: characters.filter(c => c.status.toLowerCase() === 'alive').length,
            dead: characters.filter(c => c.status.toLowerCase() === 'dead').length,
            unknown: characters.filter(c => c.status.toLowerCase() === 'unknown').length
        };
        
        this.elements.stats.total.textContent = stats.total;
        this.elements.stats.alive.textContent = stats.alive;
        this.elements.stats.dead.textContent = stats.dead;
        this.elements.stats.unknown.textContent = stats.unknown;
    }

    showLoading() {
        this.elements.loadingElement.style.display = 'flex';
        this.elements.charactersContainer.style.display = 'none';
        this.elements.paginationElement.style.display = 'none';
    }

    hideLoading() {
        this.elements.loadingElement.style.display = 'none';
        this.elements.charactersContainer.style.display = 'grid';
        this.elements.paginationElement.style.display = this.totalPages > 1 ? 'flex' : 'none';
    }

    showError(message) {
        this.elements.charactersContainer.innerHTML = `
            <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--danger-color); margin-bottom: 1rem;"></i>
                <p style="font-size: 1.2rem;">${message}</p>
            </div>
        `;
    }

    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    debounce(func, wait) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(func, wait);
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new RickAndMortyAPI();
});