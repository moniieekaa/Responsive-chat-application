// Reusable UI Components
class UIComponents {
  // Avatar Component
  static createAvatar(user, size = "md") {
    const avatar = document.createElement("div")
    avatar.className = `avatar avatar-${size}`

    if (user.avatar) {
      const img = document.createElement("img")
      img.src = user.avatar
      img.alt = user.name
      img.onerror = () => {
        img.style.display = "none"
        fallback.style.display = "flex"
      }
      avatar.appendChild(img)
    }

    const fallback = document.createElement("div")
    fallback.className = `avatar-fallback ${user.initials.toLowerCase()}`
    fallback.textContent = user.initials
    fallback.style.display = user.avatar ? "none" : "flex"
    avatar.appendChild(fallback)

    if (user.status) {
      const statusIndicator = document.createElement("div")
      statusIndicator.className = `status-indicator ${user.status}`
      avatar.appendChild(statusIndicator)
    }

    return avatar
  }

  // Message Component
  static createMessage(message) {
    const messageEl = document.createElement("div")
    messageEl.className = `message ${message.type}`
    messageEl.setAttribute("data-message-id", message.id)

    const content = document.createElement("div")
    content.className = "message-content"
    content.innerHTML = message.content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")

    const time = document.createElement("div")
    time.className = "message-time"
    time.textContent = new Date(message.timestamp).toLocaleTimeString()

    messageEl.appendChild(content)
    messageEl.appendChild(time)

    // Add message status for sent messages
    if (message.type === "sent" && message.status) {
      const status = document.createElement("span")
      status.className = "message-status"
      status.innerHTML = this.getStatusIcon(message.status)
      time.appendChild(status)
    }

    return messageEl
  }

  static getStatusIcon(status) {
    const icons = {
      sent: '<i class="fas fa-check"></i>',
      delivered: '<i class="fas fa-check-double"></i>',
      read: '<i class="fas fa-check-double" style="color: var(--primary-color);"></i>',
    }
    return icons[status] || ""
  }

  // Chat Item Component
  static createChatItem(chat) {
    const item = document.createElement("div")
    item.className = "chat-item"
    item.setAttribute("data-chat-id", chat.id)

    if (chat.active) {
      item.classList.add("active")
    }

    // Avatar
    const avatar = this.createAvatar(chat.user, "lg")
    item.appendChild(avatar)

    // Chat Info
    const info = document.createElement("div")
    info.className = "chat-info"

    const name = document.createElement("div")
    name.className = "chat-name"
    name.textContent = chat.user.name

    const preview = document.createElement("div")
    preview.className = "chat-preview"
    preview.textContent = chat.lastMessage.content.slice(0, 40) + (chat.lastMessage.content.length > 40 ? "..." : "")

    info.appendChild(name)
    info.appendChild(preview)
    item.appendChild(info)

    // Chat Meta
    const meta = document.createElement("div")
    meta.className = "chat-meta"

    const time = document.createElement("div")
    time.className = "chat-time"
    time.textContent = new Date(chat.lastMessage.timestamp).toLocaleDateString()

    meta.appendChild(time)

    if (chat.unreadCount > 0) {
      const badge = document.createElement("div")
      badge.className = "unread-badge"
      badge.textContent = chat.unreadCount > 99 ? "99+" : chat.unreadCount
      meta.appendChild(badge)
    }

    item.appendChild(meta)

    return item
  }

  // Typing Indicator Component
  static createTypingIndicator(user) {
    const indicator = document.createElement("div")
    indicator.id = "typingIndicator"
    indicator.className = "typing-indicator"

    const avatar = this.createAvatar(user, "sm")
    avatar.classList.add("typing-avatar")

    const content = document.createElement("div")
    content.className = "typing-content"

    const dots = document.createElement("div")
    dots.className = "typing-dots"
    for (let i = 0; i < 3; i++) {
      dots.appendChild(document.createElement("span"))
    }

    const text = document.createElement("span")
    text.className = "typing-text"
    text.textContent = `${user.name} is typing...`

    content.appendChild(dots)
    content.appendChild(text)

    indicator.appendChild(avatar)
    indicator.appendChild(content)

    return indicator
  }

  // File Item Component
  static createFileItem(file) {
    const item = document.createElement("div")
    item.className = "file-item"

    const icon = document.createElement("div")
    icon.className = "file-icon"
    icon.innerHTML = this.getFileIcon(file.type)

    const info = document.createElement("div")
    info.className = "file-info"

    const name = document.createElement("span")
    name.className = "file-name"
    name.textContent = file.name

    const size = document.createElement("span")
    size.className = "file-size"
    size.textContent = this.formatFileSize(file.size)

    info.appendChild(name)
    info.appendChild(size)

    item.appendChild(icon)
    item.appendChild(info)

    return item
  }

  static getFileIcon(type) {
    const icons = {
      "application/pdf": '<i class="fas fa-file-pdf"></i>',
      "image/": '<i class="fas fa-file-image"></i>',
      "video/": '<i class="fas fa-file-video"></i>',
      "audio/": '<i class="fas fa-file-audio"></i>',
      "text/": '<i class="fas fa-file-alt"></i>',
      "application/zip": '<i class="fas fa-file-archive"></i>',
      "application/msword": '<i class="fas fa-file-word"></i>',
      "application/vnd.ms-excel": '<i class="fas fa-file-excel"></i>',
      "application/vnd.ms-powerpoint": '<i class="fas fa-file-powerpoint"></i>',
    }

    for (const [key, icon] of Object.entries(icons)) {
      if (type.startsWith(key)) {
        return icon
      }
    }

    return '<i class="fas fa-file"></i>'
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Toast Notification Component
  static showToast(message, type = "info", duration = 3000) {
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    min-width: 300px;
    padding: 16px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1070;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `

    const content = document.createElement("div")
    content.style.cssText = "display: flex; align-items: center; gap: 12px;"

    const icon = document.createElement("i")
    icon.className = `fas fa-${this.getToastIcon(type)}`
    icon.style.color = this.getToastColor(type)

    const text = document.createElement("span")
    text.textContent = message

    const closeBtn = document.createElement("button")
    closeBtn.innerHTML = '<i class="fas fa-times"></i>'
    closeBtn.style.cssText = `
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
  `

    content.appendChild(icon)
    content.appendChild(text)
    toast.appendChild(content)
    toast.appendChild(closeBtn)

    document.body.appendChild(toast)

    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = "translateX(0)"
      toast.style.opacity = "1"
    })

    // Remove toast
    const removeToast = () => {
      toast.style.transform = "translateX(100%)"
      toast.style.opacity = "0"
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }

    closeBtn.addEventListener("click", removeToast)

    if (duration > 0) {
      setTimeout(removeToast, duration)
    }

    return toast
  }

  static getToastIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    }
    return icons[type] || "info-circle"
  }

  static getToastColor(type) {
    const colors = {
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#6366f1",
    }
    return colors[type] || "#6366f1"
  }

  static createModal(title, content, actions = []) {
    const overlay = document.createElement("div")
    overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1040;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  `

    const modal = document.createElement("div")
    modal.style.cssText = `
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    transform: scale(0.95);
    transition: transform 0.3s ease;
  `

    modal.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 24px; border-bottom: 1px solid #e2e8f0;">
      <h3 style="font-size: 18px; font-weight: 600; color: #1e293b;">${title}</h3>
      <button class="modal-close" style="background: none; border: none; color: #64748b; cursor: pointer; padding: 8px; border-radius: 6px;">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div style="padding: 24px; overflow-y: auto; max-height: 60vh;">
      ${content}
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 12px; padding: 24px; border-top: 1px solid #e2e8f0;">
      ${actions
        .map(
          (action) => `
        <button class="btn ${action.class || "btn-secondary"}" data-action="${action.action}" style="
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
          ${action.class === "btn-primary" ? "background: #6366f1; color: white;" : "background: #f1f5f9; color: #334155;"}
        ">
          ${action.text}
        </button>
      `,
        )
        .join("")}
    </div>
  `

    overlay.appendChild(modal)
    document.body.appendChild(overlay)

    // Animate in
    requestAnimationFrame(() => {
      overlay.style.opacity = "1"
      modal.style.transform = "scale(1)"
    })

    // Close handlers
    const closeModal = () => {
      overlay.style.opacity = "0"
      modal.style.transform = "scale(0.95)"
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay)
        }
      }, 300)
    }

    modal.querySelector(".modal-close").addEventListener("click", closeModal)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal()
    })

    // Action handlers
    modal.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const action = e.target.dataset.action
        if (action === "close") {
          closeModal()
        }
        modal.dispatchEvent(
          new CustomEvent("modalAction", {
            detail: { action, modal, closeModal },
          }),
        )
      })
    })

    return { modal, overlay, closeModal }
  }
}

// Export for use in other modules
window.UIComponents = UIComponents
