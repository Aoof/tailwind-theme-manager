# OKLCH Tailwind CSS Theme Manager

An Express.js application that helps you generate Tailwind CSS themes from OKLCH color values. This tool simplifies working with OKLCH colors in Tailwind CSS projects, allowing you to create and manage custom themes easily.

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

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/aoof/oklch-tailwind.git
   cd oklch-tailwind
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1.  **Enter OKLCH color values**: Input your desired OKLCH color values in the provided fields.
2.  **Adjust parameters**: Modify the color parameters as needed to fine-tune your theme.
3.  **Preview colors**: See a live preview of the generated colors.
4.  **Save/Load Themes**: Save your theme to a `.css` file or load an existing theme from a `.css` file.
5.  **Copy code**: Copy the generated Tailwind CSS code to use in your project.

## Technologies Used

-   Express.js - Web application framework
-   EJS - Templating engine
-   [colorjs.io](https://colorjs.io/) - Color manipulation library
-   Tailwind CSS - Utility-first CSS framework

## Project Structure

```
tailwind-theme-manager/
├── public/
│   ├── css/
│   │   └── styles.css          # Main CSS file
│   ├── js/
│   │   ├── app.js              # Main application logic
│   │   ├── color-utils.js      # Color conversion utilities
│   │   ├── toast.js            # Toast notification logic
│   │   └── file-utils.js       # File operation utilities
│   ├── index.html              # Main HTML file
├── views/
│   ├── index.ejs               # EJS template file
├── app.js                      # Express application
├── package.json                # Project dependencies
├── README.md                   # Documentation
└── ...
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
