// UI Management System
class UIManager {
  constructor() {
    this.theme = "light"
    this.sidebarOpen = false
    this.searchQuery = ""
    this.activeFilter = "all"

    this.init()
  }

  init() {
    this.loadTheme()
    this.bindEvents()
    this.setupResponsive()
    this.initializeTooltips()
  }

  bindEvents() {
    // Theme toggle
    const themeToggle = window.Utils.$("#themeToggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }

    // Sidebar toggle
    const sidebarToggle = window.Utils.$("#sidebarToggle")
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", () => this.toggleSidebar())
    }

    // Search
    const searchInput = window.Utils.$("#searchInput")
    if (searchInput) {
      searchInput.addEventListener(
        "input",
        window.Utils.debounce((e) => {
          this.handleSearch(e.target.value)
        }, 300),
      )
    }

    // Filter buttons
    window.Utils.$$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.handleFilter(e.target.dataset.filter)
      })
    })

    // User dropdown
    const userAvatar = window.Utils.$("#userAvatar")
    const userDropdown = window.Utils.$("#userDropdown")
    if (userAvatar && userDropdown) {
      userAvatar.addEventListener("click", (e) => {
        e.stopPropagation()
        userDropdown.parentElement.classList.toggle("open")
      })

      document.addEventListener("click", () => {
        userDropdown.parentElement.classList.remove("open")
      })
    }

    // Notification button
    const notificationBtn = window.Utils.$("#notificationBtn")
    if (notificationBtn) {
      notificationBtn.addEventListener("click", () => {
        this.showNotifications()
      })
    }

    // New chat button
    const newChatBtn = window.Utils.$("#newChatBtn")
    if (newChatBtn) {
      newChatBtn.addEventListener("click", () => {
        this.showNewChatModal()
      })
    }

    // Input actions
    const attachBtn = window.Utils.$("#attachBtn")
    const emojiBtn = window.Utils.$("#emojiBtn")
    const voiceBtn = window.Utils.$("#voiceBtn")

    if (attachBtn) {
      attachBtn.addEventListener("click", () => this.handleFileAttach())
    }

    if (emojiBtn) {
      emojiBtn.addEventListener("click", () => this.showEmojiPicker())
    }

    if (voiceBtn) {
      voiceBtn.addEventListener("click", () => this.handleVoiceMessage())
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e)
    })

    // Window resize
    window.addEventListener(
      "resize",
      window.Utils.throttle(() => {
        this.handleResize()
      }, 250),
    )

    // Click outside to close sidebar on mobile
    document.addEventListener("click", (e) => {
      if (window.Utils.isMobile() && this.sidebarOpen) {
        const sidebar = window.Utils.$("#sidebar")
        const sidebarToggle = window.Utils.$("#sidebarToggle")

        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
          this.closeSidebar()
        }
      }
    })
  }

  loadTheme() {
    const savedTheme = window.Utils.getStorage("theme", "light")
    this.setTheme(savedTheme)
  }

  setTheme(theme) {
    this.theme = theme
    document.body.className = `theme-${theme}`

    const themeToggle = window.Utils.$("#themeToggle")
    if (themeToggle) {
      const icon = themeToggle.querySelector("i")
      if (icon) {
        icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon"
      }
    }

    window.Utils.setStorage("theme", theme)
  }

  toggleTheme() {
    const newTheme = this.theme === "light" ? "dark" : "light"
    this.setTheme(newTheme)

    // Show toast notification
    window.UIComponents.showToast(`Switched to ${newTheme} mode`, "success", 2000)
  }

  toggleSidebar() {
    if (this.sidebarOpen) {
      this.closeSidebar()
    } else {
      this.openSidebar()
    }
  }

  openSidebar() {
    const sidebar = window.Utils.$("#sidebar")
    if (sidebar) {
      sidebar.classList.add("open")
      this.sidebarOpen = true
    }
  }

  closeSidebar() {
    const sidebar = window.Utils.$("#sidebar")
    if (sidebar) {
      sidebar.classList.remove("open")
      this.sidebarOpen = false
    }
  }

  handleSearch(query) {
    this.searchQuery = query

    if (window.chatManager) {
      window.chatManager.searchChats(query)
    }

    // Update search input styling
    const searchInput = window.Utils.$("#searchInput")
    if (searchInput) {
      if (query) {
        searchInput.classList.add("has-value")
      } else {
        searchInput.classList.remove("has-value")
      }
    }
  }

  handleFilter(filter) {
    this.activeFilter = filter

    // Update filter button states
    window.Utils.$$(".filter-btn").forEach((btn) => {
      btn.classList.remove("active")
    })

    const activeBtn = window.Utils.$(`[data-filter="${filter}"]`)
    if (activeBtn) {
      activeBtn.classList.add("active")
    }

    // Apply filter
    if (window.chatManager) {
      window.chatManager.filterChats(filter)
    }
  }

  showNotifications() {
    const notifications = [
      {
        id: 1,
        title: "New message from Emma",
        message: "Hey, are you available for a quick call?",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
      },
      {
        id: 2,
        title: "Meeting reminder",
        message: "Team standup in 15 minutes",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        read: false,
      },
      {
        id: 3,
        title: "File shared",
        message: "Michael shared a document with you",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
      },
    ]

    const content = `
            <div class="notifications-list">
                ${notifications
                  .map(
                    (notif) => `
                    <div class="notification-item ${notif.read ? "read" : "unread"}">
                        <div class="notification-content">
                            <h4>${window.Utils.escapeHtml(notif.title)}</h4>
                            <p>${window.Utils.escapeHtml(notif.message)}</p>
                            <span class="notification-time">${window.Utils.formatTime(notif.timestamp)}</span>
                        </div>
                        ${!notif.read ? '<div class="notification-indicator"></div>' : ""}
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `

    const { modal } = window.UIComponents.createModal("Notifications", content, [
      { text: "Mark all as read", action: "mark-read", class: "btn-secondary" },
      { text: "Close", action: "close", class: "btn-primary" },
    ])

    modal.addEventListener("modalAction", (e) => {
      if (e.detail.action === "mark-read") {
        // Mark all notifications as read
        window.UIComponents.showToast("All notifications marked as read", "success")

        // Update notification badge
        const badge = window.Utils.$(".notification-badge")
        if (badge) {
          badge.style.display = "none"
        }
      }
    })
  }

  showNewChatModal() {
    const content = `
            <div class="new-chat-form">
                <div class="form-group">
                    <label for="contactSearch">Search contacts</label>
                    <input type="text" id="contactSearch" class="form-input" placeholder="Enter name or email...">
                </div>
                <div class="contacts-list">
                    <div class="contact-item">
                        <div class="avatar avatar-md">
                            <div class="avatar-fallback">JD</div>
                        </div>
                        <div class="contact-info">
                            <div class="contact-name">John Doe</div>
                            <div class="contact-email">john.doe@company.com</div>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="avatar avatar-md">
                            <div class="avatar-fallback">JS</div>
                        </div>
                        <div class="contact-info">
                            <div class="contact-name">Jane Smith</div>
                            <div class="contact-email">jane.smith@company.com</div>
                        </div>
                    </div>
                </div>
            </div>
        `

    window.UIComponents.createModal("Start New Chat", content, [
      { text: "Cancel", action: "close", class: "btn-secondary" },
      { text: "Start Chat", action: "start-chat", class: "btn-primary" },
    ])
  }

  handleFileAttach() {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.accept = "image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"

    input.addEventListener("change", (e) => {
      const files = Array.from(e.target.files)
      if (files.length > 0) {
        this.handleFileUpload(files)
      }
    })

    input.click()
  }

  handleFileUpload(files) {
    files.forEach((file) => {
      // In a real app, you would upload the file to a server
      window.UIComponents.showToast(`File "${file.name}" attached`, "success")

      // Add file to message input area (visual indication)
      const inputArea = window.Utils.$(".chat-input-area")
      if (inputArea) {
        const filePreview = window.Utils.createElement("div", "file-preview")
        filePreview.innerHTML = `
                    <div class="file-preview-item">
                        <i class="fas fa-file"></i>
                        <span>${file.name}</span>
                        <button class="remove-file" aria-label="Remove file">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `

        filePreview.querySelector(".remove-file").addEventListener("click", () => {
          filePreview.remove()
        })

        inputArea.insertBefore(filePreview, inputArea.lastElementChild)
      }
    })
  }

  showEmojiPicker() {
    const emojis = [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤨",
      "🧐",
      "🤓",
      "😎",
      "🤩",
      "🥳",
      "😏",
      "😒",
      "😞",
      "😔",
      "😟",
      "😕",
      "🙁",
      "☹️",
      "😣",
      "😖",
      "😫",
      "😩",
      "🥺",
      "😢",
      "😭",
      "😤",
      "😠",
      "😡",
      "🤬",
      "🤯",
      "😳",
      "🥵",
      "🥶",
      "😱",
      "😨",
      "😰",
      "😥",
      "😓",
      "🤗",
      "🤔",
      "🤭",
      "🤫",
      "🤥",
      "😶",
      "😐",
      "😑",
      "😬",
      "🙄",
      "😯",
      "😦",
      "😧",
      "😮",
      "😲",
      "🥱",
      "😴",
      "🤤",
      "😪",
      "😵",
      "🤐",
      "🥴",
      "🤢",
      "🤮",
      "🤧",
      "😷",
      "🤒",
      "🤕",
      "🤑",
      "🤠",
      "😈",
      "👿",
      "👹",
      "👺",
      "🤡",
      "💩",
      "👻",
      "💀",
      "☠️",
      "👽",
      "👾",
      "🤖",
      "🎃",
      "😺",
      "😸",
      "😹",
      "😻",
      "😼",
      "😽",
      "🙀",
      "😿",
      "😾",
    ]

    const content = `
            <div class="emoji-picker">
                <div class="emoji-grid">
                    ${emojis
                      .map(
                        (emoji) => `
                        <button class="emoji-btn" data-emoji="${emoji}">${emoji}</button>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `

    const { modal } = window.UIComponents.createModal("Choose Emoji", content, [
      { text: "Close", action: "close", class: "btn-secondary" },
    ])

    // Handle emoji selection
    modal.querySelectorAll(".emoji-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const emoji = e.target.dataset.emoji
        const messageInput = window.Utils.$("#messageInput")
        if (messageInput) {
          messageInput.value += emoji
          messageInput.focus()
        }
        modal.dispatchEvent(
          new CustomEvent("modalAction", {
            detail: { action: "close" },
          }),
        )
      })
    })
  }

  handleVoiceMessage() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      window.UIComponents.showToast("Voice recording not supported", "error")
      return
    }

    window.UIComponents.showToast("Voice recording feature coming soon!", "info")
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K - Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      const searchInput = window.Utils.$("#searchInput")
      if (searchInput) {
        searchInput.focus()
      }
    }

    // Ctrl/Cmd + N - New chat
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault()
      this.showNewChatModal()
    }

    // Ctrl/Cmd + T - Toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === "t") {
      e.preventDefault()
      this.toggleTheme()
    }

    // Escape - Close modals/dropdowns
    if (e.key === "Escape") {
      // Close user dropdown
      const userDropdown = window.Utils.$("#userDropdown")
      if (userDropdown) {
        userDropdown.parentElement.classList.remove("open")
      }

      // Close sidebar on mobile
      if (window.Utils.isMobile() && this.sidebarOpen) {
        this.closeSidebar()
      }
    }

    // Ctrl/Cmd + / - Show shortcuts help
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault()
      this.showKeyboardShortcuts()
    }
  }

  showKeyboardShortcuts() {
    const shortcuts = [
      { key: "Ctrl + K", description: "Focus search" },
      { key: "Ctrl + N", description: "Start new chat" },
      { key: "Ctrl + T", description: "Toggle theme" },
      { key: "Enter", description: "Send message" },
      { key: "Shift + Enter", description: "New line" },
      { key: "Escape", description: "Close modals" },
      { key: "Ctrl + /", description: "Show shortcuts" },
    ]

    const content = `
            <div class="shortcuts-list">
                ${shortcuts
                  .map(
                    (shortcut) => `
                    <div class="shortcut-item">
                        <kbd class="shortcut-key">${shortcut.key}</kbd>
                        <span class="shortcut-description">${shortcut.description}</span>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `

    window.UIComponents.createModal("Keyboard Shortcuts", content, [
      { text: "Close", action: "close", class: "btn-primary" },
    ])
  }

  handleResize() {
    // Close sidebar on desktop
    if (!window.Utils.isMobile() && this.sidebarOpen) {
      this.closeSidebar()
    }

    // Update layout calculations
    this.updateLayout()
  }

  updateLayout() {
    // Recalculate heights and positions if needed
    const chatMessages = window.Utils.$("#chatMessages")
    if (chatMessages && window.chatManager) {
      window.chatManager.scrollToBottom()
    }
  }

  setupResponsive() {
    // Add touch gesture support for mobile
    if (window.Utils.isTouchDevice()) {
      this.setupTouchGestures()
    }

    // Setup intersection observer for message read status
    this.setupMessageObserver()
  }

  setupTouchGestures() {
    let touchStartX = 0
    let touchEndX = 0

    document.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX
    })

    document.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX
      this.handleSwipe()
    })

    const handleSwipe = () => {
      const swipeThreshold = 100

      if (window.Utils.isMobile()) {
        // Swipe right to open sidebar
        if (touchEndX - touchStartX > swipeThreshold && !this.sidebarOpen) {
          this.openSidebar()
        }

        // Swipe left to close sidebar
        if (touchStartX - touchEndX > swipeThreshold && this.sidebarOpen) {
          this.closeSidebar()
        }
      }
    }

    this.handleSwipe = handleSwipe
  }

  setupMessageObserver() {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Mark message as read when it comes into view
              const messageEl = entry.target
              const messageId = messageEl.dataset.messageId

              if (messageId) {
                // In a real app, you would send read receipt to server
                console.log(`Message ${messageId} read`)
              }
            }
          })
        },
        {
          threshold: 0.5,
        },
      )

      // Observe all message elements
      const observeMessages = () => {
        const messages = window.Utils.$$(".message")
        messages.forEach((message) => {
          observer.observe(message)
        })
      }

      // Initial observation
      observeMessages()

      // Re-observe when new messages are added
      const chatMessages = window.Utils.$("#chatMessages")
      if (chatMessages) {
        const mutationObserver = new MutationObserver(() => {
          observeMessages()
        })

        mutationObserver.observe(chatMessages, {
          childList: true,
        })
      }
    }
  }

  initializeTooltips() {
    // Add tooltips to buttons
    const tooltipElements = [
      { selector: "#themeToggle", text: "Toggle theme (Ctrl+T)" },
      { selector: "#notificationBtn", text: "Notifications" },
      { selector: "#newChatBtn", text: "New chat (Ctrl+N)" },
      { selector: "#attachBtn", text: "Attach file" },
      { selector: "#emojiBtn", text: "Add emoji" },
      { selector: "#voiceBtn", text: "Voice message" },
      { selector: "#sendBtn", text: "Send message (Enter)" },
    ]

    tooltipElements.forEach(({ selector, text }) => {
      const element = window.Utils.$(selector)
      if (element) {
        element.setAttribute("data-tooltip", text)
        element.classList.add("tooltip")
      }
    })
  }
}

// Export for use in other modules
window.UIManager = UIManager
