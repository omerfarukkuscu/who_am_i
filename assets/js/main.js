/**
 * Ömer Faruk Kuşçu — Portfolio JavaScript
 * Theme toggle, multilingual support, mobile nav, 3D animations, smooth scrolling
 */

/* Language System */
const langToggle = document.getElementById('lang-toggle');
let currentLang = localStorage.getItem('language') || 'tr';

function applyLanguage(lang) {
  document.querySelectorAll('[data-tr][data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.textContent = text;
  });
  
  // Navigation items are now handled by data attributes, no need for manual array
  
  // Update page title and meta
  const titles = {
    tr: 'Ömer Faruk Kuşçu — Portföy',
    en: 'Ömer Faruk Kuşçu — Portfolio'
  };
  document.title = titles[lang];
  
  // Update section headers
  const headers = {
    tr: ['Hakkımda', 'Projeler', 'Yetenekler', 'Ödüller & Başarılar', 'İletişime Geçin'],
    en: ['About Me', 'Projects', 'Skills', 'Awards & Achievements', 'Get In Touch']
  };
  
  const h2s = document.querySelectorAll('section h2');
  headers[lang].forEach((text, i) => {
    if (h2s[i]) h2s[i].textContent = text;
  });
  
  document.documentElement.lang = lang;
  localStorage.setItem('language', lang);
  
  // Update language toggle button
  const toggleText = lang === 'tr' ? 'EN' : 'TR';
  langToggle.querySelector('span').textContent = toggleText;
}

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'tr' ? 'en' : 'tr';
  applyLanguage(currentLang);
  console.log(`Language changed to: ${currentLang}`);
});

/* Theme toggle */
const themeToggle = document.getElementById('theme-toggle');
let theme = localStorage.getItem('theme') || 'dark';

function applyTheme(t) {
  if (t === 'light') document.documentElement.classList.add('light');
  else document.documentElement.classList.remove('light');
}

themeToggle.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
  applyTheme(theme);
  console.log(`Theme changed to: ${theme}`);
});

/* Loading Screen */
function createLoadingScreen() {
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.innerHTML = '<div class="loader"></div>';
  document.body.prepend(loading);
  
  return loading;
}

/* Image Error Handling - Simplified */
function setupImageErrorHandling() {
  document.querySelectorAll('img').forEach(img => {
    // Log image status
    img.addEventListener('load', () => {
      console.log('✓ Image loaded:', img.src);
    });
    
    img.addEventListener('error', () => {
      console.error('✗ Image failed:', img.src);
      // Add a visual indicator
      img.style.opacity = '0.3';
      img.style.border = '2px dashed var(--border)';
    });
  });
}

/* Initialize on load */
document.addEventListener('DOMContentLoaded', () => {
  const loading = createLoadingScreen();
  
  // Initialize theme and language
  applyTheme(theme);
  applyLanguage(currentLang);
  
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Setup image error handling
  setupImageErrorHandling();
  
  // Hide loading screen after content is ready
  setTimeout(() => {
    loading.classList.add('hidden');
    setTimeout(() => loading.remove(), 500);
    
    // Reveal sections with staggered animation
    document.querySelectorAll('.section').forEach((section, i) => {
      setTimeout(() => {
        section.classList.add('visible');
      }, i * 200);
    });
    
    // Re-setup image error handling for any dynamically loaded content
    setTimeout(setupImageErrorHandling, 1500);
  }, 1000);
});

/* Mobile navigation */
const navToggle = document.getElementById('nav-toggle');
const navList = document.getElementById('nav-list');

navToggle.addEventListener('click', () => {
  const isOpen = navList.classList.contains('open');
  if (isOpen) {
    navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  } else {
    navList.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
  }
});

/* Close mobile nav on link click */
navList.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* Smooth scroll for navigation links */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* Enhanced Intersection Observer for animations */
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -10% 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      entry.target.classList.add('animated');
      
      // Add staggered animation for cards in a container
      if (entry.target.classList.contains('grid-3')) {
        entry.target.querySelectorAll('.card').forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 100);
        });
      }
    }
  });
}, observerOptions);

/* Animate elements on scroll */
document.querySelectorAll('.card, .timeline-card, .badge').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
  observer.observe(el);
});

/* 3D Parallax Effect */
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const shapes = document.querySelectorAll('.shape');
  
  shapes.forEach((shape, i) => {
    const speed = 0.5 + (i * 0.2);
    const yPos = -(scrolled * speed);
    shape.style.transform = `translate3d(0, ${yPos}px, 0)`;
  });
  
  // Parallax for hero content
  const heroText = document.querySelector('.hero-text');
  if (heroText) {
    const yPos = scrolled * 0.3;
    heroText.style.transform = `translate3d(0, ${yPos}px, 0)`;
  }
});

/* Cursor Trail Effect */
let cursorTrail = [];
document.addEventListener('mousemove', (e) => {
  cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
  
  // Keep only recent positions
  cursorTrail = cursorTrail.filter(point => Date.now() - point.time < 500);
  
  // Create trailing particles occasionally
  if (Math.random() < 0.1) {
    createCursorParticle(e.clientX, e.clientY);
  }
});

function createCursorParticle(x, y) {
  const particle = document.createElement('div');
  particle.style.cssText = `
    position: fixed; left: ${x}px; top: ${y}px; width: 4px; height: 4px;
    background: var(--brand); border-radius: 50%; pointer-events: none;
    z-index: 9999; animation: fadeOut 1s ease-out forwards;
  `;
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 1000);
}

/* Add fadeOut animation */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0); }
  }
`;
document.head.appendChild(style);

/* Active nav link highlighting */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

/* Simple analytics tracking (console logs for now) */
window.addEventListener('load', () => {
  console.log('Portfolio loaded successfully');
  console.log('Created by ÖFK — World Champion Mathematician & Robotics Innovator');
});

/* Contact link click tracking */
document.querySelectorAll('.contact-card[href]').forEach(link => {
  link.addEventListener('click', (e) => {
    console.log(`Contact method clicked: ${e.currentTarget.href}`);
  });
});

/* Lightbox System */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const lightboxTags = document.getElementById('lightbox-tags');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxBackdrop = document.querySelector('.lightbox-backdrop');

// Project data for lightbox
const projectData = {
  'frc-robots': {
    images: ['assets/img/frc-robot-2024.jpg', 'assets/img/frc-robot-2022.jpg'],
    title: { tr: 'FRC Takımı #8795 — Robotlar', en: 'FRC Team #8795 — Robots' },
    description: {
      tr: 'İki yıl boyunca FRC Team Chaotics 8795 takım kaptanı olarak görev yaptım. 2024 robotu Swerve Drive sistemi, elevator ve 180° dönen intake mekanizmasına sahip. 2022 robotu Tank Drive ile kol sistemi kullanıyor. Tüm parçalar 3-axis CNC makinemizde üretiliyor.',
      en: 'Served as team captain of FRC Team Chaotics 8795 for two years. 2024 robot features Swerve Drive system with elevator and 180° rotating intake mechanism. 2022 robot uses Tank Drive with arm system. All parts manufactured in-house using our 3-axis CNC machine.'
    },
    tags: ['ROS/Control', 'C++', 'CNC', 'SolidWorks']
  },
  'ftc-mentor': {
    images: ['assets/img/ftc-robot.jpg'],
    title: { tr: 'FTC 25564 — Mentor', en: 'FTC 25564 — Mentor' },
    description: {
      tr: 'Yeni kurulan takıma mentor olarak teknik gelişim liderliği yaptım. Takımı Türkiye\'nin en iyi 3 takımından biri haline getirdim ve 2025 FTC Avrupa Premier Etkinliği\'ne davet aldık. Yazılım, mekanik tasarım ve strateji alanlarında liderlik ettim.',
      en: 'Served as mentor for the rookie team, leading technical development. Guided the team to become one of Turkey\'s top 3 teams and earned invitation to FTC European Premier Event 2025. Led development in software, mechanical design, and strategy.'
    },
    tags: ['Java/C++', 'Strategy', 'Mentorship']
  },
  'shell-eco': {
    images: ['assets/img/shell-eco-vehicle.jpg'],
    title: { tr: 'Shell Eco Marathon Aracı', en: 'Shell Eco Marathon Vehicle' },
    description: {
      tr: 'Takımımız enerji verimli bir araç tasarlayıp Shell Eco Marathon Fransa finallerine katılmaya hak kazandı. SolidWorks ile şasi tasarımı yaptım ve Python tabanlı şerit takip sistemi geliştirdim. Arduino Mega ana kontrol birimi olarak kullanıldı.',
      en: 'Our team designed an energy-efficient vehicle that qualified for Shell Eco Marathon finals in France. I designed the chassis in SolidWorks and developed a Python-based lane following system. Arduino Mega was used as the main control unit.'
    },
    tags: ['Python', 'Image Processing', 'SolidWorks', 'Arduino']
  },
  'pcb-agc': {
    images: ['assets/img/pcb-amplifier.jpg'],
    title: { tr: 'Geniş Bant Amplifikatör (AGC)', en: 'Wideband Amplifier (AGC)' },
    description: {
      tr: 'Otomatik kazanç kontrolü ile geniş bant amplifikatör PCB\' tasarladım ve ürettim. KiCad ile tasarım aşamasından lehimleme ve test aşamalarına kadar tüm süreci yönettim.',
      en: 'Designed and built a PCB for a wideband amplifier with automatic gain control. Managed the entire process from initial KiCad design to soldering and testing the final product.'
    },
    tags: ['KiCad', 'Analog', 'PCB']
  },
  'gas-monitoring': {
    images: ['assets/img/gas-monitoring-system.jpg'],
    title: { tr: 'Madencilik için Gaz İzleme', en: 'Gas Monitoring for Mining' },
    description: {
      tr: 'Teknofest\'te ilk 3\'e giren madenci güvenliği için gaz izleme sistemi geliştirdik. Kalibre edilmiş gaz sensörleri ve gerçek zamanlı veri eşikleri kullanarak erken uyarı sistemi oluşturduk.',
      en: 'Developed a gas monitoring and early-warning system for mining safety that placed top 3 at Teknofest. Used calibrated gas sensors and real-time data thresholds to create an effective warning system.'
    },
    tags: ['Embedded', 'Safety', 'IoT']
  },
  'aim-assist': {
    images: ['assets/img/aim-assist-project.jpg'],
    title: { tr: 'Nişan Yardım Sistemi (Görüntü İşleme)', en: 'Aim Assist (Vision)' },
    description: {
      tr: 'Deneyap mezuniyet projem için hedefleri tespit edip kilitlenen bir nişan yardım sistemi geliştirdim. Özel eğitimli görüntü işleme modeli kullanarak hedef tespiti yapabilir.',
      en: 'For my Deneyap graduation project, I developed an aim-assist system that can identify and lock onto specific targets using a custom-trained image processing model.'
    },
    tags: ['Python', 'CV', 'ML']
  }
};

function openLightbox(projectId) {
  const data = projectData[projectId];
  if (!data) return;
  
  const currentLang = localStorage.getItem('language') || 'tr';
  
  lightboxImg.src = data.images[0];
  lightboxImg.alt = data.title[currentLang];
  lightboxTitle.textContent = data.title[currentLang];
  lightboxDescription.textContent = data.description[currentLang];
  
  // Clear and populate tags
  lightboxTags.innerHTML = '';
  data.tags.forEach(tag => {
    const li = document.createElement('li');
    li.textContent = tag;
    lightboxTags.appendChild(li);
  });
  
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Lightbox event listeners
lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);

// ESC key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

/* Enhanced project card interactions */
document.querySelectorAll('.project').forEach(project => {
  // Lightbox trigger
  const viewBtn = project.querySelector('.view-btn');
  if (viewBtn) {
    viewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = project.getAttribute('data-project');
      openLightbox(projectId);
    });
  }
  
  // Mouse enter/leave with 3D effects
  project.addEventListener('mouseenter', () => {
    project.style.transition = 'all 0.4s ease';
    const tags = project.querySelector('.tags');
    if (tags) {
      tags.style.transform = 'translateY(-5px)';
      tags.style.transition = 'transform 0.3s ease';
    }
  });
  
  project.addEventListener('mouseleave', () => {
    const tags = project.querySelector('.tags');
    if (tags) tags.style.transform = 'translateY(0)';
  });
  
  // Add tilt effect on mouse move
  project.addEventListener('mousemove', (e) => {
    const rect = project.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / rect.height) * -5;
    const rotateY = (mouseX / rect.width) * 5;
    
    project.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
  });
  
  project.addEventListener('mouseleave', () => {
    project.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
});

/* Enhanced contact card interactions */
document.querySelectorAll('.contact-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px) scale(1.02)';
    card.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = 'var(--shadow)';
  });
});

/* Performance monitoring */
let performanceMetrics = {
  loadTime: 0,
  interactionCount: 0,
  scrollDepth: 0
};

// Track load performance
window.addEventListener('load', () => {
  performanceMetrics.loadTime = performance.now();
  console.log(`Site loaded in ${Math.round(performanceMetrics.loadTime)}ms`);
});

// Track user interactions
['click', 'scroll', 'mousemove'].forEach(event => {
  document.addEventListener(event, () => {
    performanceMetrics.interactionCount++;
  }, { passive: true });
});

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', () => {
  const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
  if (scrollPercent > maxScrollDepth) {
    maxScrollDepth = scrollPercent;
    performanceMetrics.scrollDepth = maxScrollDepth;
  }
}, { passive: true });
