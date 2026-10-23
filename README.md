# 🌫️ SMOKE-OS.github.io

Official repository for the **SMOKE OS** landing website and portal.

Visit the live website at: **[https://smoke-os.github.io](https://smoke-os.github.io)**

---

## 🚀 Features

- **Performance-First Design**: Built with clean HTML5, Tailwind CSS, and Vanilla JavaScript with zero server-side rendering overhead.
- **Catppuccin Mocha / Smoke Dark Aesthetic**: Unified color palette matching SMOKE OS's default Kitty terminal and Hyprland desktop.
- **Dynamic Release Tracking**: Automatically connects to the GitHub Releases API of `smoke-iso` to display the latest release metadata, file size, direct ISO download links, and SHA256 checksums.
- **Interactive Keybindings Cheat Sheet**: Real-time search and filter for Hyprland dynamic tiling window manager shortcuts.
- **Testing & Deployment Guides**: One-click copy for QEMU virtual machine test commands, USB flashing instructions, and source compilation recipes.

---

## 🛠️ Local Development

To test the website locally:

```bash
# Clone the repository
git clone https://github.com/SMOKE-OS/SMOKE-OS.github.io.git
cd SMOKE-OS.github.io

# Start a local static file server (Python 3)
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your web browser.

---

## 🤝 Contributing

Contributions to improve styling, documentation, or responsive behavior are welcome! Please submit an issue or pull request.

---

## ⚖️ License

Distributed under the [MIT License](LICENSE).
