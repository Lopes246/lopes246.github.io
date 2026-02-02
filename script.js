// LOADING COM TEMPO DEFINIDO (ms)
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');

    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';

        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); // tempo da transição de fade
    }, 1000); // TEMPO DO LOADING EM MILISSEGUNDOS
});


// MENU
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
menuIcon.onclick = () => navbar.classList.toggle('active');

// SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');
window.addEventListener('scroll', () => {
    reveals.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 120) {
            el.classList.add('active');
        }
    });
});

// GITHUB
async function fetchGithubRepos() {
    const container = document.getElementById('github-repos');
    const user = 'Lopes246';
    const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=6`);
    const repos = await res.json();

    repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        card.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || 'Projeto em desenvolvimento.'}</p>
            <a href="${repo.html_url}" target="_blank" class="btn">Ver código</a>
        `;
        container.appendChild(card);
    });
}
fetchGithubRepos();

// PARTICLES
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;

const particles = Array.from({length: 60}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    r: Math.random()*2+1,
    dx: Math.random()-0.5,
    dy: Math.random()-0.5
}));

function animate() {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,23,68,0.6)';
    particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if(p.x<0||p.x>w) p.dx*=-1;
        if(p.y<0||p.y>h) p.dy*=-1;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
    });
    requestAnimationFrame(animate);
}
animate();
