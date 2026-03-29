const fs = require('fs');
const path = require('path');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

// Generate placeholder images using HTML5 Canvas
const { createCanvas } = require('canvas');

const projects = [
    {
        name: 'project1',
        title: 'E-commerce Platform',
        colors: ['#2563eb', '#1e40af']
    },
    {
        name: 'project2',
        title: 'Task Management App',
        colors: ['#10b981', '#059669']
    },
    {
        name: 'project3',
        title: 'AI Chat Application',
        colors: ['#8b5cf6', '#6d28d9']
    }
];

projects.forEach(project => {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, project.colors[0]);
    gradient.addColorStop(1, project.colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(project.title, 400, 300);

    // Save the image
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(path.join(assetsDir, `${project.name}.jpg`), buffer);
});
