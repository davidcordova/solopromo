// ==========================================================================
// SOPORTE PROMOCIONAL S.A.C. - CORPORATE WORKFLOW & INCIDENT SUITE
// Clean Corporate & Functional Minimalism • Visual Annotation Studio
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParallax();
  initHeroSlider();
  initAboutBookSlider();
  initServicesMasterDetail();
  initPeruMap();
  initInfraTourAndGallery();
  initFloatingWhatsApp();
  initCountUp();
  initBriefModal();
});

// --------------------------------------------------------------------------
// NAVBAR & MOBILE NAVIGATION
// --------------------------------------------------------------------------
function initNavbar() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

  function openMobileMenu() {
    mobileBtn?.setAttribute('aria-expanded', 'true');
    mainNav?.classList.add('mobile-active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileBtn?.setAttribute('aria-expanded', 'false');
    mainNav?.classList.remove('mobile-active');
    document.body.style.overflow = '';
  }

  if (mobileBtn && mainNav) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on link click
    mainNav.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('mobile-active')) {
        if (!mainNav.contains(e.target) && !mobileBtn.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close on escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('mobile-active')) {
        closeMobileMenu();
      }
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.main-navigation a[href*="${sectionId}"]`);
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItem?.classList.add('active');
      } else {
        navItem?.classList.remove('active');
      }
    });
  });
}

// --------------------------------------------------------------------------
// HARDWARE-ACCELERATED PARALLAX ENGINE (ALTERNATING SECTIONS)
// --------------------------------------------------------------------------
function initParallax() {
  const parallaxLayers = document.querySelectorAll('.parallax-bg-layer');
  if (!parallaxLayers.length) return;

  // Respect user preference for reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    parallaxLayers.forEach(layer => { layer.style.transform = ''; });
    return;
  }

  function handleParallax() {
    // On desktop (width >= 1025px), fixed background attachment is natively hardware-accelerated
    // by the browser compositor for rock-solid 60fps fixed parallax without JavaScript lag.
    parallaxLayers.forEach(layer => {
      if (layer.style.transform) {
        layer.style.transform = '';
      }
    });
  }

  window.addEventListener('resize', handleParallax, { passive: true });
  handleParallax();
}

// --------------------------------------------------------------------------
// HERO INTERACTIVE SLIDER
// --------------------------------------------------------------------------
function initHeroSlider() {
  const sliderCard = document.getElementById('heroSliderCard');
  const slides = document.querySelectorAll('#sliderViewport .slider-slide');
  const dots = document.querySelectorAll('#heroSliderDots .pag-pill');
  const progressBar = document.getElementById('heroProgressBar');
  if (!slides.length) return;

  let currentSlide = 0;
  let autoPlayTimer = null;
  let progressAnimFrame = null;
  let progressStartTime = 0;
  const slideDuration = 5000;
  const slideCount = slides.length;

  function runProgressBar() {
    if (!progressBar) return;
    progressStartTime = performance.now();
    cancelAnimationFrame(progressAnimFrame);

    function tick(now) {
      const elapsed = now - progressStartTime;
      const pct = Math.min((elapsed / slideDuration) * 100, 100);
      progressBar.style.width = pct + '%';
      if (pct < 100) {
        progressAnimFrame = requestAnimationFrame(tick);
      }
    }
    progressAnimFrame = requestAnimationFrame(tick);
  }

  function resetProgressBar() {
    if (progressBar) progressBar.style.width = '0%';
    cancelAnimationFrame(progressAnimFrame);
  }

  function showSlide(index) {
    currentSlide = (index + slideCount) % slideCount;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    resetProgressBar();
    runProgressBar();
  }

  // Arrow button handlers
  document.querySelectorAll('#sliderViewport .arrow-prev').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide(currentSlide - 1);
      resetAutoPlay();
    });
  });

  document.querySelectorAll('#sliderViewport .arrow-next').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide(currentSlide + 1);
      resetAutoPlay();
    });
  });

  // Dots click handlers
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(idx);
      resetAutoPlay();
    });
  });

  function startAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    runProgressBar();
    autoPlayTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, slideDuration);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
    cancelAnimationFrame(progressAnimFrame);
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  if (sliderCard) {
    sliderCard.addEventListener('mouseenter', stopAutoPlay);
    sliderCard.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

// --------------------------------------------------------------------------
// ABOUT LOOKBOOK SLIDER (Efecto de pasar páginas de un libro)
// --------------------------------------------------------------------------
function initAboutBookSlider() {
  const slider = document.getElementById('aboutBookSlider');
  const pagesContainer = document.getElementById('bookPagesContainer');
  if (!slider || !pagesContainer) return;

  const pages = pagesContainer.querySelectorAll('.book-page');
  const counterText = document.getElementById('bookCounterText');
  const prevBtn = document.getElementById('bookPrevBtn');
  const nextBtn = document.getElementById('bookNextBtn');
  const cornerFold = document.getElementById('bookCornerFold');

  if (!pages.length) return;

  let currentPageIndex = 0;
  let isFlipping = false;
  let bookAutoPlayTimer = null;
  const totalPages = pages.length;

  function updateCounter(idx) {
    if (counterText) {
      const current = String(idx + 1).padStart(2, '0');
      const total = String(totalPages).padStart(2, '0');
      counterText.textContent = `${current} / ${total}`;
    }
  }

  function flipNext() {
    if (isFlipping) return;
    isFlipping = true;

    const activePage = pages[currentPageIndex];
    const nextIndex = (currentPageIndex + 1) % totalPages;
    const nextPage = pages[nextIndex];

    // Prepare next page underneath
    nextPage.classList.remove('turning-forward', 'turning-backward');
    nextPage.classList.add('next-ready');

    // Animate active page turning forward
    activePage.classList.add('turning-forward');

    setTimeout(() => {
      activePage.classList.remove('active', 'turning-forward');
      nextPage.classList.remove('next-ready');
      nextPage.classList.add('active');

      currentPageIndex = nextIndex;
      updateCounter(currentPageIndex);
      isFlipping = false;
    }, 850);
  }

  function flipPrev() {
    if (isFlipping) return;
    isFlipping = true;

    const activePage = pages[currentPageIndex];
    const prevIndex = (currentPageIndex - 1 + totalPages) % totalPages;
    const prevPage = pages[prevIndex];

    // Prepare previous page turning from -180deg back to 0deg over active page
    prevPage.classList.remove('turning-forward');
    prevPage.classList.add('next-ready', 'turning-backward');

    setTimeout(() => {
      activePage.classList.remove('active');
      prevPage.classList.remove('next-ready', 'turning-backward');
      prevPage.classList.add('active');

      currentPageIndex = prevIndex;
      updateCounter(currentPageIndex);
      isFlipping = false;
    }, 850);
  }

  // Button Listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      flipNext();
      resetBookAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      flipPrev();
      resetBookAutoPlay();
    });
  }

  if (cornerFold) {
    cornerFold.addEventListener('click', (e) => {
      e.stopPropagation();
      flipNext();
      resetBookAutoPlay();
    });
  }

  // Touch Swipe for mobile/tablets
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 40) {
      if (swipeDistance < 0) {
        flipNext();
        resetBookAutoPlay();
      } else {
        flipPrev();
        resetBookAutoPlay();
      }
    }
  }

  // Auto-play book flip
  function startBookAutoPlay() {
    if (bookAutoPlayTimer) clearInterval(bookAutoPlayTimer);
    bookAutoPlayTimer = setInterval(() => {
      flipNext();
    }, 5500);
  }

  function stopBookAutoPlay() {
    if (bookAutoPlayTimer) {
      clearInterval(bookAutoPlayTimer);
      bookAutoPlayTimer = null;
    }
  }

  function resetBookAutoPlay() {
    stopBookAutoPlay();
    startBookAutoPlay();
  }

  slider.addEventListener('mouseenter', stopBookAutoPlay);
  slider.addEventListener('mouseleave', startBookAutoPlay);

  updateCounter(currentPageIndex);
  startBookAutoPlay();
}

// --------------------------------------------------------------------------
// SERVICES MASTER-DETAIL INTERACTIVE SELECTOR
// --------------------------------------------------------------------------
function initServicesMasterDetail() {
  const navButtons = document.querySelectorAll('.services-navigator .service-nav-item');
  const panels = document.querySelectorAll('.services-panel-container .service-panel');
  if (!navButtons.length || !panels.length) return;

  function switchService(serviceKey, clickedBtn) {
    // 1. Reset all navigation items to Quiet Mode
    navButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    // 2. Activate clicked navigation button
    clickedBtn.classList.add('active');
    clickedBtn.setAttribute('aria-selected', 'true');

    // 3. Switch active panel with smooth transition
    panels.forEach(panel => {
      panel.classList.remove('active');
    });

    const targetPanel = document.getElementById('panel-' + serviceKey);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Dynamic WhatsApp CTA for this specific service
    const servicesDynamicCta = document.getElementById('servicesDynamicCta');
    const servicesCtaText = document.getElementById('servicesCtaText');
    const serviceTitle = clickedBtn.querySelector('.nav-item-title')?.textContent.trim() || 'Servicios Retail';
    
    if (servicesDynamicCta) {
      const waMsg = encodeURIComponent(`Hola Soporte Promocional, deseo solicitar cotización para el servicio de ${serviceTitle} para mi marca.`);
      servicesDynamicCta.href = `https://wa.me/51949705664?text=${waMsg}`;
    }
    if (servicesCtaText) {
      servicesCtaText.textContent = `Cotizar ${serviceTitle} por WhatsApp`;
    }
  }

  // Attach click & keyboard listeners
  navButtons.forEach((btn, index) => {
    const serviceKey = btn.getAttribute('data-service');

    btn.addEventListener('click', () => {
      switchService(serviceKey, btn);
    });

    // Keyboard navigation (Arrow Up, Arrow Down)
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (index + 1) % navButtons.length;
        navButtons[nextIndex].focus();
        navButtons[nextIndex].click();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (index - 1 + navButtons.length) % navButtons.length;
        navButtons[prevIndex].focus();
        navButtons[prevIndex].click();
      }
    });
  });
}

// --------------------------------------------------------------------------
// PERU COVERAGE MAP INTERACTIVITY - REAL DEPARTMENTS & MACRO-ZONES
// --------------------------------------------------------------------------
function initPeruMap() {
  const mapSvg = document.getElementById('peruCoverageSvg');
  const tooltip = document.getElementById('peruMapTooltip');
  const svgHolder = document.querySelector('.map-svg-holder');
  const zoneCards = document.querySelectorAll('.zone-box-item');
  const macroZoneGroups = document.querySelectorAll('.map-macro-zone');
  const cityGroups = document.querySelectorAll('.city-zone-group');
  const deptPaths = document.querySelectorAll('.dept-path');
  const cityMarkers = document.querySelectorAll('.city-marker');

  const zoneColors = {
    centro: '#5FA8DC',
    norte: '#3A6CA8',
    sur: '#C66533',
    oriente: '#7DA137'
  };

  const zoneTitles = {
    centro: 'Macro-Zona Centro (Sede Central)',
    norte: 'Macro-Zona Norte (Red Operativa)',
    sur: 'Macro-Zona Sur (Red Operativa)',
    oriente: 'Macro-Zona Oriente (Red Fluvial / Aérea)'
  };

  function highlightZone(selectedZone) {
    if (!selectedZone) return;

    if (mapSvg) {
      mapSvg.classList.add('has-active-zone');
    }

    // Update left cards
    zoneCards.forEach(card => {
      card.classList.toggle('active', card.dataset.zone === selectedZone);
    });

    // Update macro-zone SVG groups
    macroZoneGroups.forEach(group => {
      group.classList.toggle('active-zone', group.dataset.zone === selectedZone);
    });

    // Update city markers
    cityGroups.forEach(cg => {
      cg.classList.toggle('active-zone-cities', cg.dataset.zone === selectedZone);
    });

    // Sync incidentZone select if exists
    const zoneSelect = document.getElementById('incidentZone');
    if (zoneSelect) {
      Array.from(zoneSelect.options).forEach(opt => {
        if (opt.value.toLowerCase().includes(selectedZone.toLowerCase())) {
          zoneSelect.value = opt.value;
        }
      });
    }
  }

  // Left cards hover & click
  zoneCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      highlightZone(card.dataset.zone);
    });
    card.addEventListener('click', () => {
      highlightZone(card.dataset.zone);
    });
  });

  // Department hover & click & tooltip
  deptPaths.forEach(dept => {
    const zone = dept.dataset.zone;
    const deptName = dept.dataset.dept || dept.id.replace('dept-', '');

    dept.addEventListener('mouseenter', (e) => {
      highlightZone(zone);
      if (tooltip) {
        const color = zoneColors[zone] || '#FFFFFF';
        const zoneTitle = zoneTitles[zone] || zone.toUpperCase();
        tooltip.innerHTML = `
          <div class="tooltip-dept">${deptName}</div>
          <div class="tooltip-zone" style="color: ${color}">● ${zoneTitle}</div>
        `;
        tooltip.classList.add('visible');
      }
    });

    dept.addEventListener('mousemove', (e) => {
      if (tooltip && svgHolder) {
        const rect = svgHolder.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
      }
    });

    dept.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.classList.remove('visible');
      }
    });

    dept.addEventListener('click', () => {
      highlightZone(zone);
    });
  });

  // City markers hover & click
  cityMarkers.forEach(cm => {
    const zone = cm.dataset.zone;
    cm.addEventListener('mouseenter', () => {
      highlightZone(zone);
    });
    cm.addEventListener('click', (e) => {
      e.stopPropagation();
      highlightZone(zone);
    });
  });

  // Default active zone on load
  highlightZone('centro');
}

// ==========================================================================
// INFRAESTRUCTURA & RECORRIDO VIRTUAL INTERACTIVO - PLANO + GALERÍA
// ==========================================================================
const INFRA_TOUR_STOPS = [
  {
    "id": "stop-recibidor",
    "number": "01",
    "title": "Recibidor Principal & Lounge Corporativo",
    "category": "recibidor",
    "badge": "LOBBY & BIENVENIDA",
    "coords": {
      "x": 41.1,
      "y": 41.9
    },
    "radarAngle": 135,
    "mainPhoto": "/oficina/oficina_25.jpeg",
    "galleryPhotos": [
      "/oficina/oficina_25.jpeg",
      "/oficina/oficina_31.jpeg",
      "/oficina/oficina_12.jpeg",
      "/oficina/oficina_01.jpeg",
      "/oficina/oficina_05.jpeg"
    ],
    "description": "Área de recepción con muro institucional retroiluminado 'Soporte Promocional' sobre revestimiento terracota acústico, sofá modular de espera de alta densidad y divisoria arquitectónica perforada con la identidad visual corporativa.",
    "specs": [
      {
        "label": "Superficie",
        "value": "45 m²"
      },
      {
        "label": "Capacidad",
        "value": "12 personas"
      },
      {
        "label": "Equipamiento",
        "value": "Muro retroiluminado LED, sofá modular"
      }
    ],
    "hotspots": [
      {
        "x": 50,
        "y": 46,
        "title": "Muro Institucional Retroiluminado",
        "desc": "Letras corpóreas de acero cepillado con luz LED cálida sobre panel acústico terracota."
      },
      {
        "x": 80,
        "y": 62,
        "title": "Lounge de Espera B2B",
        "desc": "Mobiliario modular contemporáneo para recepción de clientes y proveedores estratégicos."
      },
      {
        "x": 15,
        "y": 55,
        "title": "Cubo Vidriado Sala 2",
        "desc": "Cerramiento acústico para reuniones rápidas de briefing comercial."
      }
    ]
  },
  {
    "id": "stop-openspace1",
    "number": "02",
    "title": "Open Space 1: Operaciones & Back Office KAMs",
    "category": "openspace",
    "badge": "COORDINACIÓN & DESPACHO 24/7",
    "coords": {
      "x": 22.0,
      "y": 52.0
    },
    "radarAngle": 45,
    "mainPhoto": "/oficina/oficina_02.jpeg",
    "galleryPhotos": [
      "/oficina/oficina_02.jpeg",
      "/oficina/oficina_15.jpeg",
      "/oficina/oficina_06.jpeg",
      "/oficina/oficina_04.jpeg",
      "/oficina/oficina_09.jpeg"
    ],
    "description": "Isla de estaciones operativas de alta tecnología donde nuestros Key Account Managers monitorean en tiempo real el cumplimiento de promotores, control de stock y asistencias en las tiendas retail del país.",
    "specs": [
      {
        "label": "Capacidad",
        "value": "16 puestos KAM"
      },
      {
        "label": "Conectividad",
        "value": "Fibra óptica redundante"
      },
      {
        "label": "Ergonomía",
        "value": "Sillas de oficina con soporte lumbar"
      }
    ],
    "hotspots": [
      {
        "x": 25,
        "y": 70,
        "title": "Estaciones KAM",
        "desc": "Puestos con doble monitor, telefonía IP y enlace continuo con coordinadores de campo."
      },
      {
        "x": 68,
        "y": 48,
        "title": "Mampara Acústica Microperforada",
        "desc": "Divisoria con patrón gráfico del logo Solo Promo que amortigua el ruido ambiental."
      },
      {
        "x": 85,
        "y": 62,
        "title": "Conexión a Sala de Directorio",
        "desc": "Visibilidad directa hacia el directorio ejecutivo mediante cristales termoacústicos."
      }
    ]
  },
  {
    "id": "stop-impresion",
    "number": "03",
    "title": "Centro Logístico de Impresión & Puestos Lineales",
    "category": "openspace",
    "badge": "GESTIÓN DOCUMENTARIA",
    "coords": {
      "x": 16.0,
      "y": 38.0
    },
    "radarAngle": 180,
    "mainPhoto": "/oficina/oficina_07.jpeg",
    "galleryPhotos": [
      "/oficina/oficina_07.jpeg",
      "/oficina/oficina_08.jpeg",
      "/oficina/oficina_10.jpeg",
      "/oficina/oficina_11.jpeg"
    ],
    "description": "Centro de apoyo documentario equipado con estación multifuncional para la rápida emisión de guías de remisión, contratos de promotores, credenciales y reportes físicos de auditoría en punto de venta.",
    "specs": [
      {
        "label": "Producción",
        "value": "Alta velocidad / color & B/N"
      },
      {
        "label": "Puestos de enfoque",
        "value": "4 puestos lineales"
      },
      {
        "label": "Iluminación",
        "value": "LED difuso 4000K antifatiga"
      }
    ],
    "hotspots": [
      {
        "x": 74,
        "y": 52,
        "title": "Multifuncional Industrial",
        "desc": "Equipamiento de alto rendimiento para guías de transporte y manuales de campaña."
      },
      {
        "x": 25,
        "y": 60,
        "title": "Puestos de Enfoque Individual",
        "desc": "Estaciones para redacción de informes técnicos y coordinación telefónica silenciosa."
      },
      {
        "x": 62,
        "y": 35,
        "title": "Columna Central Corporativa",
        "desc": "Columna arquitectónica cilíndrica pintada en el azul marino corporativo de la marca."
      }
    ]
  },
  {
    "id": "stop-directorio",
    "number": "04",
    "title": "Directorio Ejecutivo & Sala de Juntas B2B",
    "category": "directorio",
    "badge": "PLANIFICACIÓN ESTRATÉGICA",
    "coords": {
      "x": 26.4,
      "y": 78.3
    },
    "radarAngle": 225,
    "mainPhoto": "/oficina/oficina_20.jpeg",
    "galleryPhotos": [
      "/oficina/oficina_20.jpeg",
      "/oficina/oficina_19.jpeg",
      "/oficina/oficina_18.jpeg",
      "/oficina/oficina_14.jpeg",
      "/oficina/oficina_22.jpeg",
      "/oficina/oficina_30.jpeg"
    ],
    "description": "Sala ejecutiva de primer nivel diseñada para reuniones de alto impacto con gerencias de marca, directores de retail y comités de trade marketing. Cuenta con vista panorámica 180° a Lima, muro acústico tricolor y pantalla 4K.",
    "specs": [
      {
        "label": "Capacidad",
        "value": "10 directivos"
      },
      {
        "label": "Pantalla",
        "value": "LG OLED 4K UHD 75 pulg."
      },
      {
        "label": "Mural",
        "value": "Olas de color corporativo"
      }
    ],
    "hotspots": [
      {
        "x": 26,
        "y": 55,
        "title": "Mesa de Directorio Escultural",
        "desc": "Mesa de diseño en madera maciza con pedestales cilíndricos y pasacables ocultos."
      },
      {
        "x": 16,
        "y": 46,
        "title": "Pantalla LG OLED Evo 4K",
        "desc": "Visualización de dashboards en vivo de ventas, auditorías fotográficas y KPIs de promotoría."
      },
      {
        "x": 75,
        "y": 68,
        "title": "Lounge Privado Panorámico",
        "desc": "Zona de descanso con sillones de autor para conversaciones estratégicas."
      }
    ]
  },
  {
    "id": "stop-sala2",
    "number": "05",
    "title": "Sala de Capacitación de Promotoría & Reuniones 2",
    "category": "capacitacion",
    "badge": "FORMACIÓN CONTINUA & INDUCCIÓN",
    "coords": {
      "x": 59.4,
      "y": 39.7
    },
    "radarAngle": 315,
    "mainPhoto": "/oficina/oficina_24.jpeg",
    "galleryPhotos": [
      "/oficina/oficina_24.jpeg",
      "/oficina/oficina_03.jpeg",
      "/oficina/oficina_01.jpeg",
      "/oficina/oficina_26.jpeg"
    ],
    "description": "Módulo acústico acristalado diseñado para la formación técnica y argumentaria de cuadrillas de promotores, supervisores de campo e instaladores de material POP antes de ser desplegados a las tiendas.",
    "specs": [
      {
        "label": "Capacidad",
        "value": "8 personas"
      },
      {
        "label": "Acústica",
        "value": "Cristal templado laminado"
      },
      {
        "label": "Equipamiento",
        "value": "Display de capacitación interactiva"
      }
    ],
    "hotspots": [
      {
        "x": 14,
        "y": 52,
        "title": "Cubo Vidriado de Entrenamiento",
        "desc": "Espacio aislado del sonido exterior para role-playing de ventas y protocolos de atención."
      },
      {
        "x": 20,
        "y": 35,
        "title": "Display de Capacitación",
        "desc": "Transmisión de inducciones técnicas de producto de cada cliente."
      },
      {
        "x": 70,
        "y": 55,
        "title": "Lobby de Distribución",
        "desc": "Pasillo central con sillón modular de espera y casilleros de cuadrilla."
      }
    ]
  },
  {
    "id": "stop-cafeteria",
    "number": "06",
    "title": "Cafetería, Comedor & Espacio de Integración",
    "category": "cafeteria",
    "badge": "BIENESTAR DEL EQUIPO",
    "coords": {
      "x": 84.9,
      "y": 84.0
    },
    "radarAngle": 180,
    "mainPhoto": "/oficina/oficina_28.jpeg",
    "galleryPhotos": [
      "/oficina/oficina_28.jpeg",
      "/oficina/oficina_27.jpeg",
      "/oficina/oficina_29.jpeg"
    ],
    "description": "Ambiente acogedor y moderno equipado con barra desayunadora, microondas, refrigerador, estación de café y mesas de comedor. Un espacio pensado para la pausa activa, el bienestar y la cohesión de todo el personal.",
    "specs": [
      {
        "label": "Capacidad",
        "value": "20 personas simultáneas"
      },
      {
        "label": "Equipamiento",
        "value": "Microondas, refrigeración, cafetería"
      },
      {
        "label": "Diseño",
        "value": "Mural orgánico identidad corporativa"
      }
    ],
    "hotspots": [
      {
        "x": 55,
        "y": 50,
        "title": "Isla Kitchenette & Barra",
        "desc": "Barra central con encimera de cuarzo y taburetes ergonómicos."
      },
      {
        "x": 45,
        "y": 70,
        "title": "Comedor de Integración",
        "desc": "Mesas circulares que propician el descanso y la interacción de los equipos."
      },
      {
        "x": 30,
        "y": 40,
        "title": "Mural Cromático Solo Promo",
        "desc": "Composición mural que fusiona los colores del logotipo de la empresa."
      }
    ]
  },
  {
    "id": "stop-flexible",
    "number": "07",
    "title": "Espacio Flexible & Lockers de Cuadrilla",
    "category": "openspace",
    "badge": "LOGÍSTICA DE PERSONAL",
    "coords": {
      "x": 63.7,
      "y": 54.5
    },
    "radarAngle": 270,
    "mainPhoto": "/oficina/oficina_26.jpeg",
    "galleryPhotos": [
      "/oficina/oficina_26.jpeg",
      "/oficina/oficina_31.jpeg",
      "/oficina/oficina_13.jpeg"
    ],
    "description": "Zona de casilleros de seguridad donde promotores y cuadrillas técnicas guardan sus pertenencias y retiran sus EPPs y credenciales antes de trasladarse a las cadenas de retail de Lima y provincias.",
    "specs": [
      {
        "label": "Lockers",
        "value": "40 casilleros numerados"
      },
      {
        "label": "Seguridad",
        "value": "Cerraduras individuales"
      },
      {
        "label": "Uso",
        "value": "Resguardo de EPPs y herramientas"
      }
    ],
    "hotspots": [
      {
        "x": 28,
        "y": 48,
        "title": "Batería de Lockers",
        "desc": "Casilleros metálicos ventilados para custodia de implementos y kits de promotoría."
      },
      {
        "x": 75,
        "y": 68,
        "title": "Sillón Modular 6 Metros",
        "desc": "Zona de descanso amplio entre turnos de campo y capacitaciones."
      },
      {
        "x": 48,
        "y": 52,
        "title": "Estaciones de Paso",
        "desc": "Mesa de apoyo rápido para firma de actas de entrega de material POP."
      }
    ]
  }
];
const INFRA_GALLERY_PHOTOS = [
  {
    "id": "foto-01",
    "number": 1,
    "src": "/oficina/oficina_01.jpeg",
    "category": "recibidor",
    "title": "#01. Recibidor y Cubo de Vidrio",
    "description": "Vista hacia sala vidriada y área de lockers"
  },
  {
    "id": "foto-02",
    "number": 2,
    "src": "/oficina/oficina_02.jpeg",
    "category": "openspace",
    "title": "#02. Open Space 1 - Puestos KAMs",
    "description": "Estaciones operativas con divisor acústico azul"
  },
  {
    "id": "foto-03",
    "number": 3,
    "src": "/oficina/oficina_03.jpeg",
    "category": "recibidor",
    "title": "#03. Perspectiva Muro Soporte Promocional",
    "description": "Vista lateral desde sala de entrenamiento"
  },
  {
    "id": "foto-04",
    "number": 4,
    "src": "/oficina/oficina_04.jpeg",
    "category": "openspace",
    "title": "#04. Open Space 1 - Vista Frontal",
    "description": "Línea de mesas operativas con sillas ergonómicas"
  },
  {
    "id": "foto-05",
    "number": 5,
    "src": "/oficina/oficina_05.jpeg",
    "category": "recibidor",
    "title": "#05. Ingreso Principal hacia Open Space",
    "description": "Acceso hacia el área de coordinación operativa"
  },
  {
    "id": "foto-06",
    "number": 6,
    "src": "/oficina/oficina_06.jpeg",
    "category": "openspace",
    "title": "#06. Open Space 1 - Vista Amplia",
    "description": "Distribución de módulos de trabajo en planta libre"
  },
  {
    "id": "foto-07",
    "number": 7,
    "src": "/oficina/oficina_07.jpeg",
    "category": "openspace",
    "title": "#07. Centro de Impresión y Puestos de Enfoque",
    "description": "Multifuncional industrial y columna azul corporativa"
  },
  {
    "id": "foto-08",
    "number": 8,
    "src": "/oficina/oficina_08.jpeg",
    "category": "openspace",
    "title": "#08. Corredor de Trabajo Lineal",
    "description": "Módulos de redacción con iluminación indirecta"
  },
  {
    "id": "foto-09",
    "number": 9,
    "src": "/oficina/oficina_09.jpeg",
    "category": "openspace",
    "title": "#09. Puestos de Trabajo hacia Ventanales",
    "description": "Iluminación natural en estaciones de planificación"
  },
  {
    "id": "foto-10",
    "number": 10,
    "src": "/oficina/oficina_10.jpeg",
    "category": "openspace",
    "title": "#10. Mesa Colaborativa con Display OLED",
    "description": "Mesa alta de coordinación con pantalla informativa"
  },
  {
    "id": "foto-11",
    "number": 11,
    "src": "/oficina/oficina_11.jpeg",
    "category": "openspace",
    "title": "#11. Módulos Centrales de Operaciones",
    "description": "Mesas compartidas de supervisión de campañas"
  },
  {
    "id": "foto-12",
    "number": 12,
    "src": "/oficina/oficina_12.jpeg",
    "category": "recibidor",
    "title": "#12. Lounge con Arte Corporativo",
    "description": "Sillón curvo y cuadros con los colores del logo"
  },
  {
    "id": "foto-13",
    "number": 13,
    "src": "/oficina/oficina_13.jpeg",
    "category": "openspace",
    "title": "#13. Puestos de Trabajo y Cerramiento",
    "description": "Vista hacia zona de almacenamiento y casilleros"
  },
  {
    "id": "foto-14",
    "number": 14,
    "src": "/oficina/oficina_14.jpeg",
    "category": "directorio",
    "title": "#14. Perspectiva General: Directorio y Open Space",
    "description": "Transparencia arquitectónica entre salas"
  },
  {
    "id": "foto-15",
    "number": 15,
    "src": "/oficina/oficina_15.jpeg",
    "category": "openspace",
    "title": "#15. Open Space con vista a Directorio",
    "description": "Muro cortina vidriado que integra los ambientes"
  },
  {
    "id": "foto-16",
    "number": 16,
    "src": "/oficina/oficina_16.jpeg",
    "category": "directorio",
    "title": "#16. Directorio Ejecutivo - Muro Acústico",
    "description": "Sala de juntas con mesa de diseño y pantalla LG"
  },
  {
    "id": "foto-17",
    "number": 17,
    "src": "/oficina/oficina_17.jpeg",
    "category": "directorio",
    "title": "#17. Encuentro entre Open Space y Directorio",
    "description": "Vista hacia los ventanales panorámicos de Lima"
  },
  {
    "id": "foto-18",
    "number": 18,
    "src": "/oficina/oficina_18.jpeg",
    "category": "directorio",
    "title": "#18. Directorio B2B - Mesa de 10 Puestos",
    "description": "Lámparas colgantes semiesféricas y mural decorativo"
  },
  {
    "id": "foto-19",
    "number": 19,
    "src": "/oficina/oficina_19.jpeg",
    "category": "directorio",
    "title": "#19. Lounge Panorámico del Directorio",
    "description": "Sillones de autor junto a la vista de la ciudad"
  },
  {
    "id": "foto-20",
    "number": 20,
    "src": "/oficina/oficina_20.jpeg",
    "category": "directorio",
    "title": "#20. Directorio Ejecutivo - Vista Completa",
    "description": "Mesa escultórica, pantalla 4K y sala de espera VIP"
  },
  {
    "id": "foto-21",
    "number": 21,
    "src": "/oficina/oficina_21.jpeg",
    "category": "directorio",
    "title": "#21. Directorio - Perspectiva Frontal",
    "description": "Ambiente ejecutivo para comités de marca de alto nivel"
  },
  {
    "id": "foto-22",
    "number": 22,
    "src": "/oficina/oficina_22.jpeg",
    "category": "directorio",
    "title": "#22. Directorio mirando hacia Open Space",
    "description": "Integración visual hacia las cuadrillas operativas"
  },
  {
    "id": "foto-23",
    "number": 23,
    "src": "/oficina/oficina_23.jpeg",
    "category": "directorio",
    "title": "#23. Rincón VIP del Directorio",
    "description": "Detalle de butacas y mesa de centro para reuniones 1 a 1"
  },
  {
    "id": "foto-24",
    "number": 24,
    "src": "/oficina/oficina_24.jpeg",
    "category": "capacitacion",
    "title": "#24. Sala de Capacitación y Muro Corporativo",
    "description": "Cubo de cristal para entrenamiento de promotores"
  },
  {
    "id": "foto-25",
    "number": 25,
    "src": "/oficina/oficina_25.jpeg",
    "category": "recibidor",
    "title": "#25. Muro Institucional 'Soporte Promocional'",
    "description": "Recepción de marca con iluminación arquitectónica cálida"
  },
  {
    "id": "foto-26",
    "number": 26,
    "src": "/oficina/oficina_26.jpeg",
    "category": "recibidor",
    "title": "#26. Lounge Corrido y Lockers de Personal",
    "description": "Zona de estancia informal y casilleros de campo"
  },
  {
    "id": "foto-27",
    "number": 27,
    "src": "/oficina/oficina_27.jpeg",
    "category": "cafeteria",
    "title": "#27. Cafetería y Comedor - Vista General",
    "description": "Mesas redondas, barra desayunadora y kitchenette"
  },
  {
    "id": "foto-28",
    "number": 28,
    "src": "/oficina/oficina_28.jpeg",
    "category": "cafeteria",
    "title": "#28. Comedor y Espacio Flexible de Descanso",
    "description": "Área de alimentación y pausas activas del personal"
  },
  {
    "id": "foto-29",
    "number": 29,
    "src": "/oficina/oficina_29.jpeg",
    "category": "cafeteria",
    "title": "#29. Isla de Cocina y Barra de Café",
    "description": "Encimera de cuarzo con taburetes de madera para break"
  },
  {
    "id": "foto-30",
    "number": 30,
    "src": "/oficina/oficina_30.jpeg",
    "category": "directorio",
    "title": "#30. Directorio B2B - Gran Angular",
    "description": "Perspectiva completa de la sala de reuniones principal"
  },
  {
    "id": "foto-31",
    "number": 31,
    "src": "/oficina/oficina_31.jpeg",
    "category": "recibidor",
    "title": "#31. Recibidor Amplio con Muro de Marca",
    "description": "Vista abierta del lobby de bienvenida y butacas terracota"
  }
];

function initInfraTourAndGallery() {
  const btnModeTour = document.getElementById('btnModeTour');
  const btnModeGallery = document.getElementById('btnModeGallery');
  const panelTourView = document.getElementById('panelTourView');
  const panelGalleryView = document.getElementById('panelGalleryView');

  if (!panelTourView || !panelGalleryView) return;

  // View Switcher (Tour vs Gallery)
  btnModeTour?.addEventListener('click', () => switchMode('tour'));
  btnModeGallery?.addEventListener('click', () => switchMode('gallery'));

  function switchMode(mode) {
    const isTour = mode === 'tour';
    btnModeTour?.classList.toggle('active', isTour);
    btnModeTour?.setAttribute('aria-selected', isTour ? 'true' : 'false');
    btnModeGallery?.classList.toggle('active', !isTour);
    btnModeGallery?.setAttribute('aria-selected', !isTour ? 'true' : 'false');

    if (isTour) {
      panelTourView.style.display = 'block';
      panelGalleryView.style.display = 'none';
      setTimeout(() => {
        panelTourView.classList.add('active');
        panelGalleryView.classList.remove('active');
      }, 10);
    } else {
      panelGalleryView.style.display = 'block';
      panelTourView.style.display = 'none';
      setTimeout(() => {
        panelGalleryView.classList.add('active');
        panelTourView.classList.remove('active');
      }, 10);
      stopAutoplay();
    }
  }

  // ------------------------------------------------------------------------
  // VIRTUAL TOUR CONTROLLER
  // ------------------------------------------------------------------------
  let currentStopIdx = 0;
  let currentAngleIdx = 0;
  let isAutoplay = false;
  let autoplayInterval = null;
  let autoplayProgressTimer = null;
  let progressVal = 0;
  const AUTOPLAY_DURATION = 5500; // ms

  const blueprintPinsLayer = document.getElementById('blueprintPinsLayer');
  const activeRadarCone = document.getElementById('activeRadarCone');
  const tourCurrentImg = document.getElementById('tourCurrentImg');
  const tourHotspotsContainer = document.getElementById('tourHotspotsContainer');
  const tourBadgeText = document.getElementById('tourBadgeText');
  const tourCurrentNum = document.getElementById('tourCurrentNum');
  const tourTotalNum = document.getElementById('tourTotalNum');
  const tourStopTitle = document.getElementById('tourStopTitle');
  const tourStopDesc = document.getElementById('tourStopDesc');
  const tourZoneTag = document.getElementById('tourZoneTag');
  const tourSpecsRow = document.getElementById('tourSpecsRow');
  const tourAnglesThumbnails = document.getElementById('tourAnglesThumbnails');
  const tourProgressBar = document.getElementById('tourProgressBar');
  const btnTourPrev = document.getElementById('btnTourPrev');
  const btnTourNext = document.getElementById('btnTourNext');
  const btnAutoplayToggle = document.getElementById('btnAutoplayToggle');
  const autoplayIconPlay = document.getElementById('autoplayIconPlay');
  const autoplayIconPause = document.getElementById('autoplayIconPause');
  const autoplayBtnText = document.getElementById('autoplayBtnText');
  const btnTourFullscreen = document.getElementById('btnTourFullscreen');

  if (tourTotalNum) {
    tourTotalNum.textContent = String(INFRA_TOUR_STOPS.length).padStart(2, '0');
  }

  // Render Blueprint Pins
  function renderBlueprintPins() {
    if (!blueprintPinsLayer) return;
    blueprintPinsLayer.innerHTML = INFRA_TOUR_STOPS.map((stop, i) => `
      <div class="blueprint-pin ${i === currentStopIdx ? 'active' : ''}" 
           id="bpin-${stop.id}" 
           data-index="${i}" 
           style="left: ${stop.coords.x}%; top: ${stop.coords.y}%;" 
           title="Clic para explorar ${stop.title}">
        <span class="pin-pulse-ring"></span>
        <span class="pin-num">${stop.number}</span>
        <div class="blueprint-pin-tooltip">
          <strong>${stop.number}. ${stop.title}</strong>
        </div>
      </div>
    `).join('');

    blueprintPinsLayer.querySelectorAll('.blueprint-pin').forEach(pin => {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(pin.dataset.index, 10);
        goToStop(idx, 0);
        stopAutoplay();
      });
    });
  }

  // Update Radar Cone in Blueprint SVG
  function updateRadarCone(stop) {
    if (!activeRadarCone) return;
    const cx = stop.coords.x;
    const cy = stop.coords.y;
    const r = 26; // radius of field of view
    const angleDeg = stop.radarAngle || 90;
    const spreadDeg = 36; // half-angle spread

    const a1 = (angleDeg - spreadDeg) * Math.PI / 180;
    const a2 = (angleDeg + spreadDeg) * Math.PI / 180;

    const x1 = (cx + r * Math.cos(a1)).toFixed(1);
    const y1 = (cy + r * Math.sin(a1)).toFixed(1);
    const x2 = (cx + r * Math.cos(a2)).toFixed(1);
    const y2 = (cy + r * Math.sin(a2)).toFixed(1);

    activeRadarCone.setAttribute('points', `${cx},${cy} ${x1},${y1} ${x2},${y2}`);
  }

  // Additional Elements for Photo Navigation & Zone Nav
  const tourCurrentAngleNum = document.getElementById('tourCurrentAngleNum');
  const tourTotalAnglesNum = document.getElementById('tourTotalAnglesNum');
  const btnPrevZone = document.getElementById('btnPrevZone');
  const btnNextZone = document.getElementById('btnNextZone');

  // Navigate to Specific Stop (Zone)
  function goToStop(stopIdx, angleIdx = 0) {
    currentStopIdx = (stopIdx + INFRA_TOUR_STOPS.length) % INFRA_TOUR_STOPS.length;
    const stop = INFRA_TOUR_STOPS[currentStopIdx];
    if (!stop) return;

    currentAngleIdx = Math.max(0, Math.min(angleIdx, stop.galleryPhotos.length - 1));

    // Update pins state
    blueprintPinsLayer?.querySelectorAll('.blueprint-pin').forEach((pin, i) => {
      pin.classList.toggle('active', i === currentStopIdx);
    });

    // Update Radar
    updateRadarCone(stop);

    // Update Main Photo with fade transition
    updatePhotoDisplay(stop.galleryPhotos[currentAngleIdx] || stop.mainPhoto);

    // Update Badges & Texts
    if (tourBadgeText) tourBadgeText.textContent = stop.badge || 'ZONA CORPORATIVA';
    if (tourCurrentNum) tourCurrentNum.textContent = stop.number;
    if (tourZoneTag) tourZoneTag.textContent = `PUNTO #${stop.number} • ${stop.badge}`;
    if (tourStopTitle) tourStopTitle.textContent = stop.title;
    if (tourStopDesc) tourStopDesc.textContent = stop.description;

    // Update Photo Counter (Foto X de Y)
    if (tourCurrentAngleNum) tourCurrentAngleNum.textContent = String(currentAngleIdx + 1);
    if (tourTotalAnglesNum) tourTotalAnglesNum.textContent = String(stop.galleryPhotos.length);

    // Update Specs
    if (tourSpecsRow && stop.specs) {
      tourSpecsRow.innerHTML = stop.specs.map(s => `
        <div class="tour-spec-chip"><span class="spec-label">${s.label}:</span> <strong>${s.value}</strong></div>
      `).join('');
    }

    // Update Hotspots over the photo
    renderPhotoHotspots(stop);

    // Update Angles Thumbnails
    renderAngleThumbnails(stop);
  }

  // Update photo display with smooth transition
  function updatePhotoDisplay(targetSrc) {
    if (!tourCurrentImg) return;
    
    tourCurrentImg.style.opacity = '0.7';
    tourCurrentImg.style.transform = 'scale(0.99)';
    tourCurrentImg.src = targetSrc;
    
    if (tourCurrentImg.complete) {
      tourCurrentImg.style.opacity = '1';
      tourCurrentImg.style.transform = 'scale(1)';
    } else {
      tourCurrentImg.onload = () => {
        tourCurrentImg.style.opacity = '1';
        tourCurrentImg.style.transform = 'scale(1)';
      };
      tourCurrentImg.onerror = () => {
        tourCurrentImg.style.opacity = '1';
        tourCurrentImg.style.transform = 'scale(1)';
      };
    }
    
    setTimeout(() => {
      if (tourCurrentImg) {
        tourCurrentImg.style.opacity = '1';
        tourCurrentImg.style.transform = 'scale(1)';
      }
    }, 180);
  }

  // Switch photo within the active stop (or advance)
  function goToAngle(angleIdx) {
    const stop = INFRA_TOUR_STOPS[currentStopIdx];
    if (!stop || !stop.galleryPhotos[angleIdx]) return;
    currentAngleIdx = angleIdx;

    if (tourCurrentAngleNum) tourCurrentAngleNum.textContent = String(currentAngleIdx + 1);
    if (tourTotalAnglesNum) tourTotalAnglesNum.textContent = String(stop.galleryPhotos.length);

    tourAnglesThumbnails?.querySelectorAll('.angle-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === currentAngleIdx);
    });

    if (tourHotspotsContainer) {
      tourHotspotsContainer.style.display = currentAngleIdx === 0 ? 'block' : 'none';
    }

    updatePhotoDisplay(stop.galleryPhotos[currentAngleIdx]);
  }

  // Next Photo (Cycles within zone, then moves to next zone)
  function goToNextPhoto() {
    const stop = INFRA_TOUR_STOPS[currentStopIdx];
    if (!stop) return;
    if (currentAngleIdx < stop.galleryPhotos.length - 1) {
      goToAngle(currentAngleIdx + 1);
    } else {
      // Loop to next stop's first photo
      goToStop(currentStopIdx + 1, 0);
    }
  }

  // Prev Photo (Cycles within zone, then moves to prev zone's end)
  function goToPrevPhoto() {
    const stop = INFRA_TOUR_STOPS[currentStopIdx];
    if (!stop) return;
    if (currentAngleIdx > 0) {
      goToAngle(currentAngleIdx - 1);
    } else {
      // Move to previous stop's last photo
      const prevIdx = (currentStopIdx - 1 + INFRA_TOUR_STOPS.length) % INFRA_TOUR_STOPS.length;
      const prevStop = INFRA_TOUR_STOPS[prevIdx];
      goToStop(prevIdx, prevStop.galleryPhotos.length - 1);
    }
  }

  // Render Hotspots over Photo
  function renderPhotoHotspots(stop) {
    if (!tourHotspotsContainer) return;
    if (!stop.hotspots || stop.hotspots.length === 0) {
      tourHotspotsContainer.innerHTML = '';
      return;
    }

    tourHotspotsContainer.style.display = currentAngleIdx === 0 ? 'block' : 'none';
    tourHotspotsContainer.innerHTML = stop.hotspots.map((h, i) => `
      <div class="photo-hotspot-pin" style="left: ${h.x}%; top: ${h.y}%;" title="${h.title}">
        <span class="hotspot-pulse-wave"></span>
        <span>+</span>
        <div class="hotspot-info-popup">
          <h5>${h.title}</h5>
          <p>${h.desc}</p>
        </div>
      </div>
    `).join('');

    tourHotspotsContainer.querySelectorAll('.photo-hotspot-pin').forEach(pin => {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        pin.classList.toggle('opened');
      });
    });
  }

  // Render Thumbnails of alternate angles
  function renderAngleThumbnails(stop) {
    if (!tourAnglesThumbnails) return;
    tourAnglesThumbnails.innerHTML = stop.galleryPhotos.map((src, idx) => `
      <div class="angle-thumb ${idx === currentAngleIdx ? 'active' : ''}" data-angle="${idx}" title="Ver foto ${idx + 1} de ${stop.galleryPhotos.length} en ${stop.title}">
        <img src="${src}" alt="Perspectiva ${idx + 1} de ${stop.title}" loading="lazy" />
        <span class="angle-thumb-num">${idx + 1}</span>
      </div>
    `).join('');

    tourAnglesThumbnails.querySelectorAll('.angle-thumb').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        const aIdx = parseInt(thumb.dataset.angle, 10);
        goToAngle(aIdx);
        stopAutoplay();
      });
    });
  }

  // Navigation Arrows on Viewport (Now Cycle Photos as requested!)
  btnTourPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToPrevPhoto();
    stopAutoplay();
  });

  btnTourNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToNextPhoto();
    stopAutoplay();
  });

  // Zone Navigation Buttons in Left Dossier
  btnPrevZone?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToStop(currentStopIdx - 1, 0);
    stopAutoplay();
  });

  btnNextZone?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToStop(currentStopIdx + 1, 0);
    stopAutoplay();
  });

  // Autoplay functionality
  btnAutoplayToggle?.addEventListener('click', () => {
    if (isAutoplay) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  function startAutoplay() {
    isAutoplay = true;
    btnAutoplayToggle?.classList.add('playing');
    if (autoplayIconPlay) autoplayIconPlay.style.display = 'none';
    if (autoplayIconPause) autoplayIconPause.style.display = 'inline-block';
    if (autoplayBtnText) autoplayBtnText.textContent = 'Pausar';

    progressVal = 0;
    clearInterval(autoplayProgressTimer);
    autoplayProgressTimer = setInterval(() => {
      progressVal += 100 / (AUTOPLAY_DURATION / 100);
      if (tourProgressBar) tourProgressBar.style.width = `${Math.min(100, progressVal)}%`;
    }, 100);

    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
      progressVal = 0;
      goToNextPhoto(); // Autoplay cycles through every photo smoothly!
    }, AUTOPLAY_DURATION);
  }

  function stopAutoplay() {
    isAutoplay = false;
    btnAutoplayToggle?.classList.remove('playing');
    if (autoplayIconPlay) autoplayIconPlay.style.display = 'inline-block';
    if (autoplayIconPause) autoplayIconPause.style.display = 'none';
    if (autoplayBtnText) autoplayBtnText.textContent = 'Auto-Tour';

    clearInterval(autoplayInterval);
    clearInterval(autoplayProgressTimer);
    if (tourProgressBar) tourProgressBar.style.width = '0%';
  }

  // ------------------------------------------------------------------------
  // FULLSCREEN ENGINE (NATIVE HTML5 FULLSCREEN API + LIGHTBOX FALLBACK)
  // ------------------------------------------------------------------------
  const tourViewport = document.getElementById('tourViewport');

  function isFullscreenActive() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  }

  function toggleTourFullscreen() {
    if (!tourViewport) return;

    if (!isFullscreenActive()) {
      if (tourViewport.requestFullscreen) {
        tourViewport.requestFullscreen().catch(() => openCurrentPhotoInLightbox());
      } else if (tourViewport.webkitRequestFullscreen) {
        tourViewport.webkitRequestFullscreen();
      } else if (tourViewport.msRequestFullscreen) {
        tourViewport.msRequestFullscreen();
      } else {
        openCurrentPhotoInLightbox();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  function updateFullscreenButtonState() {
    if (!btnTourFullscreen) return;
    const inFs = isFullscreenActive();
    if (inFs) {
      btnTourFullscreen.title = 'Salir de pantalla completa (Tecla Esc o F)';
      btnTourFullscreen.setAttribute('aria-label', 'Salir de pantalla completa');
      btnTourFullscreen.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
        </svg>
      `;
    } else {
      btnTourFullscreen.title = 'Ver en pantalla completa (Tecla F)';
      btnTourFullscreen.setAttribute('aria-label', 'Pantalla completa');
      btnTourFullscreen.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      `;
    }
  }

  document.addEventListener('fullscreenchange', updateFullscreenButtonState);
  document.addEventListener('webkitfullscreenchange', updateFullscreenButtonState);

  btnTourFullscreen?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleTourFullscreen();
  });

  function openCurrentPhotoInLightbox() {
    const currentSrc = INFRA_TOUR_STOPS[currentStopIdx]?.galleryPhotos[currentAngleIdx] || INFRA_TOUR_STOPS[currentStopIdx]?.mainPhoto;
    const galleryIdx = INFRA_GALLERY_PHOTOS.findIndex(p => p.src === currentSrc);
    openLightbox(galleryIdx !== -1 ? galleryIdx : 0);
  }

  // Interactive Toolbar Chips under Viewport
  const chipTourPrevNext = document.getElementById('chipTourPrevNext');
  const chipTourRooms = document.getElementById('chipTourRooms');
  const chipTourZones = document.getElementById('chipTourZones');
  const chipTourAutoplay = document.getElementById('chipTourAutoplay');
  const chipTourFullscreen = document.getElementById('chipTourFullscreen');

  chipTourPrevNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToNextPhoto();
    stopAutoplay();
  });

  chipTourRooms?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToStop(currentStopIdx + 1, 0);
    stopAutoplay();
  });

  chipTourZones?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToStop(currentStopIdx + 1, 0);
    stopAutoplay();
  });

  chipTourAutoplay?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isAutoplay) stopAutoplay();
    else startAutoplay();
  });

  chipTourFullscreen?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleTourFullscreen();
  });

  // ------------------------------------------------------------------------
  // KEYBOARD NAVIGATION (TECLAS DE DIRECCIÓN, NÚMEROS Y ACCIONES)
  // ------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    // Avoid intercepting if focus is on form fields
    const activeEl = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeEl === 'input' || activeEl === 'textarea' || activeEl === 'select') return;

    // 1. If Lightbox is open
    if (oficinaLightbox?.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrevBtn?.click();
      if (e.key === 'ArrowRight') lightboxNextBtn?.click();
      return;
    }

    // 2. If Tour Panel is active
    if (panelTourView?.classList.contains('active') || panelTourView?.style.display !== 'none') {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        goToNextPhoto();
        stopAutoplay();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        goToPrevPhoto();
        stopAutoplay();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        goToStop(currentStopIdx + 1, 0);
        stopAutoplay();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        goToStop(currentStopIdx - 1, 0);
        stopAutoplay();
      } else if (e.key >= '1' && e.key <= '7') {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= INFRA_TOUR_STOPS.length) {
          e.preventDefault();
          goToStop(num - 1, 0);
          stopAutoplay();
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (isAutoplay) stopAutoplay();
        else startAutoplay();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleTourFullscreen();
      }
    }
  });

  // ------------------------------------------------------------------------
  // GALLERY & LIGHTBOX CONTROLLER
  // ------------------------------------------------------------------------
  const galleryGrid = document.getElementById('galleryPhotosGrid');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  let currentFilter = 'all';

  function renderGallery() {
    if (!galleryGrid) return;
    const items = INFRA_GALLERY_PHOTOS.filter(item => {
      return currentFilter === 'all' || item.category === currentFilter;
    });

    galleryGrid.innerHTML = items.map((item, idx) => `
      <div class="gallery-photo-card" data-index="${item.number - 1}" data-category="${item.category}">
        <img src="${item.src}" alt="${item.title}" loading="lazy" />
        <div class="gallery-card-overlay">
          <span class="gallery-card-category">${item.category.toUpperCase()}</span>
          <h4 class="gallery-card-title">${item.title}</h4>
        </div>
        <div class="gallery-card-zoom-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </div>
      </div>
    `).join('');

    galleryGrid.querySelectorAll('.gallery-photo-card').forEach(card => {
      card.addEventListener('click', () => {
        const originalIndex = parseInt(card.dataset.index, 10);
        openLightbox(originalIndex);
      });
    });
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'all';
      renderGallery();
    });
  });

  // Lightbox Modal State
  const oficinaLightbox = document.getElementById('oficinaLightbox');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');
  let currentLightboxIdx = 0;

  function openLightbox(idx) {
    if (!oficinaLightbox || !INFRA_GALLERY_PHOTOS.length) return;
    currentLightboxIdx = (idx + INFRA_GALLERY_PHOTOS.length) % INFRA_GALLERY_PHOTOS.length;
    updateLightboxContent();
    oficinaLightbox.style.display = 'flex';
    void oficinaLightbox.offsetWidth;
    oficinaLightbox.classList.add('active');
    oficinaLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!oficinaLightbox) return;
    oficinaLightbox.classList.remove('active');
    oficinaLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!oficinaLightbox.classList.contains('active')) {
        oficinaLightbox.style.display = 'none';
      }
    }, 260);
  }

  function updateLightboxContent() {
    const item = INFRA_GALLERY_PHOTOS[currentLightboxIdx];
    if (!item) return;
    if (lightboxImg) {
      lightboxImg.style.opacity = '0.5';
      lightboxImg.src = item.src;
      lightboxImg.onload = () => {
        lightboxImg.style.opacity = '1';
      };
      lightboxImg.onerror = () => {
        lightboxImg.style.opacity = '1';
      };
      setTimeout(() => {
        if (lightboxImg) lightboxImg.style.opacity = '1';
      }, 150);
    }
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDesc) lightboxDesc.textContent = item.description;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${String(currentLightboxIdx + 1).padStart(2, '0')} / ${String(INFRA_GALLERY_PHOTOS.length).padStart(2, '0')}`;
    }
  }

  lightboxCloseBtn?.addEventListener('click', closeLightbox);
  lightboxOverlay?.addEventListener('click', closeLightbox);
  lightboxPrevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIdx = (currentLightboxIdx - 1 + INFRA_GALLERY_PHOTOS.length) % INFRA_GALLERY_PHOTOS.length;
    updateLightboxContent();
  });
  lightboxNextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIdx = (currentLightboxIdx + 1) % INFRA_GALLERY_PHOTOS.length;
    updateLightboxContent();
  });

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!oficinaLightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrevBtn?.click();
    if (e.key === 'ArrowRight') lightboxNextBtn?.click();
  });

  // ------------------------------------------------------------------------
  // INITIALIZATION CALLS
  // ------------------------------------------------------------------------
  renderBlueprintPins();
  goToStop(0, 0);
  renderGallery();
}

// --------------------------------------------------------------------------
// FLOATING WHATSAPP BUTTON (ACTIVATION ON SCROLL)
// --------------------------------------------------------------------------
function initFloatingWhatsApp() {
  const floatingBtn = document.getElementById('floatingWaBtn');
  if (!floatingBtn) return;

  let isTicking = false;

  function updateFloatingBtnVisibility() {
    if (window.scrollY > 380) {
      floatingBtn.classList.add('is-visible');
    } else {
      floatingBtn.classList.remove('is-visible');
    }
    isTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(updateFloatingBtnVisibility);
      isTicking = true;
    }
  }, { passive: true });

  updateFloatingBtnVisibility();
}

// --------------------------------------------------------------------------
// COUNT-UP ANIMATION FOR KPI NUMBERS
// --------------------------------------------------------------------------
function initCountUp() {
  const targets = document.querySelectorAll('.count-up-target');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute('data-target')) || 0;
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentCount = Math.round(targetVal * easeOut);

          let displayNum = currentCount.toString();
          if (prefix === '0' && currentCount < 10) {
            displayNum = '0' + displayNum;
            el.textContent = displayNum + suffix;
          } else {
            el.textContent = prefix + displayNum + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            if (prefix === '0' && targetVal < 10) {
              el.textContent = '0' + targetVal + suffix;
            } else {
              el.textContent = prefix + targetVal + suffix;
            }
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  targets.forEach(t => observer.observe(t));
}

// --------------------------------------------------------------------------
// TECHNICAL BRIEF MODAL & RFP SUBMISSION
// --------------------------------------------------------------------------
function initBriefModal() {
  const modal = document.getElementById('briefModal');
  const openBtn = document.getElementById('btnOpenBriefModal');
  const closeBtn = document.getElementById('btnCloseBriefModal');
  const form = document.getElementById('briefForm');
  const fileInput = document.getElementById('briefFileInput');
  const fileLabel = document.getElementById('briefFileLabel');
  const dropzone = document.getElementById('briefDropzone');
  const successMsg = document.getElementById('briefSuccessMsg');
  const submitBtn = document.getElementById('btnSubmitBrief');

  if (!modal || !openBtn) return;

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // File upload label update
  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        fileLabel.textContent = `Archivo cargado: ${file.name} (${sizeMb} MB)`;
        dropzone?.classList.add('has-file');
      }
    });
  }

  // Drag & drop visual feedback
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });
  }

  // Form submit simulation
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Procesando requerimiento...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        if (successMsg) successMsg.style.display = 'flex';
        submitBtn.style.display = 'none';

        setTimeout(() => {
          closeModal();
          form.reset();
          if (fileLabel) fileLabel.textContent = 'Adjuntar archivo o planos (PDF, DWG, ZIP)';
          submitBtn.innerHTML = origText;
          submitBtn.style.display = 'flex';
          submitBtn.disabled = false;
          if (successMsg) successMsg.style.display = 'none';
        }, 4000);
      }, 800);
    });
  }
}

