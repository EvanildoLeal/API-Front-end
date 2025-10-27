Uma aplicação web interativa para explorar todos os personagens da série Rick and Morty através da API oficial.


##  Demonstração

**Acesse o projeto:** [GitHub Pages Link]  
**Responsivo:** Compatível com todos os dispositivos

##  Funcionalidades

### Principais
- *** Busca Avançada** - Encontre personagens por nome em tempo real
- *** Filtros Dinâmicos** - Filtre por status, espécie e gênero
- *** Estatísticas** - Métricas em tempo real dos personagens
- *** Paginação** - Navegação suave entre páginas
- *** Design Responsivo** - Experiência perfeita em todos os dispositivos

###  Experiência do Usuário
- *** Efeitos Parallax** - Backgrounds imersivos com rolagem
- *** Cards Interativos** - Hover effects e animações suaves
- *** Modal de Detalhes** - Informações completas dos personagens
- *** Loading States** - Feedback visual durante carregamentos
- *** Navegação por Teclado** - Acessibilidade com teclado

##  Tecnologias Utilizadas

| Tecnologia | Função |
|------------|--------|
| **HTML5** | Estrutura semântica e acessível |
| **CSS3** | Design system com variáveis e Grid/Flexbox |
| **JavaScript ES6+** | Lógica da aplicação e consumo de API |
| **Rick and Morty API** | Fonte de dados dos personagens |
| **Font Awesome** | Ícones e elementos visuais |


##  Sistema de Design

###  Cores
```css
:root {
    --primary-color: #1ed760;    /* Verde Rick and Morty */
    --secondary-color: #1a3c40;  /* Azul escuro */
    --background-color: #0a0e17; /* Fundo espacial */
    --text-color: #e0e0e0;      /* Texto principal */
}

Responsividade
Mobile First - Desenvolvimento focado em mobile

Breakpoints Estratégicos - 480px, 768px, 1200px

Grid Adaptativo - Layout que se adapta automaticamente

Como Executar
    - Instalação Local

    # Clone o repositório
git clone https://github.com/EvanildoLeal/API-Front-end.git

# Acesse a pasta do projeto
cd API-Front-end

# Abra no navegador
open index.html/
git pages/https://evanildoleal.github.io/API-Front-end/

Deploy
O projeto está pronto para deploy em qualquer serviço de hospedagem estática:

GitHub Pages

Netlify

Vercel

Firebase Hosting

 Estrutura de Desenvolvimento
 Branches Organizadas
main - Código estável e production-ready

feature/html-estrutura-completa - HTML semântico documentado

feature/css-design-sistema - Sistema de design completo

feature/javascript-logica-completa - Arquitetura JavaScript

feature/responsividade-performance - Otimizações responsivas

Padrões de Código
HTML - Estrutura semântica e acessível

CSS - BEM methodology e variáveis CSS

JavaScript - ES6+ com classes e async/await

Git - Conventional commits e branch strategy

API Utilizada
Rick and Morty API - https://rickandmortyapi.com/
// Exemplo de consumo da API
const response = await fetch('https://rickandmortyapi.com/api/character');
const data = await response.json();


Se este projeto te ajudou, deixe uma estrela no repositório!