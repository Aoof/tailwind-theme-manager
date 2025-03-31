# OKLCH Tailwind CSS Generator

An Express.js application that helps you generate Tailwind CSS classes from OKLCH color values. This tool makes it easier to work with OKLCH colors in Tailwind CSS projects.

## What is OKLCH?

OKLCH is a perceptually uniform color space that provides better color representation across different devices and better supports a wider color gamut. It's designed to be more perceptually uniform than traditional color spaces like RGB or HSL.

## Features

- Convert OKLCH colors to Tailwind CSS compatible formats
- Live preview of generated colors
- Generate complete Tailwind color palettes
- Easily copy generated code to clipboard

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

1. Enter OKLCH color values in the provided inputs
2. Adjust parameters as needed
3. Preview the generated colors
4. Copy the generated Tailwind CSS code to use in your project

## Development

To modify the SCSS files and compile them automatically:

```
npm run scss
```

## Technologies Used

- Express.js - Web application framework
- EJS - Templating engine
- colorjs.io - Color manipulation library
- Tailwind CSS - Utility-first CSS framework

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
