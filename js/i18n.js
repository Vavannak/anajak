// Internationalization Manager
class I18nManager {
    constructor() {
        this.currentLocale = localStorage.getItem('locale') || 'en';
        this.translations = {};
        this.loadTranslations();
    }
    
    async loadTranslations() {
        try {
            const response = await fetch(`/locales/${this.currentLocale}.json`);
            this.translations = await response.json();
            this.applyTranslations();
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    }
    
    t(key) {
        const keys = key.split('.');
        let value = this.translations;
        for (const k of keys) {
            value = value?.[k];
            if (!value) return key;
        }
        return value;
    }
    
    applyTranslations() {
        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation && translation !== key) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update document title
        const titleElement = document.querySelector('[data-i18n-title]');
        if (titleElement) {
            document.title = this.t(titleElement.getAttribute('data-i18n-title'));
        }
    }
    
    switchLocale(locale) {
        this.currentLocale = locale;
        localStorage.setItem('locale', locale);
        this.loadTranslations();
        // Reload page to refresh all content
        window.location.reload();
    }
}

const i18n = new I18nManager();

// Language switcher component
class LanguageSwitcher {
    constructor() {
        this.createSwitcher();
    }
    
    createSwitcher() {
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <button class="lang-btn ${i18n.currentLocale === 'en' ? 'active' : ''}" data-lang="en">
                <img src="https://flagcdn.com/w20/gb.png" alt="English"> EN
            </button>
            <button class="lang-btn ${i18n.currentLocale === 'km' ? 'active' : ''}" data-lang="km">
                <img src="https://flagcdn.com/w20/kh.png" alt="Khmer"> ខ្មែរ
            </button>
        `;
        
        document.querySelector('.nav-container').appendChild(switcher);
        
        switcher.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                i18n.switchLocale(lang);
            });
        });
    }
}

// Initialize language switcher when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSwitcher();
});
