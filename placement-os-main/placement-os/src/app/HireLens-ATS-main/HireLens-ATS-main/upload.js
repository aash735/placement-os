// upload.js - Resume upload and ATS analysis

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let selectedJob = null;
let resumeText = '';

// Job icon mapping
const jobIcons = {
    'Software Developer': '💻',
    'Python Developer': '🐍',
    'Full Stack Developer': '⚡',
    'Backend Developer': '⚙️',
    'Front End Developer': '🎨',
    'Junior Web Developer': '🌱',
    'Data Analyst': '📊',
    'Machine Learning Engineer': '🤖',
    'Cybersecurity Analyst': '🔒',
    'Web Developer': '🌐',
    'DevOps Engineer': '🚀',
    'Database Administrator (DBA)': '💾',
    'Cloud Solutions Architect': '☁️',
    'Product Engineer': '🧩'
};

// Role accent config for visual theming on the upload page
const jobAccents = {
    'Product Engineer': {
        iconBg: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
        color: '#7c3aed'
    }
};

// ─── Role Fit Engine ────────────────────────────────────────────────────────
// Computes a keyword overlap score between resume text and each job description,
// then returns the top 3 closest roles as a ranked list.
function computeRoleFit(resumeText) {
    const scores = jobDescriptions.map((job, index) => {
        const total = job.keywords.length;
        if (total === 0) return { index, title: job.title, score: 0, pct: 0 };
        let matched = 0;
        job.keywords.forEach(kw => {
            if (checkKeywordMatch(resumeText, kw)) matched++;
        });
        return { index, title: job.title, score: matched, pct: Math.round((matched / total) * 100) };
    });
    return scores.sort((a, b) => b.pct - a.pct).slice(0, 3);
}

// Render role fit panel (called after analysis)
function renderRoleFitPanel(resumeText, currentJobTitle) {
    const fits = computeRoleFit(resumeText);
    const existingPanel = document.getElementById('roleFitPanel');
    if (existingPanel) existingPanel.remove();

    const panel = document.createElement('div');
    panel.id = 'roleFitPanel';
    panel.className = 'role-fit-panel';

    const items = fits.map((fit, i) => {
        const isCurrentRole = fit.title === currentJobTitle;
        const rankLabels = ['🥇 Best Fit', '🥈 Strong Fit', '🥉 Good Fit'];
        const isProductEng = fit.title === 'Product Engineer';
        const accentColor = isProductEng ? '#7c3aed' : 'var(--primary)';
        return `
            <div class="fit-item ${isCurrentRole ? 'fit-item--current' : ''}">
                <div class="fit-item-left">
                    <span class="fit-rank">${rankLabels[i]}</span>
                    <span class="fit-title" style="${isProductEng ? 'color:#7c3aed' : ''}">${fit.title}</span>
                    ${isCurrentRole ? '<span class="fit-current-badge">Analyzing</span>' : ''}
                </div>
                <div class="fit-bar-wrap">
                    <div class="fit-bar">
                        <div class="fit-bar-fill" style="width:${fit.pct}%;background:${accentColor}" data-pct="${fit.pct}"></div>
                    </div>
                    <span class="fit-pct" style="${isProductEng ? 'color:#7c3aed' : ''}">${fit.pct}%</span>
                </div>
            </div>
        `;
    }).join('');

    panel.innerHTML = `
        <h3 class="section-heading"><span class="heading-icon">🎯</span>Recommended Role Fit</h3>
        <p class="section-description">Based on your resume keywords, here are your top matching roles across all available positions.</p>
        <div class="fit-list">${items}</div>
    `;

    // Insert before resume preview section
    const previewSection = document.querySelector('.resume-preview-section');
    if (previewSection) {
        previewSection.parentNode.insertBefore(panel, previewSection);
    }

    // Animate bars in after render
    requestAnimationFrame(() => {
        panel.querySelectorAll('.fit-bar-fill').forEach(bar => {
            const pct = bar.getAttribute('data-pct');
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = pct + '%'; }, 100);
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadSelectedJob();
    setupFileUpload();
    setupDragAndDrop();
});

// Load selected job from sessionStorage
function loadSelectedJob() {
    const jobIndex = sessionStorage.getItem('selectedJobIndex');
    
    if (jobIndex === null || jobIndex === undefined) {
        // No job selected, redirect to jobs page
        window.location.href = 'jobs.html';
        return;
    }

    selectedJob = jobDescriptions[parseInt(jobIndex)];
    
    if (!selectedJob) {
        window.location.href = 'jobs.html';
        return;
    }

    // Update job info card
    const icon = jobIcons[selectedJob.title] || '💼';
    const accent = jobAccents[selectedJob.title];

    document.getElementById('jobInfoIcon').textContent = icon;
    document.getElementById('jobInfoTitle').textContent = selectedJob.title;
    document.getElementById('jobInfoLocation').textContent = selectedJob.location;
    document.getElementById('jobInfoLevel').textContent = selectedJob.experience_level;

    // Apply accent styling for special roles
    if (accent) {
        const titleEl = document.getElementById('jobInfoTitle');
        titleEl.style.background = accent.iconBg;
        titleEl.style.webkitBackgroundClip = 'text';
        titleEl.style.webkitTextFillColor = 'transparent';
        titleEl.style.backgroundClip = 'text';
        document.getElementById('jobInfoLevel').style.color = accent.color;
    }
}

// Setup file upload
function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            handleFile(file);
        } else {
            alert('Please upload a PDF file');
        }
    });

    // Upload new button
    document.getElementById('uploadNewBtn').addEventListener('click', () => {
        document.getElementById('uploadContainer').style.display = 'flex';
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('fileInput').value = '';
        resumeText = '';
    });
}

// Setup drag and drop
function setupDragAndDrop() {
    const uploadBox = document.getElementById('uploadBox');

    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('drag-over');
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('drag-over');
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            handleFile(file);
        } else {
            alert('Please upload a PDF file');
        }
    });
}

// Handle file processing
async function handleFile(file) {
    const uploadBox = document.getElementById('uploadBox');
    uploadBox.classList.add('loading');
    uploadBox.innerHTML = '<div class="loading-spinner"></div><p style="margin-top: 1rem;">Processing your resume...</p>';

    try {
        const text = await extractTextFromPDF(file);
        resumeText = text;
        analyzeResume(text);
    } catch (error) {
        console.error('Error processing PDF:', error);
        alert('Error processing PDF. Please try again.');
        location.reload();
    }
}

// Extract text from PDF
async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }

    return fullText;
}

// Normalize text for matching
function normalizeText(text) {
    return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
        .replace(/\s+/g, ' ')     // Collapse multiple spaces
        .trim();
}

// Check if keyword matches in text
function checkKeywordMatch(text, keyword) {
    const normalizedText = normalizeText(text);
    const normalizedKeyword = normalizeText(keyword);
    
    // Check for exact phrase match
    const exactPattern = new RegExp('\\b' + normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    if (exactPattern.test(text)) {
        return true;
    }
    
    // For multi-word keywords, check if all words appear (in any order)
    const keywordWords = normalizedKeyword.split(' ');
    if (keywordWords.length > 1) {
        // Check if all words from the keyword appear in the text
        const allWordsPresent = keywordWords.every(word => {
            const wordPattern = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 's?\\b', 'i');
            return wordPattern.test(text);
        });
        if (allWordsPresent) {
            return true;
        }
    }
    
    // Check for stemmed versions (basic stemming)
    const stems = getWordStems(normalizedKeyword);
    return stems.some(stem => {
        const stemPattern = new RegExp('\\b' + stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\w*\\b', 'i');
        return stemPattern.test(text);
    });
}

// Basic stemming function
function getWordStems(word) {
    const stems = [word];
    
    // Remove common suffixes
    if (word.endsWith('ing')) {
        stems.push(word.slice(0, -3));
        stems.push(word.slice(0, -3) + 'e');
    }
    if (word.endsWith('ed')) {
        stems.push(word.slice(0, -2));
        stems.push(word.slice(0, -1));
    }
    if (word.endsWith('s')) {
        stems.push(word.slice(0, -1));
    }
    if (word.endsWith('es')) {
        stems.push(word.slice(0, -2));
    }
    if (word.endsWith('er')) {
        stems.push(word.slice(0, -2));
    }
    if (word.endsWith('ly')) {
        stems.push(word.slice(0, -2));
    }
    
    return [...new Set(stems)]; // Remove duplicates
}

// Check alternatives from suggestions
function checkAlternatives(text, keyword, suggestions) {
    if (!suggestions || !suggestions[keyword]) {
        return false;
    }
    
    const alternatives = suggestions[keyword];
    return alternatives.some(alt => checkKeywordMatch(text, alt));
}

// Analyze resume with improved matching
function analyzeResume(text) {
    const jobKeywords = selectedJob.keywords;
    const suggestions = selectedJob.suggestions || {};
    
    let matchedKeywords = [];
    let missingKeywords = [];

    // Check each keyword
    jobKeywords.forEach(keyword => {
        // Check direct match
        const isMatched = checkKeywordMatch(text, keyword) || 
                         checkAlternatives(text, keyword, suggestions);
        
        if (isMatched) {
            matchedKeywords.push(keyword);
        } else {
            missingKeywords.push(keyword);
        }
    });

    // Calculate ATS score
    const score = Math.round((matchedKeywords.length / jobKeywords.length) * 100);

    // Display results
    displayResults(score, matchedKeywords, missingKeywords, suggestions);
}

// Display analysis results
function displayResults(score, matchedKeywords, missingKeywords, suggestions) {
    // Hide upload container, show results
    document.getElementById('uploadContainer').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';

    // Animate score
    animateScore(score);

    // Update stats
    document.getElementById('matchedCount').textContent = matchedKeywords.length;
    document.getElementById('missingCount').textContent = missingKeywords.length;
    document.getElementById('totalCount').textContent = matchedKeywords.length + missingKeywords.length;

    // Display matched keywords
    const matchedContainer = document.getElementById('matchedKeywords');
    matchedContainer.innerHTML = '';
    
    matchedKeywords.forEach((keyword, index) => {
        const badge = document.createElement('div');
        badge.className = 'keyword-badge';
        badge.style.animationDelay = `${index * 0.05}s`;
        badge.innerHTML = `<span>✓</span> ${keyword}`;
        matchedContainer.appendChild(badge);
    });

    // Display missing keywords with suggestions
    const missingContainer = document.getElementById('missingKeywords');
    missingContainer.innerHTML = '';
    
    missingKeywords.forEach(keyword => {
        const item = document.createElement('div');
        item.className = 'missing-keyword-item';
        
        const keywordSuggestions = suggestions[keyword] || [];
        
        item.innerHTML = `
            <div class="missing-keyword-header">
                <span class="missing-keyword-name">⚠️ ${keyword}</span>
                ${keywordSuggestions.length > 0 ? `
                    <button class="expand-btn" onclick="toggleSuggestions(this)">
                        View Alternatives
                    </button>
                ` : ''}
            </div>
            ${keywordSuggestions.length > 0 ? `
                <div class="suggestions-container">
                    <div class="suggestions-label">Alternative keywords you can use:</div>
                    <div class="suggestions-list">
                        ${keywordSuggestions.map(sugg => `
                            <span class="suggestion-badge">${sugg}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        
        missingContainer.appendChild(item);
    });

    // Display resume content with highlights
    displayResumeContent();

    // Render role fit panel
    renderRoleFitPanel(resumeText, selectedJob.title);

    // Scroll to results
    setTimeout(() => {
        document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// Toggle suggestions
function toggleSuggestions(button) {
    const container = button.closest('.missing-keyword-item').querySelector('.suggestions-container');
    container.classList.toggle('active');
    button.textContent = container.classList.contains('active') ? 'Hide Alternatives' : 'View Alternatives';
}

// Animate score circle
function animateScore(score) {
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreCircle = document.getElementById('scoreCircle');
    
    // Add gradient definition for score circle
    const svg = document.querySelector('.score-svg');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'scoreGradient');
    gradient.innerHTML = `
        <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#f7931e;stop-opacity:1" />
    `;
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Animate number
    let currentScore = 0;
    const duration = 2000;
    const increment = score / (duration / 16);
    
    const numberInterval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score) {
            currentScore = score;
            clearInterval(numberInterval);
        }
        scoreNumber.textContent = Math.round(currentScore) + '%';
    }, 16);

    // Animate circle
    const circumference = 2 * Math.PI * 85;
    const offset = circumference - (score / 100) * circumference;
    
    setTimeout(() => {
        scoreCircle.style.strokeDashoffset = offset;
    }, 100);
}

// Display resume content with keyword highlighting
function displayResumeContent() {
    const contentDiv = document.getElementById('resumeContent');
    let highlightedText = resumeText;
    
    // Highlight matched keywords
    if (selectedJob && selectedJob.keywords) {
        const keywords = selectedJob.keywords;
        const suggestions = selectedJob.suggestions || {};
        
        keywords.forEach(keyword => {
            // Create pattern for keyword
            const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
            
            // Check if it's matched (simplified check)
            if (checkKeywordMatch(resumeText, keyword)) {
                highlightedText = highlightedText.replace(pattern, match => 
                    `<span class="highlighted">${match}</span>`
                );
            }
            
            // Check alternatives
            if (suggestions[keyword]) {
                suggestions[keyword].forEach(alt => {
                    const altPattern = new RegExp(`\\b${alt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
                    highlightedText = highlightedText.replace(altPattern, match => 
                        `<span class="highlighted">${match}</span>`
                    );
                });
            }
        });
    }
    
    contentDiv.innerHTML = highlightedText;
}

// Make toggleSuggestions available globally
window.toggleSuggestions = toggleSuggestions;