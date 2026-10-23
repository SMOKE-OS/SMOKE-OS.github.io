// SMOKE OS - Official Scripts

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initReleaseData();
  initKeybindings();
  initCopyButtons();
});

// Mobile menu toggle
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking navigation links
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

// Keybindings data & filter system
const KEYBINDINGS = [
  { keys: ['SUPER', 'Q'], action: 'Launch Kitty Terminal', category: 'apps', note: 'Default terminal with Smoke Dark theme' },
  { keys: ['SUPER', 'SPACE'], action: 'Application Launcher', category: 'apps', note: 'Quickshell app finder' },
  { keys: ['SUPER', 'E'], action: 'Launch File Manager (Thunar)', category: 'apps', note: 'Fast graphical file manager' },
  { keys: ['SUPER', 'C'], action: 'Close Active Window', category: 'windows', note: 'Gracefully terminates window' },
  { keys: ['SUPER', 'V'], action: 'Toggle Floating Window', category: 'windows', note: 'Switches between tiling and float' },
  { keys: ['SUPER', 'P'], action: 'Toggle Pseudo Tiling', category: 'windows', note: 'Preserves original window aspect' },
  { keys: ['SUPER', 'J'], action: 'Toggle Split Orientation', category: 'windows', note: 'Dwindle layout split toggle' },
  { keys: ['SUPER', 'M'], action: 'Exit Hyprland Session', category: 'windows', note: 'Logs out of current desktop' },
  
  { keys: ['SUPER', '← / → / ↑ / ↓'], action: 'Focus Window (Arrows)', category: 'navigation', note: 'Shift focus in direction' },
  { keys: ['SUPER', 'H / J / K / L'], action: 'Focus Window (Vim Keys)', category: 'navigation', note: 'Vim-style window navigation' },
  { keys: ['SUPER', 'Mouse Scroll'], action: 'Cycle Workspaces', category: 'workspaces', note: 'Quick scroll through workspaces' },

  { keys: ['SUPER', '1 .. 9'], action: 'Switch to Workspace 1–9', category: 'workspaces', note: 'Jump directly to workspace' },
  { keys: ['SUPER', '0'], action: 'Switch to Workspace 10', category: 'workspaces', note: 'Jump to workspace 10' },
  { keys: ['SUPER', 'SHIFT', '1 .. 9'], action: 'Move Window to Workspace 1–9', category: 'workspaces', note: 'Relocates active window' },
  { keys: ['SUPER', 'SHIFT', '0'], action: 'Move Window to Workspace 10', category: 'workspaces', note: 'Relocates window to workspace 10' },

  { keys: ['SUPER', 'LMB Drag'], action: 'Move Window with Mouse', category: 'windows', note: 'Click & drag window freely' },
  { keys: ['SUPER', 'RMB Drag'], action: 'Resize Window with Mouse', category: 'windows', note: 'Click & drag window edge' },
];

function initKeybindings() {
  const container = document.getElementById('keybindings-list');
  const searchInput = document.getElementById('keybind-search');
  const filterPills = document.querySelectorAll('.keybind-filter-btn');

  if (!container) return;

  let activeCategory = 'all';
  let searchTerm = '';

  function render() {
    const filtered = KEYBINDINGS.filter(item => {
      const matchesCategory = (activeCategory === 'all' || item.category === activeCategory);
      const matchesSearch = searchTerm === '' || 
        item.action.toLowerCase().includes(searchTerm) || 
        item.keys.join(' ').toLowerCase().includes(searchTerm) ||
        (item.note && item.note.toLowerCase().includes(searchTerm));
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-gray-400">
          No keybindings found matching "<strong>${escapeHtml(searchTerm)}</strong>".
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-800/80 hover:bg-white/[0.02] transition-colors gap-3">
        <div class="flex items-center gap-1.5 flex-wrap">
          ${item.keys.map(k => `<span class="kbd-key">${escapeHtml(k)}</span>`).join('<span class="text-gray-500 text-xs">+</span>')}
        </div>
        <div class="sm:text-right">
          <div class="font-medium text-gray-200 text-sm">${escapeHtml(item.action)}</div>
          <div class="text-xs text-gray-400">${escapeHtml(item.note || '')}</div>
        </div>
      </div>
    `).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      render();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('bg-blue-500/20', 'text-blue-400', 'border-blue-500/40');
        p.classList.add('bg-white/5', 'text-gray-400', 'border-transparent');
      });
      pill.classList.remove('bg-white/5', 'text-gray-400', 'border-transparent');
      pill.classList.add('bg-blue-500/20', 'text-blue-400', 'border-blue-500/40');

      activeCategory = pill.dataset.category;
      render();
    });
  });

  render();
}

// GitHub API live release fetcher
async function initReleaseData() {
  const defaultIsoName = "Smoke_os_20261023_0356_v0.1BETA.iso";
  const defaultVersion = "v0.1BETA";
  const defaultIsoUrl = `https://github.com/SMOKE-OS/smoke-iso/releases/download/${defaultVersion}/${defaultIsoName}`;
  const defaultShaUrl = `https://github.com/SMOKE-OS/smoke-iso/releases/download/${defaultVersion}/${defaultIsoName}.sha256`;
  const defaultShaChecksum = "e6f4818c644eafa4ae68fc33...";

  try {
    const res = await fetch('https://api.github.com/repos/SMOKE-OS/smoke-iso/releases/latest');
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();

    const tag = data.tag_name || defaultVersion;
    const isoAsset = data.assets && data.assets.find(a => a.name.endsWith('.iso'));
    const shaAsset = data.assets && data.assets.find(a => a.name.endsWith('.sha256'));

    const versionEls = document.querySelectorAll('.dynamic-version');
    versionEls.forEach(el => el.textContent = tag);

    if (isoAsset) {
      const downloadBtns = document.querySelectorAll('.dynamic-download-btn');
      downloadBtns.forEach(btn => {
        btn.href = isoAsset.browser_download_url;
      });

      const sizeEls = document.querySelectorAll('.dynamic-iso-size');
      const mbSize = (isoAsset.size / (1024 * 1024 * 1024)).toFixed(2) + ' GiB';
      sizeEls.forEach(el => el.textContent = mbSize);

      const filenameEls = document.querySelectorAll('.dynamic-iso-filename');
      filenameEls.forEach(el => el.textContent = isoAsset.name);
    }

    if (shaAsset) {
      const shaBtns = document.querySelectorAll('.dynamic-sha-link');
      shaBtns.forEach(btn => btn.href = shaAsset.browser_download_url);
    }
  } catch (err) {
    // Graceful fallback to baked-in v0.1BETA values
    console.log('Using default release info:', err);
  }
}

// Copy to clipboard helper
function initCopyButtons() {
  document.querySelectorAll('.copy-trigger').forEach(button => {
    button.addEventListener('click', () => {
      const targetSelector = button.dataset.target;
      let text = button.dataset.copyText;
      
      if (!text && targetSelector) {
        const target = document.querySelector(targetSelector);
        if (target) text = target.innerText.trim();
      }

      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const originalHtml = button.innerHTML;
        button.innerHTML = `
          <svg class="w-4 h-4 text-emerald-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-xs text-emerald-400 ml-1">Copied!</span>
        `;
        setTimeout(() => {
          button.innerHTML = originalHtml;
        }, 2000);
      }).catch(err => {
        console.error('Copy failed: ', err);
      });
    });
  });
}

// Tab switcher for quickstart / test guide
window.switchGuideTab = function(tabId) {
  const tabs = ['qemu-tab', 'usb-tab', 'source-tab'];
  const contents = ['qemu-content', 'usb-content', 'source-content'];

  tabs.forEach((t, i) => {
    const tabEl = document.getElementById(t);
    const contentEl = document.getElementById(contents[i]);
    if (!tabEl || !contentEl) return;

    if (t === tabId) {
      tabEl.className = "px-4 py-2 text-sm font-medium rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all";
      contentEl.classList.remove('hidden');
    } else {
      tabEl.className = "px-4 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-white bg-transparent transition-all";
      contentEl.classList.add('hidden');
    }
  });
};

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
