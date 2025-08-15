#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Generate static HTML from the built Angular application
 */
async function generateStaticHTML() {
    console.log('🚀 Starting static HTML generation...');
    
    try {
        // Check if puppeteer is installed
        try {
            require('puppeteer');
        } catch (e) {
            console.log('📦 Installing Puppeteer...');
            execSync('npm install puppeteer', { stdio: 'inherit' });
        }
        
        const puppeteer = require('puppeteer');
        
        // Launch browser
        console.log('🌐 Launching browser...');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set viewport for consistent rendering
        await page.setViewport({ width: 1200, height: 800 });
        
        // Navigate to the local server
        console.log('📄 Loading CV application...');
        await page.goto('http://localhost:8080', { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        // Wait for the CV to fully load
        console.log('⏳ Waiting for CV to fully render...');
        await page.waitForSelector('app-root', { timeout: 10000 });

        // Wait a bit more for dynamic content to load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Get the full HTML content
        console.log('📝 Extracting rendered HTML...');
        const html = await page.content();
        
        // Close browser
        await browser.close();
        
        // Process the HTML to make it standalone
        const processedHTML = processHTML(html);
        
        // Write to index.html at repository root
        const outputPath = path.join(__dirname, 'index.html');
        fs.writeFileSync(outputPath, processedHTML, 'utf8');
        
        console.log('✅ Static HTML generated successfully!');
        console.log(`📁 Output: ${outputPath}`);
        console.log('🌐 Ready for GitHub Pages deployment');
        
        return outputPath;
        
    } catch (error) {
        console.error('❌ Error generating static HTML:', error);
        throw error;
    }
}

/**
 * Process the HTML to make it standalone and GitHub Pages ready
 */
function processHTML(html) {
    console.log('🔧 Processing HTML for static deployment...');
    
    // Replace base href to work with GitHub Pages
    let processed = html.replace(
        /<base href="\/">/g,
        '<base href="/Resume/">'
    );
    
    // Add meta tags for better SEO
    const metaTags = `
    <meta name="description" content="Bo's Professional CV - Dynamic CV Generator showcasing skills, experience, and projects">
    <meta name="keywords" content="CV, Resume, Software Engineer, Angular, TypeScript, Professional">
    <meta name="author" content="Bo">
    <meta property="og:title" content="Bo's Professional CV">
    <meta property="og:description" content="Dynamic CV Generator showcasing professional experience and skills">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://luofubo-personal.github.io/Resume/">
    `;
    
    processed = processed.replace('</head>', `${metaTags}</head>`);
    
    // Add a comment indicating this is a generated file
    const comment = `
<!-- 
    This is a statically generated version of the Dynamic CV Generator
    Generated on: ${new Date().toISOString()}
    Source: Angular application in cv-simple/
    
    To update this file:
    1. Make changes to the Angular app in cv-simple/
    2. Run: npm run build
    3. Run: node generate-static.js
    4. Commit and push the updated index.html
-->
`;
    
    processed = processed.replace('<!DOCTYPE html>', `<!DOCTYPE html>${comment}`);
    
    return processed;
}

// Run the generator
if (require.main === module) {
    generateStaticHTML()
        .then((outputPath) => {
            console.log('\n🎉 Static HTML generation complete!');
            console.log('📋 Next steps:');
            console.log('   1. Review the generated index.html');
            console.log('   2. git add index.html');
            console.log('   3. git commit -m "Update static CV"');
            console.log('   4. git push origin main');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Generation failed:', error.message);
            process.exit(1);
        });
}

module.exports = { generateStaticHTML };
