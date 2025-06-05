// Main Application Entry Point
class ChatApp {
  constructor() {
    this.isInitialized = false
    this.loadingScreen = null

    this.init()
  }

  async init() {
    try {
      // Show loading screen
      this.showLoadingScreen()

      // Initialize core systems
      await this.initializeSystems()

      // Load initial data
      await this.loadInitialData()

      // Setup event listeners
      this.setupGlobalEventListeners()

      // Hide loading screen
      this.hideLoadingScreen()

      // Mark as initialized
      this.isInitialized = true

      console.log("ChatApp initialized successfully!")
    } catch (error) {
      console.error("Failed to initialize ChatApp:", error)
      this.showErrorMessage("Failed to load the application. Please refresh the page.")
    }
  }

  showLoadingScreen() {
    this.loadingScreen = window.Utils.$("#loadingScreen")
    if (this.loadingScreen) {
      this.loadingScreen.classList.remove("hidden")
    }
  }

  hideLoadingScreen() {
    if (this.loadingScreen) {
      setTimeout(() => {
        this.loadingScreen.classList.add("hidden")

        // Remove from DOM after animation
        setTimeout(() => {
          if (this.loadingScreen && this.loadingScreen.parentNode) {
            this.loadingScreen.parentNode.removeChild(this.loadingScreen)
          }
        }, 300)
      }, 500) // Show loading for at least 500ms for better UX
    }
  }

  async initializeSystems() {
    // Initialize UI Manager
    window.uiManager = new window.UIManager()

    // Initialize Chat Manager
    window.chatManager = new window.ChatManager()

    // Request notification permission (with error handling)
    try {
      if (window.Utils && window.Utils.requestNotificationPermission) {
        await window.Utils.requestNotificationPermission()
      }
    } catch (error) {
      console.log("Notification permission request failed:", error)
    }

    // Initialize service worker if available
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/sw.js")
        console.log("Service Worker registered successfully")
      } catch (error) {
        console.log("Service Worker registration failed:", error)
      }
    }
  }

  async loadInitialData() {
    // Simulate loading time for demo
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Render initial chat list
    if (window.chatManager) {
      window.chatManager.renderChatList()
    }

    // Focus on message input
    const messageInput = window.Utils.$("#messageInput")
    if (messageInput) {
      setTimeout(() => {
        messageInput.focus()
      }, 100)
    }
  }

  setupGlobalEventListeners() {
    // Handle online/offline status
    window.addEventListener("online", () => {
      window.UIComponents.showToast("Connection restored", "success")
      this.updateOnlineStatus(true)
    })

    window.addEventListener("offline", () => {
      window.UIComponents.showToast("Connection lost", "warning")
      this.updateOnlineStatus(false)
    })

    // Handle visibility change (tab focus/blur)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.handleTabBlur()
      } else {
        this.handleTabFocus()
      }
    })

    // Handle beforeunload (page refresh/close)
    window.addEventListener("beforeunload", (e) => {
      this.handleBeforeUnload(e)
    })

    // Handle errors
    window.addEventListener("error", (e) => {
      console.error("Global error:", e.error)
      this.handleGlobalError(e.error)
    })

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (e) => {
      console.error("Unhandled promise rejection:", e.reason)
      this.handleGlobalError(e.reason)
    })
  }

  updateOnlineStatus(isOnline) {
    // Update UI to reflect online/offline status
    const statusElements = window.Utils.$$(".status-indicator")
    statusElements.forEach((element) => {
      if (isOnline) {
        element.classList.remove("offline")
        element.classList.add("online")
      } else {
        element.classList.remove("online")
        element.classList.add("offline")
      }
    })
  }

  handleTabBlur() {
    // Reduce activity when tab is not visible
    console.log("Tab blurred - reducing activity")
  }

  handleTabFocus() {
    // Resume full activity when tab is focused
    console.log("Tab focused - resuming activity")

    // Clear any notification badges
    const badge = window.Utils.$(".notification-badge")
    if (badge) {
      badge.textContent = "0"
      badge.style.display = "none"
    }
  }

  handleBeforeUnload(e) {
    // Save any unsaved data
    const messageInput = window.Utils.$("#messageInput")
    if (messageInput && messageInput.value.trim()) {
      window.Utils.setStorage("unsavedMessage", messageInput.value)
    }

    // Show confirmation for unsaved changes (optional)
    // e.preventDefault();
    // e.returnValue = '';
  }

  handleGlobalError(error) {
    // Log error for debugging
    console.error("Application error:", error)

    // Show user-friendly error message
    if (this.isInitialized) {
      window.UIComponents.showToast("Something went wrong. Please try again.", "error")
    }
  }

  showErrorMessage(message) {
    const errorContainer = window.Utils.createElement("div", "error-container")
    errorContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Oops! Something went wrong</h3>
                <p>${window.Utils.escapeHtml(message)}</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    Refresh Page
                </button>
            </div>
        `

    document.body.appendChild(errorContainer)
  }

  // Public API methods
  sendMessage(content, chatId = null) {
    if (window.chatManager) {
      return window.chatManager.sendMessage(content, chatId)
    }
  }

  selectChat(chatId) {
    if (window.chatManager) {
      return window.chatManager.selectChat(chatId)
    }
  }

  toggleTheme() {
    if (window.uiManager) {
      return window.uiManager.toggleTheme()
    }
  }

  showNotifications() {
    if (window.uiManager) {
      return window.uiManager.showNotifications()
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Create global app instance
  window.chatApp = new ChatApp()

  // Expose some methods globally for debugging
  window.debug = {
    app: window.chatApp,
    ui: window.uiManager,
    chat: window.chatManager,
    utils: window.Utils,
    components: window.UIComponents,
  }
})

// Handle page load completion
window.addEventListener("load", () => {
  console.log("Page fully loaded")

  // Restore any unsaved message
  const unsavedMessage = window.Utils.getStorage("unsavedMessage")
  if (unsavedMessage) {
    const messageInput = window.Utils.$("#messageInput")
    if (messageInput) {
      messageInput.value = unsavedMessage
      window.Utils.removeStorage("unsavedMessage")
    }
  }
})
