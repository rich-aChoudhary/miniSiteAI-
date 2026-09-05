// Dashboard Application
document.addEventListener('DOMContentLoaded', function() {
  initDashboard();
  checkAuth();
  initEventListeners();
  loadUserData();
  loadDashboardData();
});

const dashboardState = {
  currentUser: null,
  portfolios: [],
  notifications: [],
  currentStep: 1,
  portfolioData: {
    basicInfo: {},
    skills: [],
    experience: {},
    customization: {}
  },
  templates: [
    {
      id: 1,
      name: "Minimal Developer",
      category: "minimal",
      description: "Clean and professional design for developers",
      features: ["Responsive design", "SEO optimized", "Dark mode", "Easy customization"]
    },
    {
      id: 2,
      name: "Creative Designer",
      category: "creative",
      description: "Modern portfolio with visual flair",
      features: ["Interactive elements", "Portfolio gallery", "Animation effects", "Custom colors"]
    },
    {
      id: 3,
      name: "Corporate Professional",
      category: "corporate",
      description: "Formal business style portfolio",
      features: ["Professional layout", "Resume integration", "Testimonial section", "Contact form"]
    },
    {
      id: 4,
      name: "Startup Founder",
      category: "creative",
      description: "Bold and energetic design",
      features: ["Call-to-action focused", "Social proof section", "Blog integration", "Newsletter signup"]
    },
    {
      id: 5,
      name: "Academic Researcher",
      category: "minimal",
      description: "Clean layout for academic work",
      features: ["Publication listing", "Research focus", "Conference presentations", "CV download"]
    },
    {
      id: 6,
      name: "Freelancer",
      category: "creative",
      description: "Showcase services and projects",
      features: ["Service packages", "Project portfolio", "Client testimonials", "Booking system"]
    }
  ]
};
function showToast(message, type = 'info') {
    // Example
    Toastify({
        text: message,
        duration: 4000,
        gravity: "top",
        position: "right",
        style: {
            background: type === 'error'
                ? "#ff4d4f"
                : type === 'warning'
                ? "#faad14"
                : "#1890ff"
        }
    }).showToast();
}
// Initialize Dashboard
function initDashboard() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Check Authentication
function checkAuth() {
  const user = getUserFromStorage();
  
  if (!user) {
    // Redirect to login page
    window.location.href = 'login';
    return;
  }
  
  dashboardState.currentUser = user;
  updateUserUI(user);
}

// Get User from Storage
function getUserFromStorage() {
  try {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

// Update User UI
function updateUserUI(user) {
  // Update user name
  const userNameElements = document.querySelectorAll('#userName, #userNameSmall, #welcomeUserName, #profileUserName');
  userNameElements.forEach(el => {
    if (el) 
      
      {
        el.textContent = user.username || 'User';
        // el.textContent = user.credits|| 0;

      }
  });
  
  // Update user email
  const userEmailElements = document.querySelectorAll('#userEmail, #profileUserEmail');
  userEmailElements.forEach(el => {
    if (el) el.textContent = user.email || 'user@example.com';
  });
  
  // Update member since
  const memberSinceElement = document.getElementById('memberSince');
  if (memberSinceElement && user.createdAt) {
    const date = new Date(user.createdAt);
    memberSinceElement.textContent = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  
  // Set initial profile form values
  document.getElementById('profileFullName').value = user.name || '';
  document.getElementById('profileEmail').value = user.email || '';
  document.getElementById('profileUsername').value = user.username || '';
}

// Load User Data
async function loadUserData() {
   const userData= await getUserFromStorage();
    const res = await fetch(`/api/my-portfolios/${userData.id}`);
    const savedPortfolios = await res.json();
    if (savedPortfolios.length >= 0) {
      dashboardState.portfolios = savedPortfolios;
      updatePortfolioList();
      updateDashboardStats();
    }
    
  }


// Load Dashboard Data
function loadDashboardData() {
  // Update portfolio count
  const portfolioCountElement = document.getElementById('portfolioCount');
  if (portfolioCountElement) {
    portfolioCountElement.textContent = dashboardState.portfolios.length;
  }
  
  // Update total views (simulated)
  const totalViewsElement = document.getElementById('totalViews');
  if (totalViewsElement) {
    const totalViews = dashboardState.portfolios.reduce((sum, portfolio) => sum + (portfolio.views || 0), 0);
    totalViewsElement.textContent = totalViews.toLocaleString();
  }
  
  // Update completion rate (simulated)
  const completionRateElement = document.getElementById('completionRate');
  if (completionRateElement) {
    const completed = dashboardState.portfolios.filter(p => p.status === 'published').length;
    const total = dashboardState.portfolios.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    completionRateElement.textContent = `${rate}%`;
  }
  
  // Load recent portfolios
  updateRecentPortfolios();
  
  // Load templates
  loadTemplates();
}

// Initialize Event Listeners
function initEventListeners() {
  // Sidebar navigation
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all nav items
      navItems.forEach(nav => nav.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
      
      // Get section ID
      const sectionId = this.getAttribute('href').substring(1);
      
      // Update page title
      const pageTitle = document.getElementById('pageTitle');
      if (pageTitle) {
        pageTitle.textContent = this.querySelector('span').textContent;
      }
      
      // Update breadcrumb
      const breadcrumb = document.getElementById('breadcrumb');
      if (breadcrumb) {
        breadcrumb.innerHTML = `<span>Home</span> / <span>${this.querySelector('span').textContent}</span>`;
      }
      
      // Show corresponding section
      showSection(sectionId);
    });
  });
  
  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      document.querySelector('.sidebar').classList.toggle('active');
    });
  }
  
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Notification bell
  const notificationBell = document.getElementById('notificationBell');
  if (notificationBell) {
    notificationBell.addEventListener('click', toggleNotificationPanel);
  }
  
  // Notification close button
  const notificationCloseBtn = document.getElementById('notificationCloseBtn');
  if (notificationCloseBtn) {
    notificationCloseBtn.addEventListener('click', toggleNotificationPanel);
  }
  
  // Quick action buttons
  const actionCards = document.querySelectorAll('.action-card');
  actionCards.forEach(card => {
    card.addEventListener('click', function() {
      const action = this.getAttribute('data-action');
      handleQuickAction(action);
    });
  });
  
  // Create first portfolio button
  const createFirstPortfolioBtn = document.getElementById('createFirstPortfolio');
  if (createFirstPortfolioBtn) {
    createFirstPortfolioBtn.addEventListener('click', function() {
      showSection('ai-portfolio');
      document.querySelector('.nav-item[data-section="ai-portfolio"]').click();
    });
  }

  // Profile form
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileUpdate);
  }
  
  // Cancel profile changes
  const cancelProfileChangesBtn = document.getElementById('cancelProfileChanges');
  if (cancelProfileChangesBtn) {
    cancelProfileChangesBtn.addEventListener('click', function() {
      // Reset form to current user data
      updateUserUI(dashboardState.currentUser);
    });
  }
  
  // Delete account button
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', handleDeleteAccount);
  }
  
  // Template filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all filter buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Filter templates
      const filter = this.getAttribute('data-filter');
      filterTemplates(filter);
    });
  });
  
  // Template preview modal
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', function() {
      document.getElementById('templatePreviewModal').classList.add('hidden');
    });
  }
  
  // Use template button
  const useTemplateBtn = document.getElementById('useTemplateBtn');
  if (useTemplateBtn) {
    useTemplateBtn.addEventListener('click', function() {
     
     showToast(`Feature is coming soon.`, 'info');
      
      // Close modal
      document.getElementById('templatePreviewModal').classList.add('hidden');
      
      // Navigate to portfolio creation
      showSection('ai-portfolio');
      document.querySelector('.nav-item[data-section="ai-portfolio"]').click();
    });
  }
  
  // Support form
  const supportForm = document.getElementById('supportForm');
  if (supportForm) {
    supportForm.addEventListener('submit', handleSupportSubmit);
  }
  
  // Support action buttons
  const supportActionButtons = ['knowledgeBaseBtn', 'videoTutorialsBtn', 'communityForumBtn', 'contactSupportBtn', 'faqLink'];
  supportActionButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        alert(`This would open ${btnId.replace('Btn', '').replace('Link', '')}`);
      });
    }
  });
  
  // Bio character counter
  const bioTextarea = document.getElementById('shortBio');
  if (bioTextarea) {
    bioTextarea.addEventListener('input', function() {
      const charCount = this.value.length;
      document.getElementById('bioCharCount').textContent = charCount;
    });
  }
  
  // Profile bio character counter
  const profileBioTextarea = document.getElementById('profileBio');
  if (profileBioTextarea) {
    profileBioTextarea.addEventListener('input', function() {
      const charCount = this.value.length;
      document.getElementById('profileBioCharCount').textContent = charCount;
    });
  }
  
  // Avatar upload button
  const avatarUploadBtn = document.getElementById('avatarUploadBtn');
  if (avatarUploadBtn) {
    avatarUploadBtn.addEventListener('click', function() {
      // Create file input
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      
      fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
          const file = e.target.files[0];
          // In a real app, you would upload the file to a server
          alert(`Avatar "${file.name}" selected. In a real app, this would upload to the server.`);
        }
      });
      
      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);
    });
  }
  
  // File attachment for support form
  const supportAttachment = document.getElementById('supportAttachment');
  if (supportAttachment) {
    supportAttachment.addEventListener('change', function(e) {
      const fileList = document.getElementById('fileList');
      fileList.innerHTML = '';
      
      Array.from(e.target.files).forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
          <span>${file.name}</span>
          <button class="remove-file" data-index="${index}">&times;</button>
        `;
        fileList.appendChild(fileItem);
      });
      
      // Add event listeners to remove buttons
      document.querySelectorAll('.remove-file').forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          // Remove file from input (simplified - in real app you'd need to update FileList)
          alert(`File ${index + 1} removed. In a real app, this would update the file list.`);
        });
      });
    });
  }
}

// Show Section
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Close sidebar on mobile
  if (window.innerWidth < 992) {
    document.querySelector('.sidebar').classList.remove('active');
  }
}

// Handle Logout
function handleLogout() {
  // Clear user data from storage
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
  
  // Redirect to login page
  window.location.href = 'login';
}

// Toggle Notification Panel
function toggleNotificationPanel() {
  const notificationPanel = document.getElementById('notificationPanel');
  if (notificationPanel) {
    notificationPanel.classList.toggle('active');
  }
}


// Handle Quick Action
function handleQuickAction(action) {
  switch(action) {
    case 'create-portfolio':
      showSection('ai-portfolio');
      document.querySelector('.nav-item[data-section="ai-portfolio"]').click();
      break;
    case 'view-templates':
      showSection('templates');
      document.querySelector('.nav-item[data-section="templates"]').click();
      break;
    case 'view-analytics':
      showToast('Analytics feature coming soon!', 'info');
      break;
    case 'get-support':
      showSection('support');
      document.querySelector('.nav-item[data-section="support"]').click();
      break;
  }
}

// Update Recent Portfolios
function updateRecentPortfolios() {
  const recentPortfoliosContainer = document.getElementById('recentPortfolios');
  if (!recentPortfoliosContainer) return;
  
  if (dashboardState.portfolios.length === 0) {
    // Show empty state (already in HTML)
    return;
  }
  
  // Clear empty state
  recentPortfoliosContainer.innerHTML = '';
  
  // Show recent portfolios (limit to 4)
  const recentPortfolios = dashboardState.portfolios.slice(0, 4);
  
  recentPortfolios.forEach(portfolio => {
    const portfolioCard = document.createElement('div');
    portfolioCard.className = 'portfolio-card';
    portfolioCard.innerHTML = `
      <div class="portfolio-card-header">
        <h4>${portfolio.title}</h4>
        <span class="portfolio-status ${portfolio.status}">${portfolio.status}</span>
      </div>
      <p>Created: ${new Date(portfolio.createdAt).toLocaleDateString()}</p>
      <div class="portfolio-card-actions">
        <button class="btn-small view-portfolio" data-id="${portfolio.id}">View</button>
        <button class="btn-small edit-portfolio" data-id="${portfolio.id}">Edit</button>
        <button class="btn-small download-portfolio" data-id="${portfolio.id}">Download</button>
      </div>
    `;
    
    recentPortfoliosContainer.appendChild(portfolioCard);
  });
  
  // Add event listeners to portfolio buttons
  document.querySelectorAll('.view-portfolio').forEach(btn => {
    btn.addEventListener('click', function() {
      const portfolioId = this.getAttribute('data-id');
      viewPortfolio(portfolioId);
    });
  });
  
  document.querySelectorAll('.edit-portfolio').forEach(btn => {
    btn.addEventListener('click', function() {
      const portfolioId = this.getAttribute('data-id');
      editPortfolio(portfolioId);
    });
  });
  
  document.querySelectorAll('.download-portfolio').forEach(btn => {
    btn.addEventListener('click', function() {
      const portfolioId = this.getAttribute('data-id');
      downloadPortfolio(portfolioId);
    });
  });
}


// Update Portfolio List
function updatePortfolioList() {
  const portfolioTableBody = document.getElementById('recentPortfolios');
  const emptyState = document.getElementById('emptyPortfolioState');
  const tableWrapper = document.getElementById('portfolioTableWrapper');
  
  if (!portfolioTableBody || !emptyState || !tableWrapper) return;
  
  if (dashboardState.portfolios.length === 0) {
    emptyState.style.display = 'block';
    tableWrapper.style.display = 'none';
    return;
  }
  
  // Show table and hide empty state
  emptyState.style.display = 'none';
  tableWrapper.style.display = 'block';
  
  // Clear existing rows
  portfolioTableBody.innerHTML = '';
  
  // Add portfolio rows
  dashboardState.portfolios.forEach(p => {
    const row = document.createElement('tr');
    
    // Format date
    const createdDate = new Date(p.created_at);
    const formattedDate = createdDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    row.innerHTML = `
      <td>${p.title}</td>
      <td>${formattedDate}</td>
      <td>
        <div class="action-buttons">
          <a href="/portfolio/${p.id}" target="_blank" class="action-link view-portfolio-list" data-id="${p.id}">
            <i class="fas fa-eye"></i> View
          </a>
          <button class="action-button edit-portfolio-list" data-id="${p.id}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="action-button download download-portfolio-list" data-id="${p.id}">
            <i class="fas fa-download"></i> Download
          </button>
          <button class="action-button delete delete-portfolio-list" data-id="${p.id}">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </td>
    `;
    
    portfolioTableBody.appendChild(row);
  });
  

  
  document.querySelectorAll('.edit-portfolio-list').forEach(btn => {
    btn.addEventListener('click', function() {
      const portfolioId = this.getAttribute('data-id');
      editPortfolio(portfolioId);
    });
  });
  
  document.querySelectorAll('.delete-portfolio-list').forEach(btn => {
    btn.addEventListener('click', function() {
      const portfolioId = this.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this portfolio?')) {
        deletePortfolio(portfolioId);
      }
    });
  });

  document.querySelectorAll('.download-portfolio-list').forEach(btn => {
    btn.addEventListener('click', function() {
      const portfolioId = this.getAttribute('data-id');
      downloadPortfolio(portfolioId);
    });
  });
}

// Delete Portfolio
function deletePortfolio(id) {
  if (!confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) return;

  // Call server API to delete
  fetch(`/api/portfolio/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
    .then(async res => {
      const text = await res.text().catch(() => '');
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch (e) { data = {}; }

      if (res.ok) {
        // Remove locally and update UI
        dashboardState.portfolios = dashboardState.portfolios.filter(p => p.id !== parseInt(id));
        updatePortfolioList();
        updateRecentPortfolios();
        updateDashboardStats();
        alert(data.message || 'Portfolio deleted successfully.');
      } else {
        console.error('Delete failed', res.status, text, data);
        alert(data.error || data.message || 'Failed to delete portfolio.');
      }
    })
    .catch(err => {
      console.error('Delete error', err);
      alert('An error occurred while deleting the portfolio.');
    });
}

// Update Dashboard Stats
function updateDashboardStats() {
  const portfolioCountElement = document.getElementById('portfolioCount');
  if (portfolioCountElement) {
    portfolioCountElement.textContent = dashboardState.portfolios.length;
  }
}


// Add Skill
function addSkill() {
  const skillInput = document.getElementById('skillInput');
  const skillsTags = document.getElementById('skillsTags');
  
  const skill = skillInput.value.trim();
  if (skill && !dashboardState.portfolioData.skills.includes(skill)) {
    // Add to state
    dashboardState.portfolioData.skills.push(skill);
    
    // Create skill tag
    const skillTag = document.createElement('div');
    skillTag.className = 'skill-tag';
    skillTag.innerHTML = `
      ${skill}
      <span class="remove-skill" data-skill="${skill}">&times;</span>
    `;
    
    skillsTags.appendChild(skillTag);
    
    // Clear input
    skillInput.value = '';
    
    // Add event listener to remove button
    skillTag.querySelector('.remove-skill').addEventListener('click', function() {
      const skillToRemove = this.getAttribute('data-skill');
      removeSkill(skillToRemove);
    });
  }
}

// Remove Skill
function removeSkill(skill) {
  // Remove from state
  dashboardState.portfolioData.skills = dashboardState.portfolioData.skills.filter(s => s !== skill);
  
  // Remove from UI
  const skillTag = document.querySelector(`.remove-skill[data-skill="${skill}"]`)?.parentElement;
  if (skillTag) {
    skillTag.remove();
  }
}

// Validate Step 1
function validateStep1() {
  const title = document.getElementById('portfolioTitle').value.trim();
  const name = document.getElementById('fullName').value.trim();
  const jobTitle = document.getElementById('jobTitle').value.trim();
  const bio = document.getElementById('shortBio').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  
  if (!title || !name || !jobTitle || !bio || !email) {
    alert('Please fill in all required fields.');
    return false;
  }
  
  if (bio.length > 200) {
    alert('Bio should be 200 characters or less.');
    return false;
  }
  
  if (!isValidEmail(email)) {
    alert('Please enter a valid email address.');
    return false;
  }
  
  return true;
}

// Validate Step 2
function validateStep2() {
  if (dashboardState.portfolioData.skills.length === 0) {
    alert('Please add at least one skill.');
    return false;
  }
  
  return true;
}

// Validate Step 3
function validateStep3() {
  if (!dashboardState.portfolioData.customization.template) {
    alert('Please select a template.');
    return false;
  }
  
  return true;
}

// Save Step 1 Data
function saveStep1Data() {
  dashboardState.portfolioData.basicInfo = {
    title: document.getElementById('portfolioTitle').value.trim(),
    name: document.getElementById('fullName').value.trim(),
    jobTitle: document.getElementById('jobTitle').value.trim(),
    bio: document.getElementById('shortBio').value.trim(),
    email: document.getElementById('contactEmail').value.trim()
  };
}

// Save Step 2 Data
function saveStep2Data() {
  dashboardState.portfolioData.experience = {
    workExperience: document.getElementById('experience').value.trim(),
    education: document.getElementById('education').value.trim(),
    projects: document.getElementById('projects').value.trim()
  };
}

// Save Step 3 Data
function saveStep3Data() {
  dashboardState.portfolioData.customization = {
    template: dashboardState.portfolioData.customization.template,
    colorScheme: document.getElementById('colorScheme').value,
    layoutStyle: document.getElementById('layoutStyle').value,
    url: document.getElementById('portfolioUrl').value.trim(),
    includeAnalytics: document.getElementById('includeAnalytics').checked,
    seoOptimized: document.getElementById('seoOptimized').checked
  };
}

// Go to Step
function goToStep(step) {
  // Update wizard steps
  const wizardSteps = document.querySelectorAll('.wizard-step');
  wizardSteps.forEach(stepEl => {
    stepEl.classList.remove('active');
    if (parseInt(stepEl.getAttribute('data-step')) === step) {
      stepEl.classList.add('active');
    }
  });
  
  // Update wizard panes
  const wizardPanes = document.querySelectorAll('.wizard-pane');
  wizardPanes.forEach(pane => {
    pane.classList.remove('active');
    if (parseInt(pane.getAttribute('data-step')) === step) {
      pane.classList.add('active');
    }
  });
  
  dashboardState.currentStep = step;
}

// Update Review Section
function updateReviewSection() {
  document.getElementById('reviewTitle').textContent = dashboardState.portfolioData.basicInfo.title;
  document.getElementById('reviewName').textContent = dashboardState.portfolioData.basicInfo.name;
  document.getElementById('reviewTemplate').textContent = dashboardState.portfolioData.customization.template.charAt(0).toUpperCase() + dashboardState.portfolioData.customization.template.slice(1);
  document.getElementById('reviewSkills').textContent = dashboardState.portfolioData.skills.join(', ');
}

// Generate Portfolio
function generatePortfolio() {
  // Show loading state
  document.getElementById('aiLoading').classList.remove('hidden');
  document.getElementById('aiComplete').classList.add('hidden');
  document.getElementById('generatePortfolioBtn').disabled = true;
  
  // Simulate AI generation with progress
  let progress = 0;
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;
    
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      
      // Show completion state
      setTimeout(() => {
        document.getElementById('aiLoading').classList.add('hidden');
        document.getElementById('aiComplete').classList.remove('hidden');
        document.getElementById('generatePortfolioBtn').disabled = false;
        
        // Create portfolio object
        const newPortfolio = {
          id: Date.now(),
          title: dashboardState.portfolioData.basicInfo.title,
          name: dashboardState.portfolioData.basicInfo.name,
          jobTitle: dashboardState.portfolioData.basicInfo.jobTitle,
          skills: dashboardState.portfolioData.skills,
          template: dashboardState.portfolioData.customization.template,
          status: 'published',
          createdAt: new Date().toISOString(),
          views: 0,
          url: dashboardState.portfolioData.customization.url || `portfolio-${Date.now()}`
        };
        
        // Add to portfolios
        dashboardState.portfolios.unshift(newPortfolio);
        
        // Save to localStorage
        localStorage.setItem('MiniSiteAI_portfolios', JSON.stringify(dashboardState.portfolios));
        
        // Update UI
        updatePortfolioList();
        updateRecentPortfolios();
        updateDashboardStats();
        
        // Reset wizard
        resetPortfolioWizard();
      }, 500);
    }
  }, 300);
}

// Reset Portfolio Wizard
function resetPortfolioWizard() {
  // Reset form
  document.getElementById('portfolioTitle').value = '';
  document.getElementById('fullName').value = '';
  document.getElementById('jobTitle').value = '';
  document.getElementById('shortBio').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('experience').value = '';
  document.getElementById('education').value = '';
  document.getElementById('projects').value = '';
  document.getElementById('portfolioUrl').value = '';
  
  // Reset skills
  dashboardState.portfolioData.skills = [];
  document.getElementById('skillsTags').innerHTML = '';
  
  // Reset template selection
  document.querySelectorAll('.template-card').forEach(card => {
    card.classList.remove('active');
  });
  document.querySelector('.template-card[data-template="minimal"]').classList.add('active');
  
  // Go back to step 1
  goToStep(1);
}

// Handle Profile Update
function handleProfileUpdate(e) {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('profileFullName').value.trim();
  const email = document.getElementById('profileEmail').value.trim();
  const phone = document.getElementById('profilePhone').value.trim();
  const location = document.getElementById('profileLocation').value.trim();
  const jobTitle = document.getElementById('profileJobTitle').value.trim();
  const company = document.getElementById('profileCompany').value.trim();
  const website = document.getElementById('profileWebsite').value.trim();
  const bio = document.getElementById('profileBio').value.trim();
  const username = document.getElementById('profileUsername').value.trim();
  
  // Validate
  if (!name || !email) {
    alert('Name and email are required.');
    return;
  }
  
  if (!isValidEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  
  // Update user data
  const updatedUser = {
    ...dashboardState.currentUser,
    name,
    email,
    phone,
    location,
    jobTitle,
    company,
    website,
    bio,
    username
  };
  
  // Save to storage (simulate API call)
  localStorage.setItem('MiniSiteAI_user', JSON.stringify(updatedUser));
  dashboardState.currentUser = updatedUser;
  
  // Update UI
  updateUserUI(updatedUser);
  
  alert('Profile updated successfully!');
}

// Handle Delete Account
function handleDeleteAccount() {
  if (confirm('Are you sure you want to delete your account? This will permanently delete all your data and cannot be undone.')) {
    // Simulate account deletion
    localStorage.removeItem('MiniSiteAI_user');
    localStorage.removeItem('MiniSiteAI_portfolios');
    
    alert('Account deleted. Redirecting to home page...');
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }
}

// Load Templates
function loadTemplates() {
  const templatesContainer = document.getElementById('templatesContainer');
  if (!templatesContainer) return;
  
  templatesContainer.innerHTML = '';
  
  dashboardState.templates.forEach(template => {
    const templateItem = document.createElement('div');
    templateItem.className = 'template-item';
    templateItem.innerHTML = `
      <div class="template-item-preview ${template.category}-template"></div>
      <div class="template-item-info">
        <h4>${template.name}</h4>
        <p>${template.description}</p>
        <div class="template-item-actions">
          <button class="btn-small preview-template" data-id="${template.id}">Preview</button>
          <button class="btn-small use-template-btn" data-id="${template.id}">Use</button>
        </div>
      </div>
    `;
    
    templatesContainer.appendChild(templateItem);
  });
  
  // Add event listeners to template buttons
  document.querySelectorAll('.preview-template').forEach(btn => {
    btn.addEventListener('click', function() {
      const templateId = parseInt(this.getAttribute('data-id'));
      previewTemplate(templateId);
    });
  });
  
  document.querySelectorAll('.use-template-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const templateId = parseInt(this.getAttribute('data-id'));
      useTemplate(templateId);
    });
  });
}

// Filter Templates
function filterTemplates(filter) {
  const templatesContainer = document.getElementById('templatesContainer');
  if (!templatesContainer) return;
  
  const templateItems = templatesContainer.querySelectorAll('.template-item');
  
  templateItems.forEach(item => {
    const templateId = parseInt(item.querySelector('.preview-template').getAttribute('data-id'));
    const template = dashboardState.templates.find(t => t.id === templateId);
    
    if (filter === 'all' || template.category === filter) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// Preview Template
function previewTemplate(id) {
  const template = dashboardState.templates.find(t => t.id === id);
  if (!template) return;
  
  // Update modal content
  document.getElementById('modalTemplateName').textContent = template.name;
  
  const modalPreview = document.getElementById('modalTemplatePreview');
  modalPreview.className = `template-modal-preview ${template.category}-template`;
  
  const featuresList = document.getElementById('modalTemplateFeatures');
  featuresList.innerHTML = '';
  
  template.features.forEach(feature => {
    const li = document.createElement('li');
    li.textContent = feature;
    featuresList.appendChild(li);
  });
  
  // Show modal
  document.getElementById('templatePreviewModal').classList.remove('hidden');
}

// Use Template
function useTemplate(id) {
  const template = dashboardState.templates.find(t => t.id === id);
  if (template) {
    showToast(`Feature is coming soon.`, 'info');

    showSection('ai-portfolio');
    document.querySelector('.nav-item[data-section="ai-portfolio"]').click();
    
    // Auto-select this template in the wizard
    setTimeout(() => {
      const templateCard = document.querySelector(`.template-card[data-template="${template.category}"]`);
      if (templateCard) {
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
        templateCard.classList.add('active');
        dashboardState.portfolioData.customization.template = template.category;
      }
    }, 100);
  }
}

// Handle Support Submit
function handleSupportSubmit(e) {
  e.preventDefault();
  
  const subject = document.getElementById('supportSubject').value.trim();
  const category = document.getElementById('supportCategory').value;
  const message = document.getElementById('supportMessage').value.trim();
  
  if (!subject || !category || !message) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Simulate sending support request
  alert('Support request submitted! We will get back to you within 24 hours.');
  
  // Reset form
  e.target.reset();
  document.getElementById('fileList').innerHTML = '';
}

// Utility Functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Escape HTML to prevent injection in previews
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Edit Portfolio - open editor, load content, allow save
async function editPortfolio(id) {
  try {
    const res = await fetch(`/api/portfolio/${id}`);
    const text = await res.text().catch(() => '');

    // Try to parse JSON string response, fall back to raw text
    let html = text;
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === 'string') html = parsed;
    } catch (e) {
      // not JSON, keep raw
    }

    showPortfolioEditor(id, html);
  } catch (err) {
    console.error('Failed to load portfolio for editing', err);
    alert('Failed to load portfolio for editing.');
  }
}

function showPortfolioEditor(id, htmlContent) {
  // If modal already exists, remove it
  const existing = document.getElementById('portfolioEditorModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'portfolioEditorModal';
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.background = 'rgba(0,0,0,0.6)';
  modal.style.zIndex = '9999';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';

  const container = document.createElement('div');
  container.style.width = '90%';
  container.style.height = '90%';
  container.style.background = '#fff';
  container.style.borderRadius = '8px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.overflow = 'hidden';

  const header = document.createElement('div');
  header.style.padding = '12px 16px';
  header.style.borderBottom = '1px solid #eee';
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';

  const title = document.createElement('h3');
  title.textContent = `Edit Portfolio #${id}`;
  title.style.margin = '0';

  const btnClose = document.createElement('button');
  btnClose.textContent = 'Close';
  btnClose.className = 'btn-secondary';
  btnClose.addEventListener('click', () => modal.remove());

  header.appendChild(title);
  header.appendChild(btnClose);

  // Toolbar with insert image
  const toolbar = document.createElement('div');
  toolbar.style.padding = '8px 12px';
  toolbar.style.borderBottom = '1px solid #eee';
  toolbar.style.background = '#fafafa';
  toolbar.style.display = 'flex';
  toolbar.style.gap = '8px';

  const insertImgBtn = document.createElement('button');
  insertImgBtn.textContent = 'Insert Image';
  insertImgBtn.className = 'btn-secondary';

  // Hidden file input for image selection
  const imgInput = document.createElement('input');
  imgInput.type = 'file';
  imgInput.accept = 'image/*';
  imgInput.style.display = 'none';

  insertImgBtn.addEventListener('click', () => imgInput.click());

  // Editor area
  const editorArea = document.createElement('div');
  editorArea.id = 'portfolioEditorArea';
  editorArea.contentEditable = 'true';
  editorArea.style.flex = '1';
  editorArea.style.padding = '16px';
  editorArea.style.overflow = 'auto';
  editorArea.style.background = '#fff';
  editorArea.innerHTML = htmlContent || '<p>Edit your portfolio HTML here...</p>';

  // Image size controls (hidden until an image is selected)
  const imgSizeContainer = document.createElement('div');
  imgSizeContainer.style.display = 'none';
  imgSizeContainer.style.alignItems = 'center';
  imgSizeContainer.style.gap = '6px';

  const widthInput = document.createElement('input');
  widthInput.type = 'number';
  widthInput.min = 0;
  widthInput.placeholder = 'Width';
  widthInput.style.width = '70px';

  const heightInput = document.createElement('input');
  heightInput.type = 'number';
  heightInput.min = 0;
  heightInput.placeholder = 'Height';
  heightInput.style.width = '70px';

  const unitSelect = document.createElement('select');
  ['%','px'].forEach(u => {
    const o = document.createElement('option'); o.value = u; o.text = u; unitSelect.appendChild(o);
  });

  const applySizeBtn = document.createElement('button');
  applySizeBtn.textContent = 'Apply Size';
  applySizeBtn.className = 'btn-primary';

  const resetSizeBtn = document.createElement('button');
  resetSizeBtn.textContent = 'Reset Size';
  resetSizeBtn.className = 'btn-secondary';

  imgSizeContainer.appendChild(widthInput);
  imgSizeContainer.appendChild(heightInput);
  imgSizeContainer.appendChild(unitSelect);
  imgSizeContainer.appendChild(applySizeBtn);
  imgSizeContainer.appendChild(resetSizeBtn);

  toolbar.appendChild(imgSizeContainer);

  // Handle selected image files - insert as data URL
  imgInput.addEventListener('change', function(e) {
    const file = this.files && this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      const src = ev.target.result;
      insertImageAtCursor(editorArea, src);
    };
    reader.readAsDataURL(file);
    // clear value so same file can be selected again
    this.value = '';
  });

  toolbar.appendChild(insertImgBtn);
  toolbar.appendChild(imgInput);
  

  const footer = document.createElement('div');
  footer.style.padding = '12px 16px';
  footer.style.borderTop = '1px solid #eee';
  footer.style.display = 'flex';
  footer.style.justifyContent = 'flex-end';
  footer.style.gap = '8px';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'btn-primary';
  saveBtn.addEventListener('click', () => saveEditedPortfolio(id, editorArea.innerHTML, modal));

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'btn-secondary';
  cancelBtn.addEventListener('click', () => modal.remove());

  footer.appendChild(cancelBtn);
  footer.appendChild(saveBtn);

  container.appendChild(header);
  container.appendChild(toolbar);
  container.appendChild(editorArea);
  container.appendChild(footer);
  modal.appendChild(container);
  document.body.appendChild(modal);

  // Focus editor
  setTimeout(() => editorArea.focus(), 0);

  // Selected image state
  let selectedImage = null;

  // Helper to show size controls when an image is selected
  function showImageControls(img) {
    if (!img) {
      imgSizeContainer.style.display = 'none';
      selectedImage = null;
      return;
    }
    selectedImage = img;
    // Try to read existing style sizes
    const style = img.style || {};
    const width = style.width || (img.getAttribute('width') ? img.getAttribute('width') + 'px' : '');
    const height = style.height || (img.getAttribute('height') ? img.getAttribute('height') + 'px' : '');

    // parse width value and unit
    const parseVal = (val)=>{
      if (!val) return ['','%'];
      if (val.endsWith('%')) return [parseFloat(val), '%'];
      if (val.endsWith('px')) return [parseFloat(val), 'px'];
      // numeric treated as px
      if (!isNaN(parseFloat(val))) return [parseFloat(val), 'px'];
      return ['','%'];
    };

    const [wVal, wUnit] = parseVal(width);
    const [hVal, hUnit] = parseVal(height);

    widthInput.value = wVal !== '' ? wVal : '';
    heightInput.value = hVal !== '' ? hVal : '';
    unitSelect.value = wUnit || '%';
    imgSizeContainer.style.display = 'flex';
  }

  // Apply size button
  applySizeBtn.addEventListener('click', ()=>{
    if (!selectedImage) return;
    const w = widthInput.value;
    const h = heightInput.value;
    const unit = unitSelect.value || '%';
    if (w) selectedImage.style.width = `${w}${unit}`;
    else selectedImage.style.width = '';
    if (h) selectedImage.style.height = `${h}${unit}`;
    else selectedImage.style.height = '';
  });

  resetSizeBtn.addEventListener('click', ()=>{
    if (!selectedImage) return;
    selectedImage.style.width = '';
    selectedImage.style.height = '';
    widthInput.value = '';
    heightInput.value = '';
  });

  // Click inside editor: detect image selection
  editorArea.addEventListener('click', function(e){
    const target = e.target;
    if (target && target.tagName === 'IMG') {
      showImageControls(target);
    } else {
      showImageControls(null);
    }
  });

  // Make an image resizable by wrapping and adding a draggable handle
  function makeImageResizable(img) {
    if (!img) return;
    // If already wrapped, return wrapper
    if (img.parentElement && img.parentElement.classList.contains('resizable-image-wrapper')) {
      return img.parentElement;
    }

    const wrapper = document.createElement('span');
    wrapper.className = 'resizable-image-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    wrapper.style.lineHeight = '0';

    // Insert wrapper before img and move img inside
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    // Style image to be block for consistent sizing
    img.style.display = 'block';
    img.style.maxWidth = '100%';

    // Create handle
    const handle = document.createElement('div');
    handle.className = 'img-resize-handle';
    handle.style.width = '12px';
    handle.style.height = '12px';
    handle.style.background = '#fff';
    handle.style.border = '2px solid #444';
    handle.style.borderRadius = '2px';
    handle.style.position = 'absolute';
    handle.style.right = '-8px';
    handle.style.bottom = '-8px';
    handle.style.cursor = 'nwse-resize';
    handle.style.zIndex = '10';

    wrapper.appendChild(handle);

    // Drag to resize
    let dragging = false;
    let startX = 0, startY = 0, startW = 0, startH = 0;

    function onMouseMove(e) {
      if (!dragging) return;
      e.preventDefault();
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newW = Math.max(20, startW + dx);
      const newH = Math.max(20, startH + dy);
      img.style.width = newW + 'px';
      img.style.height = newH + 'px';
    }

    function onMouseUp() {
      if (!dragging) return;
      dragging = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    handle.addEventListener('mousedown', function(ev) {
      ev.preventDefault();
      dragging = true;
      startX = ev.clientX;
      startY = ev.clientY;
      // get current size
      startW = img.getBoundingClientRect().width;
      startH = img.getBoundingClientRect().height;
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    return wrapper;
  }

  // Cleanup resizable wrapper when deselecting image
  function removeResizableWrapper(img) {
    if (!img) return;
    const wrapper = img.parentElement;
    if (wrapper && wrapper.classList && wrapper.classList.contains('resizable-image-wrapper')) {
      // Move image out and remove wrapper
      wrapper.parentNode.insertBefore(img, wrapper);
      wrapper.remove();
      img.style.display = '';
      img.style.width = img.style.width || '';
      img.style.height = img.style.height || '';
    }
  }
}

async function saveEditedPortfolio(id, content, modal) {
  try {
    const res = await fetch(`/api/save-portfolio/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    const text = await res.text().catch(() => '');
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch (e) { data = {}; }

    if (res.ok) {
      // Update local state if present
      const idx = dashboardState.portfolios.findIndex(p => parseInt(p.id) === parseInt(id));
      if (idx !== -1) {
        dashboardState.portfolios[idx].html_content = content;
      }

      alert(data.message || 'Portfolio saved successfully');
      if (modal) modal.remove();
      updateRecentPortfolios();
      updatePortfolioList();
    } else {
      console.error('Save failed', res.status, text, data);
      alert(data.error || data.message || 'Failed to save portfolio');
    }
  } catch (err) {
    console.error('Error saving portfolio', err);
    alert('An error occurred while saving the portfolio.');
  }
}

// Download portfolio HTML as a file
async function downloadPortfolio(id) {
  try {
    // Try to find in local state first
    const local = dashboardState.portfolios.find(p => String(p.id) === String(id) || String(p.id) === String(parseInt(id)));
    let html = local && (local.html_content || local.html) ? (local.html_content || local.html) : null;

    if (!html) {
      // Fetch from server
      const res = await fetch(`/api/portfolio/${id}`);
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Failed to load portfolio: ${res.status} ${txt}`);
      }
      html = await res.text();
      // If server returned JSON-wrapped html, try parse
      try {
        const parsed = JSON.parse(html);
        if (typeof parsed === 'string') html = parsed;
      } catch (e) {}
    }

    const titleSafe = (local && (local.title || `portfolio-${id}`)) || `portfolio-${id}`;
    const filename = `${titleSafe.replace(/[^a-z0-9_-]/gi, '_')}.html`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download failed', err);
    alert('Failed to download portfolio.');
  }
}

// Insert image into a contentEditable at the current cursor position
function insertImageAtCursor(editor, src) {
  try {
    // Try execCommand first for broad support
    document.execCommand('insertImage', false, src);
  } catch (e) {
    // Fallback: insert using Range API
    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '100%';
    img.alt = '';

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      editor.appendChild(img);
      return;
    }
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(img);
    // Move cursor after image
    range.setStartAfter(img);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}