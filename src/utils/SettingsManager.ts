export class SettingsManager {
    private static instance: SettingsManager;
    private readonly STORAGE_KEY = 'portfolio_settings_v1';

    public state: {
        theme: 'dark' | 'light';
        sidebarCollapsed: boolean;
        animationsEnabled: boolean;
        reducedMotion: boolean;
    };

    private constructor() {
        this.state = this.loadState();
        this.applySettings();
    }

    public static getInstance(): SettingsManager {
        if (!SettingsManager.instance) {
            SettingsManager.instance = new SettingsManager();
        }
        return SettingsManager.instance;
    }

    private loadState() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            return saved ? JSON.parse(saved) : this.getDefaults();
        } catch (e) {
            console.warn('Failed to load settings:', e);
            return this.getDefaults();
        }
    }

    private getDefaults() {
        return {
            theme: 'dark' as const,
            sidebarCollapsed: false,
            animationsEnabled: true,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
    }

    public saveState() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
            this.applySettings();
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }

    public update(key: keyof typeof this.state, value: any) {
        // Type safety check could go here
        (this.state as any)[key] = value;
        this.saveState();
    }

    private applySettings() {
        const doc = document.documentElement;

        // Apply Theme
        if (this.state.theme === 'light') {
            doc.classList.add('theme-light');
        } else {
            doc.classList.remove('theme-light');
        }

        // Sidebar State handled by Sidebar Component observing this, 
        // but we can toggle a global class for layout adjustment
        if (this.state.sidebarCollapsed) {
            document.body.classList.add('sidebar-collapsed');
        } else {
            document.body.classList.remove('sidebar-collapsed');
        }

        // Animations State
        if (!this.state.animationsEnabled) {
            doc.classList.add('animations-disabled');
        } else {
            doc.classList.remove('animations-disabled');
        }
    }
}
