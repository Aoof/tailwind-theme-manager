# OKLCH Tailwind CSS Theme Manager

An interactive web application that helps you generate Tailwind CSS themes from OKLCH color values. This tool simplifies working with OKLCH colors in Tailwind CSS projects, allowing you to create and manage custom themes easily.

## What is OKLCH?

OKLCH is a perceptually uniform color space that offers better color representation across different devices and supports a wider color gamut. It's designed to be more perceptually uniform than traditional color spaces like RGB or HSL.

## Features

- Convert OKLCH colors to Tailwind CSS compatible formats
- Live preview of generated colors
- Generate and manage complete Tailwind color palettes
- Import and export themes as CSS files
- Easily copy generated code to clipboard
- Theme persistence using local storage
- Dark/Light mode toggle

## Live Demo

Visit the live demo at [GitHub Pages](https://aoof.github.io/tailwind-theme-manager/).

## Local Development

1. Clone this repository:
   ```
   git clone https://github.com/aoof/tailwind-theme-manager.git
   cd tailwind-theme-manager
   ```

2. Open `index.html` in your browser to use the application locally.

## Usage

1. **Enter OKLCH color values**: Click on any color in the list to open the color picker.
2. **Adjust colors**: Use the color picker to select colors or directly input OKLCH or HEX values.
3. **Preview colors**: See a live preview of your selected colors alongside the previous values.
4. **Save/Load Themes**: Save your theme to a `.css` file or load an existing theme from a `.css` file.
5. **Copy code**: Copy the generated CSS variables to use in your project.

## Project Structure

```
tailwind-theme-manager/
├── css/
│   └── styles.css              # Main CSS file
├── js/
│   ├── app.js                  # Main application logic
│   ├── color-utils.js          # Color conversion utilities
│   ├── toast.js                # Toast notification logic
│   └── file-utils.js           # File operation utilities
├── index.html                  # Main HTML file
├── README.md                   # Documentation
└── ...
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
