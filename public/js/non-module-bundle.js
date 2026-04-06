/**
 * This file bundles all module functionality into a non-module context
 * to avoid issues with ES module loading from the file system.
 */

// Color Utilities
const ColorUtils = {
    convertOklchToRgb(oklchString) {
        try {
            const color = new Color(oklchString);
            return color.to("srgb").toString({format: "hex"});
        } catch (error) {
            console.error('Error converting OKLCH to RGB:', error);
            return '#ffffff';
        }
    },
    
    convertRgbToOklch(hexColor) {
        try {
            const color = new Color(hexColor);
            return color.to("oklch").toString();
        } catch (error) {
            console.error('Error converting RGB to OKLCH:', error);
            return 'oklch(1 0 0)';
        }
    },

    parseCssVariableBlock(text) {
        const parsedVars = {};
        const lines = text.split('\n');
        for (const line of lines) {
            const match = line.trim().match(/^--([\w-]+)\s*:\s*(.+?)\s*;?$/);
            if (match) {
                const name = match[1].trim();
                const value = match[2].trim();
                parsedVars[name] = value;
            }
        }
        return parsedVars;
    },

    formatCssVariables(varsDict) {
        const lines = [":root {"];
        const sortedKeys = Object.keys(varsDict).sort();
        for (const name of sortedKeys) {
            const value = varsDict[name];
            lines.push(`  --${name}: ${value};`);
        }
        lines.push("}");
        return lines.join('\n');
    },

    getContrastColor(oklchColor) {
        try {
            const color = new Color(oklchColor);
            const l = color.oklch.l; // Lightness is 0-1
            return l > 0.6 ? 'oklch(0.2 0.01 267)' : 'oklch(0.98 0.01 267)';
        } catch (error) {
            return 'oklch(0 0 0)';
        }
    },

    generatePalette(baseHue = Math.floor(Math.random() * 360)) {
        return {
            'white': 'oklch(100% 0 none)',
            'black': 'oklch(0% 0 none)',
            'dark': `oklch(14% 0.01 ${baseHue})`,
            'surface': `oklch(18% 0.012 ${baseHue})`,
            'surface-2': `oklch(22% 0.015 ${baseHue})`,
            'primary': `oklch(65% 0.18 ${baseHue})`,
            'primary-dim': `oklch(55% 0.15 ${baseHue})`,
            'primary-muted': `oklch(65% 0.18 ${baseHue} / 15%)`,
            'secondary': `oklch(75% 0.12 ${(baseHue + 120) % 360})`,
            'secondary-dim': `oklch(60% 0.1 ${(baseHue + 120) % 360})`,
            'high': `oklch(65% 0.22 25)`,
            'high-bg': `oklch(65% 0.22 25 / 15%)`,
            'medium': `oklch(75% 0.18 55)`,
            'medium-bg': `oklch(75% 0.18 55 / 15%)`,
            'low': `oklch(70% 0.18 145)`,
            'low-bg': `oklch(70% 0.18 145 / 15%)`,
            'clear': `oklch(65% 0.12 220)`,
            'clear-bg': `oklch(65% 0.12 220 / 15%)`,
        };
    }
};

// Toast Manager
const ToastManager = {
    showToast(message, type = 'Info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            console.error('Toast container not found');
            return;
        }
        
        const toastId = 'toast-' + Date.now();
        
        const toast = document.createElement('div');
        toast.id = toastId;
        
        // Define icons based on type
        const icons = {
            'Success': '<svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
            'Error': '<svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
            'Info': '<svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };

        toast.className = `flex items-center gap-4 p-4 mb-3 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl shadow-zinc-200/50 dark:shadow-none transform transition-all duration-300 translate-x-12 opacity-0`;
        
        toast.innerHTML = `
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800">
                ${icons[type] || icons['Info']}
            </div>
            <div class="flex-grow">
                <div class="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-0.5">${type}</div>
                <div class="text-sm font-bold text-zinc-700 dark:text-zinc-200">${message}</div>
            </div>
            <button class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onclick="ToastManager.closeToast('${toastId}')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        });
        
        setTimeout(() => {
            this.closeToast(toastId);
        }, 5000);
    },

    closeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.style.transform = 'translateX(12px)';
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }
};

// File Utilities
const FileUtils = {
    async downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/css' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    },

    openFileDialog(onFileLoaded) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.css';
        
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof onFileLoaded === 'function') {
                    onFileLoaded(e.target.result, file.name);
                }
            };
            
            reader.readAsText(file);
        });
        
        fileInput.click();
    }
};

// Theme Manager
const ThemeManager = {
    // State variables
    colorVars: {},
    colorPicker: null,
    currentVariable: null,
    previousColors: {},
    debounceTimer: null,
    
    // Default colors (Colour scheme in OKLCH format)
    defaultColorsText: `
    --color-white: oklch(100% 0 none);
    --color-black: oklch(0 0 none);

    --color-dark:        oklch(14% 0.008 267);
    --color-surface:     oklch(18% 0.010 267);
    --color-surface-2:   oklch(22% 0.012 267);

    --color-primary:     oklch(68% 0.18 47);
    --color-primary-dim: oklch(52% 0.14 47);
    --color-primary-muted: oklch(68% 0.18 47 / 15%);

    --color-high:        oklch(60% 0.22 25);
    --color-high-bg:     oklch(60% 0.22 25 / 15%);
    --color-medium:      oklch(72% 0.18 55);
    --color-medium-bg:   oklch(72% 0.18 55 / 15%);
    --color-low:         oklch(68% 0.18 145);
    --color-low-bg:      oklch(68% 0.18 145 / 15%);
    --color-clear:       oklch(60% 0.12 220);
    --color-clear-bg:    oklch(60% 0.12 220 / 15%);

    --color-secondary:     oklch(84.773% 0.04151 290.07);
    --color-secondary-dim: oklch(54.399% 0.02203 276.04);
  `,

    init() {
        this.loadColorsFromStorage();
        this.setupEventListeners();
        this.updateColorDisplay();
        
        // Check if color library loaded
        if (typeof Color === 'undefined') {
            console.error('Color library not loaded correctly');
            ToastManager.showToast('Color library failed to load. Some features may not work correctly.', 'Error');
        } else {
            console.log('Color library loaded successfully');
        }
    },

    setupEventListeners() {
        // Set up theme toggle button
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        
        // Set up save button
        document.getElementById('save-button').addEventListener('click', (e) => {
            e.preventDefault();
            this.saveColors();
        });
        
        // Set up load button
        document.getElementById('load-button').addEventListener('click', (e) => {
            e.preventDefault();
            this.loadColorsFromFile();
        });

        // Set up Generate Palette button
        const genBtn = document.getElementById('generate-palette');
        if (genBtn) {
            genBtn.addEventListener('click', () => {
                const newPalette = ColorUtils.generatePalette();
                this.colorVars = newPalette;
                this.updateColorDisplay();
                ToastManager.showToast('Generated new high-quality palette!', 'Success');
            });
        }

        // Set up CSS output dynamic updates
        const outputArea = document.getElementById('css-output');
        if (outputArea) {
            outputArea.addEventListener('input', (e) => {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    const parsed = ColorUtils.parseCssVariableBlock(e.target.value);
                    if (Object.keys(parsed).length > 0) {
                        this.colorVars = parsed;
                        this.updateColorDisplay(false);
                        ToastManager.showToast('Colors updated from text area.', 'Info');
                    }
                }, 800);
            });
        }

        // Set up Regenerate All button
        const regenBtn = document.getElementById('regenerate-button');
        if (regenBtn) {
            regenBtn.addEventListener('click', () => {
                this.updateColorDisplay();
            });
        }

        // Palette Export as Image functionality
        const exportBtn = document.getElementById('export-image');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportPaletteToImage();
            });
        }
        
        // Set up color picker modal buttons
        document.getElementById('cancel-color').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('apply-color').addEventListener('click', async () => {
            if (!this.currentVariable) return;

            const oklchColor = document.getElementById('oklch-input').value;
            await this.applyColor(this.currentVariable, oklchColor);

            this.closeModal();
        });
        
        // Close modal on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });

        // Close modal on backdrop click
        document.getElementById('color-picker-modal').addEventListener('click', (e) => {
            if (e.target.id === 'color-picker-modal') this.closeModal();
        });

        // Initialize color picker
        this.initColorPicker();
    },

    closeModal() {
        const modal = document.getElementById('color-picker-modal');
        const content = document.getElementById('color-picker-content');
        content.classList.replace('scale-100', 'scale-95');
        content.classList.replace('opacity-100', 'opacity-0');
        setTimeout(() => {
            modal.classList.replace('flex', 'hidden');
        }, 300);
    },
    
    initColorPicker() {
        // Find if we are currently in dark mode to suggest themes for the picker
        const isDark = document.documentElement.classList.contains('dark');
        
        this.colorPicker = Pickr.create({
            el: '#color-picker',
            theme: 'classic',
            default: '#ffffff',
            // Specify the app container for theme management context
            appClass: isDark ? 'pcr-dark' : 'pcr-light',
            swatches: [
                '#f44336', '#E91E63', '#9C27B0', '#673AB7',
                '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
                '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
                '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
            ],
            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: false,
                    input: true,
                    clear: false,
                    save: true
                }
            }
        });

        // Sync Pickr classes when theme toggles
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const currentDark = document.documentElement.classList.contains('dark');
            const pcrApp = document.querySelector('.pcr-app');
            if (pcrApp) {
                // Pickr usually detaches the app to the body, so we manually handle its theme
                pcrApp.classList.toggle('pcr-dark', currentDark);
            }
        });
        
        this.colorPicker.on('change', (color) => {
            const hexColor = color.toHEXA().toString();
            document.getElementById('hex-input').value = hexColor;
            document.getElementById('oklch-input').value = ColorUtils.convertRgbToOklch(hexColor);
            document.getElementById('color-preview').style.backgroundColor = hexColor;
        });
        
        document.getElementById('hex-input').addEventListener('input', function() {
            try {
                ThemeManager.colorPicker.setColor(this.value);
                document.getElementById('oklch-input').value = ColorUtils.convertRgbToOklch(this.value);
                document.getElementById('color-preview').style.backgroundColor = this.value;
            } catch (e) {
                console.error('Invalid hex color format:', e);
            }
        });
        
        document.getElementById('oklch-input').addEventListener('input', function() {
            try {
                const hexColor = ColorUtils.convertOklchToRgb(this.value);
                if (hexColor) {
                    ThemeManager.colorPicker.setColor(hexColor);
                    document.getElementById('hex-input').value = hexColor;
                    document.getElementById('color-preview').style.backgroundColor = hexColor;
                }
            } catch (e) {
                console.error('Invalid OKLCH color format:', e);
            }
        });
    },

    loadColorsFromStorage() {
        let savedColors = localStorage.getItem('colorVars');
        const savedFilename = localStorage.getItem('filename');
    
        if (savedColors) {
            try {
                savedColors = JSON.parse(savedColors);
                if (typeof savedColors === 'object' && savedColors !== null) {
                    this.colorVars = savedColors;
                } else {
                    this.colorVars = ColorUtils.parseCssVariableBlock(this.defaultColorsText);
                    console.warn('Invalid colorVars in localStorage, using default colors.');
                }
            } catch (e) {
                console.error('Error parsing colorVars from localStorage:', e);
                this.colorVars = ColorUtils.parseCssVariableBlock(this.defaultColorsText);
            }
        } else {
            this.colorVars = ColorUtils.parseCssVariableBlock(this.defaultColorsText);
        }
        
        if (savedFilename) {
            document.querySelector('input[name="filepath"]').value = savedFilename;
        }
        
        // Apply theme from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark');
        }
    },

    async saveColors() {
        const cssContent = document.querySelector('textarea[readonly]').value;
        const filename = document.querySelector('input[name="filepath"]').value || 'oklch_colors.css';
        
        await FileUtils.downloadFile(cssContent, filename);
        ToastManager.showToast(`File "${filename}" is ready for download.`, 'Success');
        
        // Save to local storage for persistence
        localStorage.setItem('colorVars', JSON.stringify(this.colorVars));
        localStorage.setItem('filename', filename);
    },
    
    loadColorsFromFile() {
        FileUtils.openFileDialog((content, filename) => {
            this.colorVars = ColorUtils.parseCssVariableBlock(content);
            document.querySelector('input[name="filepath"]').value = filename;
            this.updateColorDisplay();
            ToastManager.showToast(`File "${filename}" loaded successfully.`, 'Success');
        });
    },
    
    updateColorDisplay(updateTextArea = true) {
        // Update the CSS output textarea
        if (updateTextArea) {
            const outputArea = document.getElementById('css-output');
            if (outputArea) {
                outputArea.value = ColorUtils.formatCssVariables(this.colorVars);
            }
        }
        
        // Clear existing color variables
        const container = document.getElementById('color-variables-container');
        container.innerHTML = '';
        
        // Add color variable items
        for (const variable in this.colorVars) {
            const itemDiv = document.createElement('div');
            itemDiv.id = `${variable}-container`;
            itemDiv.className = 'group relative flex flex-col gap-4 p-5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-indigo-500/50 dark:hover:border-indigo-400/30 transition-all duration-300';
            
            const oklchValue = this.colorVars[variable];
            const hexColor = ColorUtils.convertOklchToRgb(oklchValue);
            const contrastColor = ColorUtils.getContrastColor(oklchValue);
            const contrastHex = ColorUtils.convertOklchToRgb(contrastColor);
            
            itemDiv.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex flex-col">
                        <label class="font-bold text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">${variable.replace('--color-', '')}</label>
                        <span class="text-lg font-black font-mono text-zinc-800 dark:text-zinc-200 truncate max-w-[140px]">${hexColor.toUpperCase()}</span>
                    </div>
                    <div class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter" 
                         style="background-color: ${hexColor}; color: ${contrastHex};">
                         System
                    </div>
                </div>
                
                <div class="relative h-24 w-full rounded-xl overflow-hidden cursor-pointer shadow-inner border border-zinc-200/50 dark:border-white/5"
                     style="background-color: ${hexColor};"
                     onclick="ThemeManager.updateColor('${variable}')">
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[2px]">
                        <span class="bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl">Edit Color</span>
                    </div>
                    <div class="absolute bottom-3 right-3 select-none pointer-events-none">
                         <span style="color: ${contrastHex};" class="text-2xl font-black opacity-40">Aa</span>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <input type="text" id="${variable}-value" value="${oklchValue}" readonly
                        class="flex-grow px-3 py-2 text-[10px] font-mono border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 focus:outline-none">
                    <button onclick="ThemeManager.updateColor('${variable}')" 
                        class="p-2 bg-white dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                    </button>
                </div>
            `;
            
            container.appendChild(itemDiv);
        }
        
        // Update previous colors
        for (const variable in this.colorVars) {
            this.previousColors[variable] = this.colorVars[variable];
        }
    },

    async applyColor(variable, oklchColor) {
        try {
            const previousColor = this.colorVars[variable];
            this.previousColors[variable] = previousColor;
            this.colorVars[variable] = oklchColor;

            this.updateColorDisplay();

            const prevHexColor = ColorUtils.convertOklchToRgb(previousColor);
            document.getElementById('previous-color').style.backgroundColor = prevHexColor;
            document.getElementById('color-preview').style.backgroundColor = ColorUtils.convertOklchToRgb(oklchColor);

            const container = document.getElementById(`${variable}-container`);
            if (container) {
                container.classList.add('color-updated');
                setTimeout(() => container.classList.remove('color-updated'), 500);
            }

            ToastManager.showToast(`Color "${variable}" updated successfully.`, 'Success');
        } catch (error) {
            console.error('Error applying color:', error);
            ToastManager.showToast('Failed to apply color. Please try again.', 'Error');
        }
    },

    updateColor(variable) {
        this.currentVariable = variable;
        const oklchValue = this.colorVars[variable];
        const hexValue = ColorUtils.convertOklchToRgb(oklchValue);

        document.getElementById('color-preview').style.backgroundColor = hexValue;
        const prevColor = this.previousColors[variable] || oklchValue;
        document.getElementById('previous-color').style.backgroundColor = ColorUtils.convertOklchToRgb(prevColor);

        this.colorPicker.setColor(hexValue);
        document.getElementById('hex-input').value = hexValue;
        document.getElementById('oklch-input').value = oklchValue;

        const modal = document.getElementById('color-picker-modal');
        const content = document.getElementById('color-picker-content');
        modal.classList.replace('hidden', 'flex');
        requestAnimationFrame(() => {
            content.classList.replace('scale-95', 'scale-100');
            content.classList.replace('opacity-0', 'opacity-100');
        });
    },

    exportPaletteToImage() {
        const vars = Object.keys(this.colorVars);
        if (vars.length === 0) {
            ToastManager.showToast('No colors to export.', 'Error');
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Define Grid Layout (e.g., 3 columns)
        const columns = 3;
        const rows = Math.ceil(vars.length / columns);
        const swatchSize = 250; // Square swatches
        
        canvas.width = columns * swatchSize;
        canvas.height = rows * swatchSize;

        vars.forEach((name, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            
            const x = col * swatchSize;
            const y = row * swatchSize;
            
            const colorValue = this.colorVars[name];
            const hex = ColorUtils.convertOklchToRgb(colorValue);
            const contrastHex = ColorUtils.convertOklchToRgb(ColorUtils.getContrastColor(colorValue));

            // Background
            ctx.fillStyle = hex;
            ctx.fillRect(x, y, swatchSize, swatchSize);

            // Text
            ctx.fillStyle = contrastHex;
            ctx.textAlign = 'center';
            
            // Variable Name
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText(name, x + (swatchSize / 2), y + (swatchSize / 2) - 15);
            
            // Hex Value
            ctx.font = 'bold 20px monospace';
            ctx.fillText(hex.toUpperCase(), x + (swatchSize / 2), y + (swatchSize / 2) + 15);

            // Large Preview Character
            ctx.font = '900 84px sans-serif';
            ctx.globalAlpha = 0.1;
            ctx.fillText('Aa', x + (swatchSize / 2), y + (swatchSize / 2) + 10);
            ctx.globalAlpha = 1.0;
        });

        const link = document.createElement('a');
        link.download = `palette-grid-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        ToastManager.showToast('Grid palette exported successfully.', 'Success');
    }
};

// Make utilities available globally
window.ToastManager = ToastManager;
window.ColorUtils = ColorUtils;
window.FileUtils = FileUtils;
window.ThemeManager = ThemeManager;

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});
