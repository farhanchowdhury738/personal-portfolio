'use strict';

const toggleActiveClass = (element) => element.classList.toggle('active');

const escapeHTML = (text = '') => String(text).replace(/[&<>'"]/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#039;',
  '"': '&quot;'
})[char]);

// Theme switcher
const themeToggleButton = document.querySelector('[data-theme-toggle]');
const themeToggleLabel = document.querySelector('[data-theme-label]');
const themeToggleIcon = themeToggleButton?.querySelector('ion-icon');

const setPortfolioTheme = (theme) => {
  const selectedTheme = theme === 'light' ? 'light' : 'dark';

  document.body.dataset.theme = selectedTheme;

  if (themeToggleLabel) {
    themeToggleLabel.innerText = selectedTheme === 'light' ? 'Dark' : 'Light';
  }

  if (themeToggleIcon) {
    themeToggleIcon.setAttribute('name', selectedTheme === 'light' ? 'moon-outline' : 'sunny-outline');
  }

  if (themeToggleButton) {
    themeToggleButton.setAttribute(
      'aria-label',
      selectedTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
    );
  }

  localStorage.setItem('portfolio-theme', selectedTheme);
};

setPortfolioTheme(localStorage.getItem('portfolio-theme') || 'dark');

themeToggleButton?.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
  setPortfolioTheme(nextTheme);
});

// Sidebar contact panel
const sidebar = document.querySelector('[data-sidebar]');
const sidebarToggleButton = document.querySelector('[data-sidebar-btn]');

sidebarToggleButton?.addEventListener('click', () => toggleActiveClass(sidebar));

// Testimonial video modal
const testimonialCards = document.querySelectorAll('[data-testimonials-item]');
const testimonialModal = document.querySelector('[data-modal-container]');
const testimonialOverlay = document.querySelector('[data-overlay]');
const testimonialCloseButton = document.querySelector('[data-modal-close-btn]');
const testimonialAvatar = document.querySelector('[data-modal-img]');
const testimonialTitle = document.querySelector('[data-modal-title]');
const testimonialText = document.querySelector('[data-modal-text]');
const testimonialVideoFrame = document.querySelector('[data-modal-video]');

const closeTestimonialVideo = () => {
  if (!testimonialVideoFrame) return;

  testimonialVideoFrame.innerHTML = '';
  testimonialVideoFrame.classList.remove('active');
};

const toggleTestimonialModal = () => {
  const modalIsOpen = testimonialModal?.classList.contains('active');

  testimonialModal?.classList.toggle('active');
  testimonialOverlay?.classList.toggle('active');

  if (modalIsOpen) closeTestimonialVideo();
};

const setTestimonialVideo = (videoUrl, title) => {
  if (!testimonialVideoFrame) return;

  closeTestimonialVideo();

  if (!videoUrl) return;

  testimonialVideoFrame.classList.add('active');

  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    testimonialVideoFrame.innerHTML = `
      <iframe
        src="${videoUrl}"
        title="${escapeHTML(title)} testimonial video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
    `;
    return;
  }

  testimonialVideoFrame.innerHTML = `
    <video controls autoplay playsinline>
      <source src="${videoUrl}">
      Your browser does not support the video tag.
    </video>
  `;
};

testimonialCards.forEach((card) => {
  card.addEventListener('click', function () {
    const avatar = this.querySelector('[data-testimonials-avatar]');
    const title = this.querySelector('[data-testimonials-title]');
    const text = this.querySelector('[data-testimonials-text]');

    testimonialAvatar.src = avatar.src;
    testimonialAvatar.alt = avatar.alt;
    testimonialTitle.innerHTML = title.innerHTML;
    testimonialText.innerHTML = text.innerHTML;

    setTestimonialVideo(this.dataset.testimonialsVideo, testimonialTitle.innerText);
    toggleTestimonialModal();
  });
});

testimonialCloseButton?.addEventListener('click', toggleTestimonialModal);
testimonialOverlay?.addEventListener('click', toggleTestimonialModal);

// Portfolio project data and modal
const portfolioSection = document.querySelector('[data-portfolio-section]');
const projectList = document.querySelector('[data-project-list]');
const portfolioStatus = document.querySelector('[data-portfolio-status]');
const filterList = document.querySelector('[data-filter-list]');
const select = document.querySelector('[data-select]');
const selectList = document.querySelector('[data-filter-select-list]');
const selectValue = document.querySelector('[data-select-value]');

const projectModal = document.querySelector('[data-project-modal-container]');
const projectOverlay = document.querySelector('[data-project-overlay]');
const projectModalCloseButton = document.querySelector('[data-project-modal-close-btn]');
const projectModalCover = document.querySelector('[data-project-modal-cover]');
const projectModalCategory = document.querySelector('[data-project-modal-category]');
const projectModalTitle = document.querySelector('[data-project-modal-title]');
const projectModalName = document.querySelector('[data-project-modal-name]');
const projectModalStart = document.querySelector('[data-project-modal-start]');
const projectModalEnd = document.querySelector('[data-project-modal-end]');
const projectModalDescription = document.querySelector('[data-project-modal-description]');
const projectModalReadme = document.querySelector('[data-project-modal-readme]');
const projectModalLanguage = document.querySelector('[data-project-modal-language]');
const projectModalSite = document.querySelector('[data-project-modal-site]');
const projectModalTopics = document.querySelector('[data-project-modal-topics]');
const projectModalLink = document.querySelector('[data-project-modal-link]');
const projectModalScrollBody = document.querySelector('[data-project-modal-scroll-body]');

const defaultProjectImage = './assets/images/project-1.jpg';
let portfolioProjects = Array.isArray(window.manualPortfolioProjects) ? window.manualPortfolioProjects : [];
let activeProjectCategory = 'all';

const formatCategoryName = (category) => {
  if (!category) return 'Other';
  return String(category).replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getProjectTitle = (project) => project.title || project.name || 'Untitled Project';
const getProjectCover = (project) => project.cover || defaultProjectImage;
const getProjectSite = (project) => project.site || project.github || '#';

const buildProjectDetails = (project) => {
  const description = project.description ? `<p>${escapeHTML(project.description)}</p>` : '';
  const features = Array.isArray(project.features) && project.features.length
    ? `<h4>✨ Features</h4><ul>${project.features.map((feature) => `<li>${escapeHTML(feature)}</li>`).join('')}</ul>`
    : '';
  const technologies = Array.isArray(project.technologies) && project.technologies.length
    ? `<h4>🖥 Technologies Used</h4><ul>${project.technologies.map((tech) => `<li>${escapeHTML(tech)}</li>`).join('')}</ul>`
    : '';
  const reason = project.why ? `<h4>💡 Why this project?</h4><p>${escapeHTML(project.why)}</p>` : '';
  const runningSteps = Array.isArray(project.howToRun) && project.howToRun.length
    ? `<h4>🚀 How to Run</h4><ul>${project.howToRun.map((step) => `<li>${escapeHTML(step)}</li>`).join('')}</ul>`
    : '';
  const extraDetails = project.details ? `<p>${escapeHTML(project.details)}</p>` : '';

  return project.detailsHTML
    || `${description}${features}${technologies}${reason}${runningSteps}${extraDetails}`
    || '<p>Project details are not added yet.</p>';
};

const renderFilterOptions = (categories) => {
  const filterButtons = ['all', ...categories];

  filterList.innerHTML = filterButtons.map((category, index) => `
    <li class="filter-item">
      <button class="${index === 0 ? 'active' : ''}" data-filter-btn>${formatCategoryName(category)}</button>
    </li>
  `).join('');

  selectList.innerHTML = filterButtons.map((category) => `
    <li class="select-item">
      <button data-select-item>${formatCategoryName(category)}</button>
    </li>
  `).join('');
};

const renderProjects = () => {
  const visibleProjects = activeProjectCategory === 'all'
    ? portfolioProjects
    : portfolioProjects.filter((project) => String(project.category).toLowerCase() === activeProjectCategory);

  if (!visibleProjects.length) {
    portfolioStatus.textContent = 'No projects found in this category.';
    portfolioStatus.style.display = 'block';
    projectList.innerHTML = '';
    return;
  }

  portfolioStatus.style.display = 'none';
  projectList.innerHTML = visibleProjects.map((project) => `
    <li class="project-item active" data-filter-item data-category="${escapeHTML(project.category || 'Other')}">
      <button class="project-card-btn" type="button" data-project-index="${project.originalIndex}">
        <figure class="project-img project-cover-img">
          <div class="project-item-icon-box">
            <ion-icon name="eye-outline"></ion-icon>
          </div>
          <img
            src="${escapeHTML(getProjectCover(project))}"
            alt="${escapeHTML(getProjectTitle(project))} cover photo"
            loading="lazy"
            onerror="this.src='${defaultProjectImage}'">
        </figure>
        <h3 class="project-title">${escapeHTML(getProjectTitle(project))}</h3>
        <p class="project-category">${escapeHTML(formatCategoryName(project.category || 'Other'))}</p>
      </button>
    </li>
  `).join('');
};

const filterProjects = (selectedValue) => {
  activeProjectCategory = selectedValue.toLowerCase();
  selectValue.innerText = formatCategoryName(activeProjectCategory);
  renderProjects();
};

const setupPortfolioFilters = () => {
  if (!select || !selectList || !filterList) return;

  select.addEventListener('click', function () {
    toggleActiveClass(this);
  });

  selectList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-select-item]');
    if (!button) return;

    filterProjects(button.innerText.toLowerCase());
    toggleActiveClass(select);
  });

  filterList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter-btn]');
    if (!button) return;

    filterProjects(button.innerText.toLowerCase());

    filterList.querySelector('button.active')?.classList.remove('active');
    button.classList.add('active');
  });
};

const toggleProjectModal = () => {
  projectModal?.classList.toggle('active');
  document.body.classList.toggle('modal-open');
};

const openProjectModal = (project) => {
  const siteLink = getProjectSite(project);
  const title = getProjectTitle(project);

  projectModalCover.src = getProjectCover(project);
  projectModalCover.alt = `${title} cover photo`;
  projectModalCover.onerror = function () {
    this.src = defaultProjectImage;
  };

  projectModalCategory.innerText = formatCategoryName(project.category || 'Other');
  projectModalTitle.innerText = title;
  projectModalName.innerText = title;
  projectModalStart.innerText = project.startDate || 'Not specified';
  projectModalEnd.innerText = project.endDate || 'Present';
  projectModalLanguage.innerText = project.language || 'Not specified';
  projectModalSite.href = siteLink;
  projectModalSite.innerText = project.site ? 'Open live site' : (project.github ? 'Open GitHub' : 'No site added');
  projectModalDescription.innerText = project.description || '';
  projectModalLink.href = project.github || siteLink;
  projectModalLink.style.display = project.github ? 'flex' : 'none';
  projectModalReadme.innerHTML = buildProjectDetails(project);

  const projectTopics = project.technologies || project.topics || [];
  projectModalTopics.innerHTML = projectTopics.length
    ? projectTopics.map((topic) => `<span>${escapeHTML(topic)}</span>`).join('')
    : `<span>${escapeHTML(project.category || 'Project')}</span>`;

  if (projectModalScrollBody) projectModalScrollBody.scrollTop = 0;

  toggleProjectModal();
};

const setupProjectModal = () => {
  if (!projectList || !projectModal) return;

  projectList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-project-index]');
    if (!button) return;

    const project = portfolioProjects[button.dataset.projectIndex];
    if (project) openProjectModal(project);
  });

  projectModalCloseButton?.addEventListener('click', toggleProjectModal);
  projectOverlay?.addEventListener('click', toggleProjectModal);
};

const loadPortfolioProjects = () => {
  if (!portfolioSection) return;

  portfolioProjects = portfolioProjects.map((project, index) => ({ ...project, originalIndex: index }));

  if (!portfolioProjects.length) {
    portfolioStatus.textContent = 'No projects added yet. Add projects in assets/data/portfolio-data.js';
    return;
  }

  const categories = [...new Set(
    portfolioProjects.map((project) => String(project.category || 'Other').toLowerCase())
  )].sort();

  renderFilterOptions(categories);
  renderProjects();
};

// Contact form validation
const contactForm = document.querySelector('[data-form]');
const contactFormInputs = document.querySelectorAll('[data-form-input]');
const contactSubmitButton = document.querySelector('[data-form-btn]');

contactFormInputs.forEach((input) => {
  input.addEventListener('input', () => {
    if (contactForm.checkValidity()) {
      contactSubmitButton.removeAttribute('disabled');
    } else {
      contactSubmitButton.setAttribute('disabled', '');
    }
  });
});

// Page navigation
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

navigationLinks.forEach((link) => {
  link.addEventListener('click', function () {
    pages.forEach((page, index) => {
      const pageIsSelected = this.innerText.toLowerCase() === page.dataset.page;

      page.classList.toggle('active', pageIsSelected);
      navigationLinks[index].classList.toggle('active', pageIsSelected);

      if (pageIsSelected) window.scrollTo(0, 0);
    });
  });
});

setupPortfolioFilters();
setupProjectModal();
loadPortfolioProjects();
