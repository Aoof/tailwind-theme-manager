const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const defaultColorsText = `
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
`;

// --- Utility functions (adapted from Python) ---
function parseCssVariableBlock(text) {
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
}

function formatCssVariables(varsDict) {
    const lines = [":root {"];
    const sortedKeys = Object.keys(varsDict).sort();
    for (const name of sortedKeys) {
        const value = varsDict[name];
        lines.push(`  --${name}: ${value};`);
    }
    lines.push("}");
    return lines.join('\n');
}

let colorVars = parseCssVariableBlock(defaultColorsText);
let currentFilepath = null;

app.get('/js/color.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/node_modules/colorjs.io/dist/color.global.min.js');
});

app.get('/', (req, res) => {
    res.render('index', {
        colors: colorVars,
        formattedColors: formatCssVariables(colorVars),
        filepath: currentFilepath
    });
});

app.post('/update-color', (req, res) => {
    const { variable, color } = req.body;
    colorVars[variable] = color;
    res.redirect('/');
});

app.post('/save', (req, res) => {
    const cssContent = req.body.cssContent;
    const filepath = req.body.filepath;

    fs.writeFile(filepath, cssContent, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving file.');
        }
        currentFilepath = filepath;
        colorVars = parseCssVariableBlock(cssContent);
        res.redirect('/');
    });
});

app.post('/load', (req, res) => {
    const filepath = req.body.filepath;

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error loading file.');
        }
        colorVars = parseCssVariableBlock(data);
        currentFilepath = filepath;
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
