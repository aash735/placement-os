// discover.js - Career Discovery Logic

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// State management
let userSkills = [];
let careerMatches = [];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupSkillsInput();
    setupResumeUpload();
    setupAnalyzeButton();
    setupResetButton();
});

// Setup tab switching
function setupTabs() {
    const tabs = document.querySelectorAll('.method-tab');
    const panels = document.querySelectorAll('.method-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const method = tab.getAttribute('data-method');

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(`${method}Panel`).classList.add('active');
        });
    });
}

// Setup skills input
function setupSkillsInput() {
    const input = document.getElementById('skillsInput');
    const tagsContainer = document.getElementById('skillsTags');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const skill = input.value.trim();
            if (skill && !userSkills.includes(skill)) {
                addSkill(skill);
                input.value = '';
                updateAnalyzeButton();
            }
        }
    });

    input.addEventListener('blur', () => {
        const skill = input.value.trim();
        if (skill && !userSkills.includes(skill)) {
            addSkill(skill);
            input.value = '';
            updateAnalyzeButton();
        }
    });
}

// Add skill tag
function addSkill(skill) {
    userSkills.push(skill);
    const tagsContainer = document.getElementById('skillsTags');
    
    const tag = document.createElement('div');
    tag.className = 'skill-tag';
    tag.innerHTML = `
        <span>${skill}</span>
        <span class="skill-tag-remove" onclick="removeSkill('${skill}')">×</span>
    `;
    
    tagsContainer.appendChild(tag);
}

// Remove skill tag
function removeSkill(skill) {
    userSkills = userSkills.filter(s => s !== skill);
    renderSkillTags();
    updateAnalyzeButton();
}

// Render skill tags
function renderSkillTags() {
    const tagsContainer = document.getElementById('skillsTags');
    tagsContainer.innerHTML = '';
    
    userSkills.forEach(skill => {
        const tag = document.createElement('div');
        tag.className = 'skill-tag';
        tag.innerHTML = `
            <span>${skill}</span>
            <span class="skill-tag-remove" onclick="removeSkill('${skill}')">×</span>
        `;
        tagsContainer.appendChild(tag);
    });
}

// Update analyze button state
function updateAnalyzeButton() {
    const btn = document.getElementById('analyzeSkillsBtn');
    btn.disabled = userSkills.length < 3;
}

// Setup analyze button
function setupAnalyzeButton() {
    const btn = document.getElementById('analyzeSkillsBtn');
    btn.addEventListener('click', () => {
        if (userSkills.length >= 3) {
            analyzeSkills(userSkills);
        }
    });
}

// Setup resume upload
function setupResumeUpload() {
    const fileInput = document.getElementById('resumeInput');
    const uploadBox = document.getElementById('uploadBoxDiscover');

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            handleResumeUpload(file);
        } else {
            alert('Please upload a PDF file');
        }
    });

    // Drag and drop
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = 'var(--primary)';
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.style.borderColor = 'rgba(124, 58, 237, 0.3)';
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = 'rgba(124, 58, 237, 0.3)';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            handleResumeUpload(file);
        } else {
            alert('Please upload a PDF file');
        }
    });
}

// Handle resume upload
async function handleResumeUpload(file) {
    const uploadBox = document.getElementById('uploadBoxDiscover');
    uploadBox.innerHTML = '<div class="loading-spinner"></div><p style="margin-top: 1rem;">Extracting skills from your resume...</p>';

    try {
        const text = await extractTextFromPDF(file);
        const extractedSkills = extractSkillsFromText(text);
        
        if (extractedSkills.length === 0) {
            alert('No skills detected in your resume. Please try manual entry.');
            location.reload();
            return;
        }

        userSkills = extractedSkills;
        analyzeSkills(userSkills);
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

// Extract skills from resume text
function extractSkillsFromText(text) {
    const normalizedText = text.toLowerCase();
    const detectedSkills = new Set();
    
    // Get all possible keywords from career data
    const allKeywords = new Set();
    careerRolesData.forEach(role => {
        role.keywords.forEach(kw => allKeywords.add(kw));
    });

    // Check each keyword against the text
    allKeywords.forEach(keyword => {
        const normalizedKeyword = keyword.toLowerCase();
        // Check for whole word matches
        const regex = new RegExp('\\b' + normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        if (regex.test(text)) {
            detectedSkills.add(keyword);
        }
    });

    return Array.from(detectedSkills);
}

// Main analysis function
function analyzeSkills(skills) {
    // Calculate match scores for all careers
    careerMatches = careerRolesData.map(role => {
        const matchResult = calculateMatch(skills, role.keywords);
        return {
            ...role,
            matchScore: matchResult.score,
            matchPercentage: matchResult.percentage,
            matchedSkills: matchResult.matched,
            missingSkills: matchResult.missing
        };
    }).filter(match => match.matchScore > 0) // Only show roles with at least 1 match
       .sort((a, b) => b.matchPercentage - a.matchPercentage);

    displayResults();
}

// Calculate match between user skills and role keywords
function calculateMatch(userSkills, roleKeywords) {
    const normalizedUserSkills = userSkills.map(s => s.toLowerCase());
    const normalizedRoleKeywords = roleKeywords.map(k => k.toLowerCase());
    
    const matched = [];
    const missing = [];

    roleKeywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        let isMatched = false;

        // Check exact match
        if (normalizedUserSkills.includes(keywordLower)) {
            matched.push(keyword);
            isMatched = true;
        } else {
            // Check partial match (for compound skills)
            for (const userSkill of normalizedUserSkills) {
                if (userSkill.includes(keywordLower) || keywordLower.includes(userSkill)) {
                    matched.push(keyword);
                    isMatched = true;
                    break;
                }
            }
        }

        if (!isMatched) {
            missing.push(keyword);
        }
    });

    const score = matched.length;
    const percentage = Math.round((score / roleKeywords.length) * 100);

    return { score, percentage, matched, missing };
}

// Display results
function displayResults() {
    // Hide input section
    document.querySelector('.input-section').style.display = 'none';
    
    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';

    // Update stats
    document.getElementById('matchedRoles').textContent = careerMatches.length;
    document.getElementById('yourSkills').textContent = userSkills.length;
    
    const avgMatch = careerMatches.length > 0
        ? Math.round(careerMatches.reduce((sum, m) => sum + m.matchPercentage, 0) / careerMatches.length)
        : 0;
    document.getElementById('avgMatch').textContent = avgMatch + '%';

    // Display top 3 matches
    displayTopMatches();

    // Display all matches
    displayAllMatches();

    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// Display top 3 matches with detailed info
function displayTopMatches() {
    const container = document.getElementById('topMatches');
    container.innerHTML = '';

    const top3 = careerMatches.slice(0, 3);

    top3.forEach((match, index) => {
        const rank = index + 1;
        const card = document.createElement('div');
        card.className = `top-match-card rank-${rank}`;
        
        const matchedSkillsHtml = match.matchedSkills
            .slice(0, 8)
            .map(skill => `<span class="skill-badge">${skill}</span>`)
            .join('');

        const missingSkillsHtml = match.missingSkills
            .slice(0, 6)
            .map(skill => `<span class="skill-badge missing">${skill}</span>`)
            .join('');

        const improvement = generateImprovement(match);

        card.innerHTML = `
            <div class="rank-badge rank-${rank}">${rank}</div>
            <div class="match-header">
                <div class="match-info">
                    <div class="match-category">${match.category || 'Technology'}</div>
                    <h3 class="match-title">${match.title}</h3>
                </div>
                <div class="match-score-display">
                    <div class="score-circle-small">
                        <svg width="100" height="100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="8"></circle>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="url(#gradient${rank})" stroke-width="8" 
                                    stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * match.matchPercentage / 100)}" 
                                    stroke-linecap="round" transform="rotate(-90 50 50)">
                            </circle>
                            <defs>
                                <linearGradient id="gradient${rank}" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#f7931e;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div class="score-text">
                            <div class="score-percent">${match.matchPercentage}%</div>
                            <div class="score-label-small">Match</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="match-content">
                <div class="skills-column">
                    <h4>✅ Your Matching Skills (${match.matchedSkills.length})</h4>
                    <div class="skills-list">
                        ${matchedSkillsHtml}
                        ${match.matchedSkills.length > 8 ? `<span class="skill-badge">+${match.matchedSkills.length - 8} more</span>` : ''}
                    </div>
                </div>
                <div class="skills-column">
                    <h4>📚 Skills to Learn (${match.missingSkills.length})</h4>
                    <div class="skills-list">
                        ${missingSkillsHtml}
                        ${match.missingSkills.length > 6 ? `<span class="skill-badge missing">+${match.missingSkills.length - 6} more</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="improvement-section">
                <h4>💡 Career Path Suggestion</h4>
                <p class="improvement-text">${improvement}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

// Generate improvement suggestion
function generateImprovement(match) {
    const topMissing = match.missingSkills.slice(0, 5).join(', ');
    const percentage = match.matchPercentage;

    if (percentage >= 80) {
        return `Excellent match! You're ${percentage}% ready for this role. Focus on these skills to become even stronger: ${topMissing}.`;
    } else if (percentage >= 60) {
        return `Strong foundation for ${match.title}! To increase your match to 80%+, consider learning: ${topMissing}. These are highly valued in this role.`;
    } else if (percentage >= 40) {
        return `Good starting point! You have ${match.matchedSkills.length} relevant skills. To become competitive for ${match.title}, prioritize: ${topMissing}.`;
    } else {
        return `This role requires building more foundational skills. Start with: ${topMissing}. Focus on 2-3 of these to significantly improve your match.`;
    }
}

// Display all matches in grid
function displayAllMatches() {
    const grid = document.getElementById('matchesGrid');
    grid.innerHTML = '';

    careerMatches.forEach(match => {
        const card = document.createElement('div');
        card.className = 'match-card';
        
        card.innerHTML = `
            <div class="card-header">
                <div class="card-category">${match.category || 'Technology'}</div>
                <div class="card-score">${match.matchPercentage}%</div>
            </div>
            <h3 class="card-title">${match.title}</h3>
            <div class="card-stats">
                <div class="card-stat">
                    <span class="stat-number">${match.matchedSkills.length}</span> matched
                </div>
                <div class="card-stat">
                    <span class="stat-number">${match.missingSkills.length}</span> to learn
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${match.matchPercentage}%"></div>
            </div>
            <div class="card-footer">
                <button class="view-details-btn" onclick="viewRoleDetails('${match.title}')">
                    View Details →
                </button>
            </div>
        `;

        grid.appendChild(card);
    });

    // Animate progress bars
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 100);
}

// View role details (scroll to top match if in top 3, otherwise show alert)
function viewRoleDetails(roleTitle) {
    const topMatchIndex = careerMatches.slice(0, 3).findIndex(m => m.title === roleTitle);
    
    if (topMatchIndex !== -1) {
        const topMatches = document.getElementById('topMatches');
        topMatches.scrollIntoView({ behavior: 'smooth' });
    } else {
        const match = careerMatches.find(m => m.title === roleTitle);
        if (match) {
            alert(`${match.title}\n\nMatch: ${match.matchPercentage}%\nMatched Skills: ${match.matchedSkills.length}\nSkills to Learn: ${match.missingSkills.length}\n\nTop Skills to Learn:\n${match.missingSkills.slice(0, 5).join(', ')}`);
        }
    }
}

// Setup reset button
function setupResetButton() {
    const btn = document.getElementById('resetBtn');
    btn.addEventListener('click', () => {
        location.reload();
    });
}

// Make functions globally available
window.removeSkill = removeSkill;
window.viewRoleDetails = viewRoleDetails;
