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
        toast.className = `toast ${type.toLowerCase()}`;
        
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-title">${type}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="ToastManager.closeToast('${toastId}')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            this.closeToast(toastId);
        }, 5000);
    },

    closeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.style.animation = 'fade-out 0.3s forwards';
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
    
    // Default colors (standard Tailwind colors in OKLCH format)
    defaultColorsText: `
  --background: oklch(0.14 0.01 18.4);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.208 0.042 265.755);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.984 0.003 247.858);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.208 0.042 265.755);
  --sidebar-foreground: oklch(0.984 0.003 247.858);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.279 0.041 260.031);
  --sidebar-accent-foreground: oklch(0.984 0.003 247.858);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.551 0.027 264.364);
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
        
        // Set up color picker modal buttons
        document.getElementById('cancel-color').addEventListener('click', () => {
            document.getElementById('color-picker-modal').style.display = 'none';
        });
        
        document.getElementById('apply-color').addEventListener('click', async () => {
            if (!this.currentVariable) return;

            const oklchColor = document.getElementById('oklch-input').value;
            await this.applyColor(this.currentVariable, oklchColor);

            document.getElementById('color-picker-modal').style.display = 'none';
        });
        
        // Initialize color picker
        this.initColorPicker();
    },
    
    initColorPicker() {
        this.colorPicker = Pickr.create({
            el: '#color-picker',
            theme: 'classic',
            default: '#ffffff',
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
                    hsla: true,
                    input: true,
                    clear: false,
                    save: false
                }
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
    
    updateColorDisplay() {
        // Update the CSS output textarea
        document.querySelector('textarea[readonly]').value = ColorUtils.formatCssVariables(this.colorVars);
        
        // Clear existing color variables
        const container = document.getElementById('color-variables-container');
        container.innerHTML = '';
        
        // Add color variable items
        for (const variable in this.colorVars) {
            const itemDiv = document.createElement('div');
            itemDiv.id = `${variable}-container`;
            itemDiv.className = 'color-item flex flex-col gap-2 p-3 border rounded-md dark:border-gray-700';
            
            const hexColor = ColorUtils.convertOklchToRgb(this.colorVars[variable]);
            
            itemDiv.innerHTML = `
                <label class="font-medium">${variable}</label>
                <div class="flex items-center gap-2">
                    <input type="color" id="${variable}-color" value="${hexColor}" data-oklch="${this.colorVars[variable]}" 
                        class="w-12 h-12 rounded cursor-pointer border dark:border-gray-600">
                    <input type="text" id="${variable}-value" value="${this.colorVars[variable]}" readonly
                        class="flex-grow px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <button onclick="ThemeManager.updateColor('${variable}')" 
                        class="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
                        Update
                    </button>
                </div>
            `;
            
            container.appendChild(itemDiv);
        }
        
        // Set up previous colors and event listeners
        const colorItems = document.querySelectorAll('.color-item');
        colorItems.forEach(item => {
            const colorInput = item.querySelector('input[type="color"]');
            const oklchValue = colorInput.dataset.oklch;
            const varName = colorInput.id.replace('-color', '');
            
            this.previousColors[varName] = oklchValue;
            
            colorInput.addEventListener('click', (e) => {
                e.preventDefault();
                const variableName = e.target.id.replace('-color', '');
                this.updateColor(variableName);
            });
        });
    },

    async applyColor(variable, oklchColor) {
        try {
            const colorInput = document.getElementById(`${variable}-color`);
            const valueInput = document.getElementById(`${variable}-value`);
            const previousColor = valueInput.value;

            this.previousColors[variable] = previousColor;

            valueInput.value = oklchColor;
            colorInput.value = ColorUtils.convertOklchToRgb(oklchColor);
            
            // Update the colorVars object
            this.colorVars[variable] = oklchColor;

            const prevHexColor = ColorUtils.convertOklchToRgb(previousColor);
            document.getElementById('previous-color').style.backgroundColor = prevHexColor;
            document.getElementById('color-preview').style.backgroundColor = ColorUtils.convertOklchToRgb(oklchColor);

            const container = document.getElementById(`${variable}-container`);
            container.classList.add('color-updated');
            setTimeout(() => container.classList.remove('color-updated'), 500);
            
            // Update the CSS output textarea
            document.querySelector('textarea[readonly]').value = ColorUtils.formatCssVariables(this.colorVars);

            ToastManager.showToast(`Color "${variable}" updated successfully.`, 'Success');
        } catch (error) {
            console.error('Error applying color:', error);
            ToastManager.showToast('Failed to apply color. Please try again.', 'Error');
        }
    },

    updateColor(variable) {
        this.currentVariable = variable;
        const colorInput = document.getElementById(variable + '-color');
        const colorValue = document.getElementById(variable + '-value');

        const hexValue = colorInput.value;
        const oklchValue = colorValue.value;

        document.getElementById('color-preview').style.backgroundColor = hexValue;
        const prevColor = this.previousColors[variable] || oklchValue;
        document.getElementById('previous-color').style.backgroundColor = ColorUtils.convertOklchToRgb(prevColor);

        this.colorPicker.setColor(hexValue);
        document.getElementById('hex-input').value = hexValue;
        document.getElementById('oklch-input').value = oklchValue;

        document.getElementById('color-picker-modal').style.display = 'flex';
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
