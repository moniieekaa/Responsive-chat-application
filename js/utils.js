// Utility Functions
class Utils {
  // DOM Utilities
  static $(selector) {
    return document.querySelector(selector)
  }

  static $$(selector) {
    return document.querySelectorAll(selector)
  }

  static createElement(tag, className = "", content = "") {
    const element = document.createElement(tag)
    if (className) element.className = className
    if (content) element.textContent = content
    return element
  }

  static addEventListeners(element, events) {
    Object.entries(events).forEach(([event, handler]) => {
      element.addEventListener(event, handler)
    })
  }

  // String Utilities
  static escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  static truncateText(text, maxLength = 50) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  static formatTime(date) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  static formatDate(date) {
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Animation Utilities
  static fadeIn(element, duration = 300) {
    element.style.opacity = "0"
    element.style.display = "block"

    const start = performance.now()

    function animate(currentTime) {
      const elapsed = currentTime - start
      const progress = Math.min(elapsed / duration, 1)

      element.style.opacity = progress

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  static fadeOut(element, duration = 300) {
    const start = performance.now()
    const startOpacity = Number.parseFloat(getComputedStyle(element).opacity)

    function animate(currentTime) {
      const elapsed = currentTime - start
      const progress = Math.min(elapsed / duration, 1)

      element.style.opacity = startOpacity * (1 - progress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        element.style.display = "none"
      }
    }

    requestAnimationFrame(animate)
  }

  static slideDown(element, duration = 300) {
    element.style.height = "0"
    element.style.overflow = "hidden"
    element.style.display = "block"

    const targetHeight = element.scrollHeight
    const start = performance.now()

    function animate(currentTime) {
      const elapsed = currentTime - start
      const progress = Math.min(elapsed / duration, 1)

      element.style.height = targetHeight * progress + "px"

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        element.style.height = ""
        element.style.overflow = ""
      }
    }

    requestAnimationFrame(animate)
  }

  // Storage Utilities
  static setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn("Failed to save to localStorage:", error)
    }
  }

  static getStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn("Failed to read from localStorage:", error)
      return defaultValue
    }
  }

  static removeStorage(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn("Failed to remove from localStorage:", error)
    }
  }

  // Debounce and Throttle
  static debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  static throttle(func, limit) {
    let inThrottle
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  // Device Detection
  static isMobile() {
    return window.innerWidth <= 768
  }

  static isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024
  }

  static isDesktop() {
    return window.innerWidth > 1024
  }

  static isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0
  }

  // Random Utilities
  static generateId() {
    return Math.random().toString(36).substr(2, 9)
  }

  static randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  static randomDelay(min = 1000, max = 3000) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // Validation
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static isValidUrl(url) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Copy to Clipboard
  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.warn("Failed to copy to clipboard:", error)
      return false
    }
  }

  // Notification Support
  static async requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      return await Notification.requestPermission()
    }
    return Notification.permission
  }

  static showNotification(title, options = {}) {
    if ("Notification" in window && Notification.permission === "granted") {
      return new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      })
    }
    return null
  }
}

// Export for use in other modules
window.Utils = Utils
