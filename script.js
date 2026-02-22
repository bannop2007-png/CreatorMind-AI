// Тема (сохранение в localStorage)
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-theme');
    body.classList.toggle('dark-theme');
    const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    const btn = document.getElementById('theme-toggle');
    btn.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// Загрузка темы
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(savedTheme + '-theme');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
});

// Симуляция логина (перенаправление)
function simulateLogin() {
    alert('Перенаправление на страницу входа...');
    window.location.href = 'generator.html';
}

// Регистрация (симуляция)
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        alert(`Регистрация успешна! Email: ${email}. Перенаправляем...`);
        this.reset();
        window.location.href = 'generator.html';
    });
}

// Реальная генерация идей с OpenAI API (твой ключ вставлен, но для теста — перенеси в backend!)
async function generateIdeas() {
    const niche = document.getElementById('niche').value.trim();
    if (!niche) {
        alert("Введи нишу, брат!");
        return;
    }

    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').innerHTML = '';

    const apiKey = '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'; // Твой ключ! УДАЛИ ЕГО ИЗ КОДА ПЕРЕД ПУБЛИКАЦИЕЙ!
    const prompt = `Generate 20 creative and actionable content ideas for the niche: "${niche}". Each idea should be short, numbered, and suitable for social media posts, videos, or stories in Telegram, TikTok, or YouTube Shorts. Make them engaging and unique.`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Или 'gpt-4o' для лучшего качества (дороже)
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.8 // Для креативности
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const ideasText = data.choices[0].message.content.trim();
        const ideas = ideasText.split('\n').filter(idea => idea.trim());

        let html = '';
        ideas.forEach((idea, index) => {
            html += `
            <div class="idea-card" style="animation-delay: ${index * 0.1}s;">
                <div class="idea-number">${index + 1}</div>
                <div class="idea-text">${idea.replace(/^\d+\.\s*/, '')}</div>
                <button class="copy-btn" onclick="copyIdea(this)">📋</button>
            </div>`;
        });

        document.getElementById('results').innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = '<p style="color:red;">Ошибка: Проверь API ключ или интернет. ' + error.message + '</p>';
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function copyIdea(btn) {
    const text = btn.parentElement.querySelector('.idea-text').textContent;
    navigator.clipboard.writeText(text);
    const original = btn.textContent;
    btn.textContent = '✓';
    btn.style.background = '#22c55e';
    setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
    }, 1500);
}

const nicheInput = document.getElementById('niche');
if (nicheInput) {
    nicheInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateIdeas();
    });
}
