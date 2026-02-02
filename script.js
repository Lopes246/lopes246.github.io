/**
 * Portfolio JavaScript - Larissa Lopes
 * Contains: Preloader, Particles, Scroll Animations, Mobile Menu, GitHub API
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initParticles();
  initScrollReveal();
  initMobileMenu();
  initBackToTop();
  initHeaderScroll();
  fetchGitHubRepos();
});

/* ===========================
   PRELOADER
   =========================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  
  // Hide preloader after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      
      // Remove from DOM after fade
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 1500); // Minimum 1.5s loading time
  });
}

/* ===========================
   PARTICLES BACKGROUND
   =========================== */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Bounce off edges
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`; // Blue color
      ctx.fill();
    }
  }
  
  // Create particles
  const particlesArray = [];
  const numberOfParticles = Math.min(80, Math.floor((width * height) / 15000));
  
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particlesArray.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    // Draw connections
    particlesArray.forEach((p1, index) => {
      for (let i = index + 1; i < particlesArray.length; i++) {
        const p2 = particlesArray[i];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Handle resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    // Adjust particles count
    while (particlesArray.length > Math.min(80, Math.floor((width * height) / 15000))) {
      particlesArray.pop();
    }
    while (particlesArray.length < Math.min(80, Math.floor((width * height) / 15000))) {
      particlesArray.push(new Particle());
    }
  });
}

/* ===========================
   SCROLL REVEAL ANIMATIONS
   =========================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  function checkScroll() {
    const triggerBottom = window.innerHeight * 0.85;
    
    reveals.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < triggerBottom) {
        element.classList.add('active');
      }
    });
  }
  
  // Initial check
  checkScroll();
  
  // Check on scroll
  window.addEventListener('scroll', checkScroll);
}

/* ===========================
   MOBILE MENU
   =========================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!menuToggle || !navbar) return;
  
  // Toggle menu
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navbar.classList.toggle('active');
  });
  
  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navbar.classList.remove('active');
    });
  });
  
  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      navbar.classList.remove('active');
    }
  });
}

/* ===========================
   BACK TO TOP BUTTON
   =========================== */
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  
  if (!backToTop) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ===========================
   HEADER SCROLL EFFECT
   =========================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ===========================
   GITHUB API INTEGRATION
   =========================== */
async function fetchGitHubRepos() {
  const container = document.getElementById('github-repos');
  if (!container) return;
  
  const username = 'Lopes246';
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    
    const repos = await response.json();
    
    // Clear loading state
    container.innerHTML = '';
    
    if (repos.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">Nenhum repositório público encontrado.</p>';
      return;
    }
    
    // Filter and sort repos
    const sortedRepos = repos
      .filter(repo => !repo.fork || repo.stargazers_count > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);
    
    // Create repo cards
    sortedRepos.forEach(repo => {
      const card = createRepoCard(repo);
      container.appendChild(card);
    });
    
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    container.innerHTML = `
      <div class="repo-error">
        <i class='bx bx-error-circle'></i>
        <p>Não foi possível carregar os repositórios.</p>
        <small>Tente novamente mais tarde.</small>
      </div>
    `;
  }
}

function createRepoCard(repo) {
  const card = document.createElement('div');
  card.className = 'repo-card';
  
  const language = repo.language || 'Not specified';
  const description = repo.description || 'Sem descrição disponível.';
  const stars = repo.stargazers_count;
  const forks = repo.forks_count;
  
  card.innerHTML = `
    <h3>
      <i class='bx bx-folder'></i>
      ${repo.name}
    </h3>
    <p>${description}</p>
    <div class="repo-meta">
      ${language !== 'Not specified' ? `<span><i class='bx bx-circle'></i> ${language}</span>` : ''}
      ${stars > 0 ? `<span><i class='bx bx-star'></i> ${stars}</span>` : ''}
      ${forks > 0 ? `<span><i class='bx bx-git-branch'></i> ${forks}</span>` : ''}
    </div>
    <a href="${repo.html_url}" target="_blank" class="btn">
      <i class='bx bx-code-alt'></i> Ver Código
    </a>
  `;
  
  return card;
}

/* ===========================
   SMOOTH SCROLL FOR ANCHOR LINKS
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/* ===========================
   CONSOLE LOGO
   =========================== */
console.log(
  '%c👩‍💻 Portfolio Larissa Lopes',
  'color: #3b82f6; font-size: 20px; font-weight: bold;'
);
console.log(
  '%cDesenvolvedora Java Full Stack',
  'color: #94a3b8; font-size: 14px;'
);
console.log(
  '%c🚀 Navegando no console? Vamos trabalhar juntos!',
  'color: #22c55e; font-size: 12px;'
);

