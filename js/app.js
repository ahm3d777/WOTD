// WordMaster - Comprehensive Vocabulary Learning Application
// Main Application Logic

class WordMasterApp {
    constructor() {
        this.words = [];
        this.favorites = this.loadFromStorage('favorites') || [];
        this.progress = this.loadFromStorage('progress') || {};
        this.currentView = 'all';
        this.searchQuery = '';
        this.filterCategory = 'all';
        this.filterDifficulty = 'all';
        this.darkMode = this.loadFromStorage('darkMode') || false;
        this.currentQuiz = null;
        this.itemsPerPage = 12;
        this.currentPage = 1;
        this.showWelcome = !this.loadFromStorage('welcomeDismissed');
        this.init();
    }

    async init() {
        this.showLoadingOverlay();
        await this.loadWords();
        this.setupEventListeners();
        this.applyDarkMode();
        this.renderDashboard();
        this.renderWords();
        this.updateStats();
        this.hideLoadingOverlay();
        if (this.showWelcome) {
            this.showWelcomeModal();
        }
    }

    // Data Loading
    async loadWords() {
        try {
            const response = await fetch('data/words.json');
            const data = await response.json();
            this.words = data.words;
            this.categories = data.categories;
            this.difficulties = data.difficulties;
        } catch (error) {
            console.error('Error loading words:', error);
            this.words = [];
        }
    }

    // Local Storage Management
    saveToStorage(key, data) {
        localStorage.setItem(`wordmaster_${key}`, JSON.stringify(data));
    }

    loadFromStorage(key) {
        const data = localStorage.getItem(`wordmaster_${key}`);
        return data ? JSON.parse(data) : null;
    }

    // Favorites Management
    toggleFavorite(wordId) {
        const index = this.favorites.indexOf(wordId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(wordId);
        }
        this.saveToStorage('favorites', this.favorites);
        this.renderWords();
        this.updateStats();
    }

    isFavorite(wordId) {
        return this.favorites.includes(wordId);
    }

    // Progress Tracking
    markAsLearned(wordId) {
        if (!this.progress[wordId]) {
            this.progress[wordId] = {
                learned: true,
                learnedDate: new Date().toISOString(),
                reviewCount: 1
            };
        } else {
            this.progress[wordId].reviewCount++;
            this.progress[wordId].lastReviewed = new Date().toISOString();
        }
        this.saveToStorage('progress', this.progress);
        this.updateStats();
    }

    isLearned(wordId) {
        return this.progress[wordId]?.learned || false;
    }

    // Filtering and Search
    getFilteredWords() {
        let filtered = this.words;

        // Apply view filter
        if (this.currentView === 'favorites') {
            filtered = filtered.filter(word => this.isFavorite(word.id));
        } else if (this.currentView === 'learned') {
            filtered = filtered.filter(word => this.isLearned(word.id));
        } else if (this.currentView === 'unlearned') {
            filtered = filtered.filter(word => !this.isLearned(word.id));
        }

        // Apply search
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(word =>
                word.word.toLowerCase().includes(query) ||
                word.definition.toLowerCase().includes(query) ||
                word.bengaliMeaning.toLowerCase().includes(query)
            );
        }

        // Apply category filter
        if (this.filterCategory !== 'all') {
            filtered = filtered.filter(word => word.category === this.filterCategory);
        }

        // Apply difficulty filter
        if (this.filterDifficulty !== 'all') {
            filtered = filtered.filter(word => word.difficulty === this.filterDifficulty);
        }

        return filtered;
    }

    // Rendering Methods
    renderWords() {
        const container = document.getElementById('wordsGrid');
        if (!container) return;

        const filtered = this.getFilteredWords();

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>No words found</h3>
                    <p>Try adjusting your filters or search query</p>
                </div>
            `;
            this.hidePagination();
            return;
        }

        // Calculate pagination
        const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedWords = filtered.slice(startIndex, endIndex);

        // Render words with fade-in animation
        container.innerHTML = paginatedWords.map((word, index) => {
            return `<div class="word-card-wrapper" style="animation-delay: ${index * 0.05}s">${this.createWordCard(word)}</div>`;
        }).join('');

        // Render pagination
        this.renderPagination(filtered.length, totalPages);

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    createWordCard(word) {
        const isFav = this.isFavorite(word.id);
        const isLearned = this.isLearned(word.id);

        return `
            <div class="word-card ${isLearned ? 'learned' : ''}" data-word-id="${word.id}">
                <div class="word-card-header">
                    <span class="word-badge ${word.difficulty}">${word.difficulty}</span>
                    <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="app.toggleFavorite(${word.id})">
                        ${isFav ? '★' : '☆'}
                    </button>
                </div>

                <h3 class="word-title">${word.word}</h3>
                <div class="pronunciation">${word.pronunciation}</div>
                <div class="part-of-speech">${word.partOfSpeech}</div>

                ${word.audioEn || word.audioBn ? `
                    <div class="audio-section">
                        ${word.audioEn ? `
                            <button class="pronunciation-button" onclick="app.playAudio('${word.audioEn}', this)">
                                🔊 English
                            </button>
                        ` : ''}
                        ${word.audioBn ? `
                            <button class="pronunciation-button" onclick="app.playAudio('${word.audioBn}', this)">
                                🔊 বাংলা
                            </button>
                        ` : ''}
                    </div>
                ` : ''}

                <div class="definition">
                    <div class="definition-label">Definition</div>
                    <div class="definition-text">${word.definition}</div>
                </div>

                ${word.example ? `
                    <div class="example">
                        <div class="example-label">Example</div>
                        <div class="example-text">"${word.example}"</div>
                    </div>
                ` : ''}

                <div class="bengali-meaning">
                    <div class="meaning-label">Bengali Meaning</div>
                    <div class="bengali-text">${word.bengaliMeaning}</div>
                </div>

                ${word.synonyms && word.synonyms.length > 0 ? `
                    <div class="synonyms">
                        <div class="syn-label">Synonyms:</div>
                        ${word.synonyms.map(syn => `<span class="syn-tag">${syn}</span>`).join('')}
                    </div>
                ` : ''}

                <div class="word-actions">
                    ${!isLearned ? `
                        <button class="action-btn learn-btn" onclick="app.markAsLearned(${word.id})">
                            ✓ Mark as Learned
                        </button>
                    ` : `
                        <div class="learned-badge">✓ Learned</div>
                    `}
                    <button class="action-btn share-btn" onclick="app.shareWord(${word.id})">
                        Share
                    </button>
                </div>
            </div>
        `;
    }

    renderDashboard() {
        const learnedCount = Object.keys(this.progress).length;
        const totalWords = this.words.length;
        const favoritesCount = this.favorites.length;
        const percentage = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;

        const statsSection = document.getElementById('statsSection');
        if (statsSection) {
            statsSection.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number">${totalWords}</span>
                        <span class="stat-label">Total Words</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${learnedCount}</span>
                        <span class="stat-label">Words Learned</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${favoritesCount}</span>
                        <span class="stat-label">Favorites</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${percentage}%</span>
                        <span class="stat-label">Progress</span>
                    </div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${percentage}%"></div>
                </div>
            `;
        }
    }

    updateStats() {
        this.renderDashboard();
    }

    // Audio Playback
    playAudio(audioPath, button) {
        // Stop all currently playing audio
        const allButtons = document.querySelectorAll('.pronunciation-button');
        allButtons.forEach(btn => {
            btn.classList.remove('playing');
        });

        button.classList.add('playing');

        const audio = new Audio(audioPath);

        audio.addEventListener('ended', () => {
            button.classList.remove('playing');
        });

        audio.addEventListener('error', () => {
            button.classList.remove('playing');
            this.showNotification('Audio file not available', 'error');
        });

        audio.play().catch(error => {
            button.classList.remove('playing');
            console.error('Audio playback failed:', error);
        });
    }

    // Dark Mode
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        this.saveToStorage('darkMode', this.darkMode);
        this.applyDarkMode();
    }

    applyDarkMode() {
        document.body.classList.toggle('dark-mode', this.darkMode);
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            toggle.textContent = this.darkMode ? '☀️' : '🌙';
        }
    }

    // View Management
    setView(view) {
        this.currentView = view;

        // Update active state of view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`)?.classList.add('active');

        this.renderWords();
    }

    // Search and Filters
    setSearchQuery(query) {
        this.searchQuery = query;
        this.renderWords();
    }

    setCategory(category) {
        this.filterCategory = category;
        this.renderWords();
    }

    setDifficulty(difficulty) {
        this.filterDifficulty = difficulty;
        this.renderWords();
    }

    // Quiz Mode
    startQuiz(type = 'random', count = 10) {
        const words = this.getFilteredWords();
        if (words.length === 0) {
            this.showNotification('No words available for quiz', 'error');
            return;
        }

        // Shuffle and select words
        const shuffled = words.sort(() => Math.random() - 0.5);
        const quizWords = shuffled.slice(0, Math.min(count, words.length));

        this.currentQuiz = {
            words: quizWords,
            currentIndex: 0,
            score: 0,
            answers: []
        };

        this.renderQuiz();
    }

    renderQuiz() {
        const quizContainer = document.getElementById('quizContainer');
        if (!quizContainer) return;

        const quiz = this.currentQuiz;
        const word = quiz.words[quiz.currentIndex];

        quizContainer.innerHTML = `
            <div class="quiz-header">
                <div class="quiz-progress">Question ${quiz.currentIndex + 1} of ${quiz.words.length}</div>
                <div class="quiz-score">Score: ${quiz.score}/${quiz.currentIndex}</div>
            </div>

            <div class="quiz-question">
                <h2>${word.word}</h2>
                <p class="quiz-pronunciation">${word.pronunciation}</p>
            </div>

            <div class="quiz-options">
                ${this.generateQuizOptions(word).map((option, index) => `
                    <button class="quiz-option" onclick="app.answerQuiz('${option}', '${word.definition}')">
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;

        quizContainer.style.display = 'block';
    }

    generateQuizOptions(correctWord) {
        const options = [correctWord.definition];
        const otherWords = this.words.filter(w => w.id !== correctWord.id);

        // Get 3 random wrong answers
        for (let i = 0; i < 3 && otherWords.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * otherWords.length);
            options.push(otherWords[randomIndex].definition);
            otherWords.splice(randomIndex, 1);
        }

        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    }

    answerQuiz(selected, correct) {
        const quiz = this.currentQuiz;
        const isCorrect = selected === correct;

        if (isCorrect) {
            quiz.score++;
            this.showNotification('Correct!', 'success');
        } else {
            this.showNotification('Incorrect. The correct answer was: ' + correct, 'error');
        }

        quiz.answers.push({ selected, correct, isCorrect });

        setTimeout(() => {
            quiz.currentIndex++;
            if (quiz.currentIndex < quiz.words.length) {
                this.renderQuiz();
            } else {
                this.endQuiz();
            }
        }, 1500);
    }

    endQuiz() {
        const quiz = this.currentQuiz;
        const percentage = Math.round((quiz.score / quiz.words.length) * 100);

        const quizContainer = document.getElementById('quizContainer');
        if (quizContainer) {
            quizContainer.innerHTML = `
                <div class="quiz-results">
                    <h2>Quiz Complete!</h2>
                    <div class="quiz-final-score">
                        <div class="score-circle">
                            <span class="score-percentage">${percentage}%</span>
                        </div>
                        <p>You scored ${quiz.score} out of ${quiz.words.length}</p>
                    </div>
                    <button class="action-btn primary" onclick="app.closeQuiz()">Close</button>
                    <button class="action-btn" onclick="app.startQuiz()">Try Again</button>
                </div>
            `;
        }
    }

    closeQuiz() {
        const quizContainer = document.getElementById('quizContainer');
        if (quizContainer) {
            quizContainer.style.display = 'none';
        }
        this.currentQuiz = null;
    }

    // Export Functionality
    exportProgress() {
        const data = {
            favorites: this.favorites,
            progress: this.progress,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wordmaster-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Progress exported successfully!', 'success');
    }

    exportWordList(format = 'txt') {
        const words = this.getFilteredWords();
        let content = '';

        if (format === 'txt') {
            content = words.map(w =>
                `${w.word} (${w.pronunciation})\n` +
                `Definition: ${w.definition}\n` +
                `Bengali: ${w.bengaliMeaning}\n` +
                `Example: ${w.example || 'N/A'}\n\n`
            ).join('---\n\n');
        } else if (format === 'csv') {
            content = 'Word,Pronunciation,Definition,Bengali Meaning,Part of Speech,Difficulty,Category\n';
            content += words.map(w =>
                `"${w.word}","${w.pronunciation}","${w.definition}","${w.bengaliMeaning}","${w.partOfSpeech}","${w.difficulty}","${w.category}"`
            ).join('\n');
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wordmaster-words-${new Date().toISOString().split('T')[0]}.${format}`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification(`Word list exported as ${format.toUpperCase()}!`, 'success');
    }

    // Share Functionality
    shareWord(wordId) {
        const word = this.words.find(w => w.id === wordId);
        if (!word) return;

        const shareText = `📚 Word of the Day: ${word.word}\n\n` +
            `Definition: ${word.definition}\n` +
            `Bengali: ${word.bengaliMeaning}\n\n` +
            `Learn more at WordMaster!`;

        if (navigator.share) {
            navigator.share({
                title: `Word: ${word.word}`,
                text: shareText
            }).catch(err => console.log('Share failed:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Word copied to clipboard!', 'success');
            });
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.setSearchQuery(e.target.value);
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.setCategory(e.target.value);
            });
        }

        // Difficulty filter
        const difficultyFilter = document.getElementById('difficultyFilter');
        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', (e) => {
                this.setDifficulty(e.target.value);
            });
        }

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

        // Date display
        this.updateDate();
    }

    updateDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const now = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    // Pagination Methods
    renderPagination(totalItems, totalPages) {
        const paginationContainer = document.getElementById('paginationContainer');
        if (!paginationContainer) return;

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        pages.push(`
            <button class="pagination-btn"
                    ${this.currentPage === 1 ? 'disabled' : ''}
                    onclick="app.goToPage(${this.currentPage - 1})">
                ← Previous
            </button>
        `);

        // First page
        if (startPage > 1) {
            pages.push(`
                <button class="pagination-btn" onclick="app.goToPage(1)">1</button>
            `);
            if (startPage > 2) {
                pages.push(`<span class="pagination-dots">...</span>`);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(`
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}"
                        onclick="app.goToPage(${i})">
                    ${i}
                </button>
            `);
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(`<span class="pagination-dots">...</span>`);
            }
            pages.push(`
                <button class="pagination-btn" onclick="app.goToPage(${totalPages})">${totalPages}</button>
            `);
        }

        // Next button
        pages.push(`
            <button class="pagination-btn"
                    ${this.currentPage === totalPages ? 'disabled' : ''}
                    onclick="app.goToPage(${this.currentPage + 1})">
                Next →
            </button>
        `);

        paginationContainer.innerHTML = `
            <div class="pagination-info">
                Showing ${((this.currentPage - 1) * this.itemsPerPage) + 1} - ${Math.min(this.currentPage * this.itemsPerPage, totalItems)} of ${totalItems} words
            </div>
            <div class="pagination-buttons">
                ${pages.join('')}
            </div>
        `;
    }

    hidePagination() {
        const paginationContainer = document.getElementById('paginationContainer');
        if (paginationContainer) {
            paginationContainer.style.display = 'none';
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderWords();
    }

    resetPagination() {
        this.currentPage = 1;
    }

    // Loading Overlay Methods
    showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }
    }

    // Welcome Modal
    showWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        if (!modal) {
            this.createWelcomeModal();
            return;
        }
        modal.style.display = 'flex';
    }

    createWelcomeModal() {
        const modalHTML = `
            <div id="welcomeModal" class="modal welcome-modal" style="display: flex;">
                <div class="modal-content welcome-content">
                    <div class="welcome-header">
                        <div class="welcome-logo">
                            <svg width="60" height="60" viewBox="0 0 60 60">
                                <rect width="60" height="60" rx="12" fill="url(#welcome-gradient)"/>
                                <text x="30" y="42" font-family="Inter" font-weight="700" font-size="30" fill="white" text-anchor="middle">W</text>
                                <defs>
                                    <linearGradient id="welcome-gradient" x1="0" y1="0" x2="60" y2="60">
                                        <stop offset="0%" stop-color="#667eea"/>
                                        <stop offset="100%" stop-color="#764ba2"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <h2>Welcome to WordMaster!</h2>
                        <p>Your journey to vocabulary excellence starts here</p>
                    </div>

                    <div class="welcome-features">
                        <div class="welcome-feature">
                            <div class="feature-icon">📚</div>
                            <h3>105+ Words</h3>
                            <p>Curated vocabulary across multiple categories and difficulty levels</p>
                        </div>
                        <div class="welcome-feature">
                            <div class="feature-icon">🎯</div>
                            <h3>Track Progress</h3>
                            <p>Mark words as learned and see your improvement over time</p>
                        </div>
                        <div class="welcome-feature">
                            <div class="feature-icon">⭐</div>
                            <h3>Favorites</h3>
                            <p>Bookmark important words for quick review</p>
                        </div>
                        <div class="welcome-feature">
                            <div class="feature-icon">🎓</div>
                            <h3>Quiz Mode</h3>
                            <p>Test your knowledge with interactive quizzes</p>
                        </div>
                    </div>

                    <div class="welcome-actions">
                        <button class="action-btn primary large-btn" onclick="app.dismissWelcome()">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    dismissWelcome() {
        const modal = document.getElementById('welcomeModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.saveToStorage('welcomeDismissed', true);
        this.showWelcome = false;
    }

    // Update view method to reset pagination
    setView(view) {
        this.currentView = view;

        // Update active state of view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`)?.classList.add('active');

        this.resetPagination();
        this.renderWords();
    }

    // Update search and filter methods to reset pagination
    setSearchQuery(query) {
        this.searchQuery = query;
        this.resetPagination();
        this.renderWords();
    }

    setCategory(category) {
        this.filterCategory = category;
        this.resetPagination();
        this.renderWords();
    }

    setDifficulty(difficulty) {
        this.filterDifficulty = difficulty;
        this.resetPagination();
        this.renderWords();
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new WordMasterApp();
});
