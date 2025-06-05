class ChatApp {
  constructor() {
    this.currentTheme = "light"
    this.currentChat = "emma"
    this.isTyping = false
    this.profileDropdownOpen = false
    this.fontSize = "medium" // small, medium, large

    this.botResponses = [
      "That sounds great! I'm looking forward to it.",
      "Thanks for sharing that with me.",
      "I completely agree with your point.",
      "Let me think about that for a moment...",
      "That's a really interesting perspective!",
      "I'll get back to you on that shortly.",
      "Perfect! That works for me.",
      "I appreciate you letting me know.",
      "That makes a lot of sense.",
      "I'm excited to see how this turns out!",
      "Thanks for the update!",
      "I'll make sure to follow up on that.",
      "Great idea! Let's move forward with it.",
      "I understand what you mean.",
      "That's exactly what I was thinking!",
    ]

    this.init()
  }

  init() {
    this.loadTheme()
    this.loadFontSize()
    this.bindEvents()
    this.autoResizeTextarea()
    this.scrollToBottom()
    this.focusMessageInput()
  }

  bindEvents() {
    // Theme toggle
    document.getElementById("themeToggle").addEventListener("click", () => {
      this.toggleTheme()
    })

    // New Chat Button - Fixed functionality
    document.getElementById("newChatBtn").addEventListener("click", () => {
      this.showNewChatModal()
    })

    // Profile dropdown
    document.getElementById("userProfile").addEventListener("click", (e) => {
      e.stopPropagation()
      this.toggleProfileDropdown()
    })

    // Profile picture upload
    document.getElementById("uploadProfilePic").addEventListener("click", () => {
      this.uploadProfilePicture()
    })

    // Profile settings - Add font size controls
    document.getElementById("profileSettings").addEventListener("click", () => {
      this.showSettingsModal()
    })

    // Sign out
    document.getElementById("signOut").addEventListener("click", () => {
      this.signOut()
    })

    // Send message
    document.getElementById("sendBtn").addEventListener("click", () => {
      this.sendMessage()
    })

    // Message input
    const messageInput = document.getElementById("messageInput")
    messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        this.sendMessage()
      }
    })

    messageInput.addEventListener("input", () => {
      this.autoResizeTextarea()
      this.updateSendButton()
    })

    // Chat selection
    document.querySelectorAll(".chat-item").forEach((item) => {
      item.addEventListener("click", () => {
        this.selectChat(item.dataset.chat)
      })
    })

    // Filter tabs
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        this.filterChats(tab.dataset.filter)
      })
    })

    // Search
    document.getElementById("searchInput").addEventListener("input", (e) => {
      this.searchChats(e.target.value)
    })

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".user-profile")) {
        this.closeProfileDropdown()
      }
    })

    // File input for profile picture
    document.getElementById("profilePicInput").addEventListener("change", (e) => {
      this.handleProfilePictureUpload(e.target.files[0])
    })

    // Attachment button
    document.getElementById("attachmentBtn").addEventListener("click", () => {
      this.handleAttachment()
    })

    // Emoji button
    document.getElementById("emojiBtn").addEventListener("click", () => {
      this.showEmojiPicker()
    })

    // Notifications
    document.getElementById("notifications").addEventListener("click", () => {
      this.showNotifications()
    })

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e)
    })

    // Window resize
    window.addEventListener("resize", () => {
      this.handleResize()
    })
  }

  loadTheme() {
    const savedTheme = localStorage.getItem("chatapp-theme") || "light"
    this.setTheme(savedTheme)
  }

  loadFontSize() {
    const savedFontSize = localStorage.getItem("chatapp-fontsize") || "medium"
    this.setFontSize(savedFontSize)
  }

  setTheme(theme) {
    this.currentTheme = theme
    document.documentElement.setAttribute("data-theme", theme)

    const themeIcon = document.querySelector("#themeToggle i")
    themeIcon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon"

    localStorage.setItem("chatapp-theme", theme)
  }

  setFontSize(size) {
    this.fontSize = size
    document.documentElement.setAttribute("data-fontsize", size)
    localStorage.setItem("chatapp-fontsize", size)
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light"
    this.setTheme(newTheme)
    this.showToast(`Switched to ${newTheme} mode`, "success")
  }

  showNewChatModal() {
    const contacts = [
      { name: "John Doe", email: "john.doe@company.com", initials: "JD", status: "online" },
      { name: "Jane Smith", email: "jane.smith@company.com", initials: "JS", status: "away" },
      { name: "Alex Johnson", email: "alex.johnson@company.com", initials: "AJ", status: "online" },
      { name: "Sarah Wilson", email: "sarah.wilson@company.com", initials: "SW", status: "offline" },
      { name: "Mike Brown", email: "mike.brown@company.com", initials: "MB", status: "online" },
    ]

    const content = `
      <div style="margin-bottom: 20px;">
        <input type="text" id="contactSearch" placeholder="Search contacts..." 
               style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 14px;">
      </div>
      <div style="max-height: 300px; overflow-y: auto;">
        ${contacts
          .map(
            (contact) => `
          <div class="contact-option" data-contact='${JSON.stringify(contact)}' 
               style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; cursor: pointer; transition: background-color 0.15s;"
               onmouseover="this.style.backgroundColor='var(--background-tertiary)'" 
               onmouseout="this.style.backgroundColor='transparent'">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px;">
              ${contact.initials}
            </div>
            <div style="flex: 1;">
              <div style="font-weight: 500; margin-bottom: 2px;">${contact.name}</div>
              <div style="font-size: 12px; color: var(--text-secondary);">${contact.email}</div>
            </div>
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${contact.status === "online" ? "var(--success-color)" : contact.status === "away" ? "var(--warning-color)" : "var(--text-muted)"};"></div>
          </div>
        `,
          )
          .join("")}
      </div>
    `

    const modal = this.createModal("Start New Chat", content)

    // Add search functionality
    const searchInput = modal.querySelector("#contactSearch")
    const contactOptions = modal.querySelectorAll(".contact-option")

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase()
      contactOptions.forEach((option) => {
        const contact = JSON.parse(option.dataset.contact)
        const matches = contact.name.toLowerCase().includes(query) || contact.email.toLowerCase().includes(query)
        option.style.display = matches ? "flex" : "none"
      })
    })

    // Add click handlers for contacts
    contactOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const contact = JSON.parse(option.dataset.contact)
        this.startNewChat(contact)
        modal.remove()
      })
    })

    // Focus search input
    setTimeout(() => searchInput.focus(), 100)
  }

  startNewChat(contact) {
    this.showToast(`Started new chat with ${contact.name}`, "success")

    // In a real app, you would create a new chat entry
    // For demo purposes, we'll just show a success message
    console.log("Starting new chat with:", contact)
  }

  showSettingsModal() {
    const content = `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Font Size Settings -->
        <div>
          <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Font Size</h4>
          <div style="display: flex; gap: 8px;">
            <button class="font-size-btn ${this.fontSize === "small" ? "active" : ""}" data-size="small"
                    style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; background: ${this.fontSize === "small" ? "var(--primary-color)" : "var(--background-secondary)"}; color: ${this.fontSize === "small" ? "white" : "var(--text-primary)"}; cursor: pointer; transition: all 0.15s;">
              Small
            </button>
            <button class="font-size-btn ${this.fontSize === "medium" ? "active" : ""}" data-size="medium"
                    style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; background: ${this.fontSize === "medium" ? "var(--primary-color)" : "var(--background-secondary)"}; color: ${this.fontSize === "medium" ? "white" : "var(--text-primary)"}; cursor: pointer; transition: all 0.15s;">
              Medium
            </button>
            <button class="font-size-btn ${this.fontSize === "large" ? "active" : ""}" data-size="large"
                    style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; background: ${this.fontSize === "large" ? "var(--primary-color)" : "var(--background-secondary)"}; color: ${this.fontSize === "large" ? "white" : "var(--text-primary)"}; cursor: pointer; transition: all 0.15s;">
              Large
            </button>
          </div>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: var(--text-secondary);">
            Adjust the font size for better readability
          </p>
        </div>

        <!-- Theme Settings -->
        <div>
          <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Theme</h4>
          <div style="display: flex; gap: 8px;">
            <button class="theme-btn ${this.currentTheme === "light" ? "active" : ""}" data-theme="light"
                    style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; background: ${this.currentTheme === "light" ? "var(--primary-color)" : "var(--background-secondary)"}; color: ${this.currentTheme === "light" ? "white" : "var(--text-primary)"}; cursor: pointer; transition: all 0.15s;">
              <i class="fas fa-sun" style="margin-right: 6px;"></i>Light
            </button>
            <button class="theme-btn ${this.currentTheme === "dark" ? "active" : ""}" data-theme="dark"
                    style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; background: ${this.currentTheme === "dark" ? "var(--primary-color)" : "var(--background-secondary)"}; color: ${this.currentTheme === "dark" ? "white" : "var(--text-primary)"}; cursor: pointer; transition: all 0.15s;">
              <i class="fas fa-moon" style="margin-right: 6px;"></i>Dark
            </button>
          </div>
        </div>

        <!-- Notification Settings -->
        <div>
          <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Notifications</h4>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="soundNotifications" checked style="margin: 0;">
            <span>Sound notifications</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin-top: 8px;">
            <input type="checkbox" id="desktopNotifications" checked style="margin: 0;">
            <span>Desktop notifications</span>
          </label>
        </div>
      </div>
    `

    const modal = this.createModal("Settings", content)
    this.closeProfileDropdown()

    // Add event listeners for font size buttons
    modal.querySelectorAll(".font-size-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const size = btn.dataset.size
        this.setFontSize(size)

        // Update button states
        modal.querySelectorAll(".font-size-btn").forEach((b) => {
          b.classList.remove("active")
          b.style.background = "var(--background-secondary)"
          b.style.color = "var(--text-primary)"
        })
        btn.classList.add("active")
        btn.style.background = "var(--primary-color)"
        btn.style.color = "white"

        this.showToast(`Font size changed to ${size}`, "success")
      })
    })

    // Add event listeners for theme buttons
    modal.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const theme = btn.dataset.theme
        this.setTheme(theme)

        // Update button states
        modal.querySelectorAll(".theme-btn").forEach((b) => {
          b.classList.remove("active")
          b.style.background = "var(--background-secondary)"
          b.style.color = "var(--text-primary)"
        })
        btn.classList.add("active")
        btn.style.background = "var(--primary-color)"
        btn.style.color = "white"

        this.showToast(`Theme changed to ${theme} mode`, "success")
      })
    })
  }

  toggleProfileDropdown() {
    const dropdown = document.getElementById("profileDropdown")
    this.profileDropdownOpen = !this.profileDropdownOpen

    if (this.profileDropdownOpen) {
      dropdown.classList.add("show")
    } else {
      dropdown.classList.remove("show")
    }
  }

  closeProfileDropdown() {
    const dropdown = document.getElementById("profileDropdown")
    dropdown.classList.remove("show")
    this.profileDropdownOpen = false
  }

  uploadProfilePicture() {
    document.getElementById("profilePicInput").click()
    this.closeProfileDropdown()
  }

  handleProfilePictureUpload(file) {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result

        // Update all user avatar images
        document.getElementById("userAvatarImg").src = imageUrl
        document.getElementById("userAvatarImg").style.display = "block"

        // Hide fallback avatars
        document.querySelectorAll(".user-avatar .avatar-fallback").forEach((fallback) => {
          fallback.style.display = "none"
        })

        this.showToast("Profile picture updated successfully!", "success")
      }
      reader.readAsDataURL(file)
    } else {
      this.showToast("Please select a valid image file", "error")
    }
  }

  signOut() {
    this.showToast("Signing out...", "info")
    this.closeProfileDropdown()

    // Simulate sign out process
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }

  sendMessage() {
    const input = document.getElementById("messageInput")
    const message = input.value.trim()

    if (!message) return

    // Add user message
    this.addMessage(message, "sent")

    // Clear input
    input.value = ""
    this.autoResizeTextarea()
    this.updateSendButton()

    // Scroll to bottom
    this.scrollToBottom()

    // Show typing indicator and simulate bot response
    this.showTypingIndicator()

    // Simulate bot response delay
    setTimeout(
      () => {
        this.hideTypingIndicator()
        this.addBotResponse()
      },
      1000 + Math.random() * 2000,
    )
  }

  addMessage(content, type) {
    const messagesContainer = document.getElementById("messagesContainer")
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${type}`

    const now = new Date()
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    let avatarHtml = ""
    if (type === "received") {
      const chatData = this.getChatData(this.currentChat)
      avatarHtml = `
      <div class="message-avatar">
          <img src="/placeholder.svg?height=32&width=32" alt="${chatData.name}">
          <div class="avatar-fallback ${chatData.initials.toLowerCase()}">${chatData.initials}</div>
      </div>
    `
    }

    messageDiv.innerHTML = `
    ${avatarHtml}
    <div class="message-content">
        <div class="message-bubble">${this.escapeHtml(content)}</div>
        <div class="message-time">${timeString}</div>
    </div>
  `

    messagesContainer.appendChild(messageDiv)
    this.scrollToBottom()

    // Update chat preview in sidebar
    this.updateChatPreview(content, type)
  }

  addBotResponse() {
    const randomResponse = this.botResponses[Math.floor(Math.random() * this.botResponses.length)]
    this.addMessage(randomResponse, "received")
  }

  showTypingIndicator() {
    const indicator = document.getElementById("typingIndicator")
    const chatData = this.getChatData(this.currentChat)

    // Update typing indicator content dynamically
    const typingAvatar = indicator.querySelector(".typing-avatar .avatar-fallback")
    const typingText = indicator.querySelector(".typing-text")

    if (typingAvatar && typingText) {
      typingAvatar.textContent = chatData.initials
      typingAvatar.className = `avatar-fallback ${chatData.initials.toLowerCase()}`
      typingText.textContent = `${chatData.name} is typing...`
    }

    indicator.classList.add("show")
    this.isTyping = true
    this.scrollToBottom()
  }

  hideTypingIndicator() {
    const indicator = document.getElementById("typingIndicator")
    indicator.classList.remove("show")
    this.isTyping = false
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById("messagesContainer")
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }, 100)
  }

  autoResizeTextarea() {
    const textarea = document.getElementById("messageInput")
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
  }

  updateSendButton() {
    const input = document.getElementById("messageInput")
    const sendBtn = document.getElementById("sendBtn")

    if (input.value.trim()) {
      sendBtn.disabled = false
      sendBtn.style.opacity = "1"
    } else {
      sendBtn.disabled = true
      sendBtn.style.opacity = "0.5"
    }
  }

  selectChat(chatId) {
    // Remove active class from all chat items
    document.querySelectorAll(".chat-item").forEach((item) => {
      item.classList.remove("active")
    })

    // Add active class to selected chat
    document.querySelector(`[data-chat="${chatId}"]`).classList.add("active")

    // Update current chat
    this.currentChat = chatId

    // Update chat header based on selected chat
    this.updateChatHeader(chatId)

    // Clear messages and load chat history (in a real app, this would load from server)
    this.loadChatHistory(chatId)
  }

  updateChatHeader(chatId) {
    const chatData = this.getChatData(chatId)

    // Update contact info in header
    document.querySelector(".contact-name").textContent = chatData.name
    document.querySelector(".contact-status").innerHTML = `
            <span class="status-dot ${chatData.status}"></span>
            ${chatData.status === "online" ? "Online" : "Away"} • Last seen ${chatData.lastSeen}
        `

    // Update avatar
    const contactAvatar = document.querySelector(".contact-avatar .avatar-fallback")
    contactAvatar.textContent = chatData.initials
    contactAvatar.className = `avatar-fallback ${chatData.initials.toLowerCase()}`

    // Update right sidebar
    this.updateRightSidebar(chatData)
  }

  updateRightSidebar(chatData) {
    // Update profile section
    document.querySelector(".profile-name").textContent = chatData.name
    document.querySelector(".profile-title").textContent = chatData.title

    const profileAvatar = document.querySelector(".profile-avatar .avatar-fallback")
    profileAvatar.textContent = chatData.initials
    profileAvatar.className = `avatar-fallback ${chatData.initials.toLowerCase()}`

    // Update contact information
    document.querySelector(".contact-items .contact-item:nth-child(1) .item-value").textContent = chatData.email
    document.querySelector(".contact-items .contact-item:nth-child(2) .item-value").textContent = chatData.phone
    document.querySelector(".contact-items .contact-item:nth-child(3) .item-value").textContent = chatData.location
  }

  getChatData(chatId) {
    const chatData = {
      emma: {
        name: "Emma Thompson",
        initials: "EM",
        status: "online",
        lastSeen: "2 minutes ago",
        title: "Product Manager",
        email: "emma.thompson@company.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
      },
      michael: {
        name: "Michael Johnson",
        initials: "MJ",
        status: "online",
        lastSeen: "5 minutes ago",
        title: "Software Engineer",
        email: "michael.johnson@company.com",
        phone: "+1 (555) 234-5678",
        location: "New York, NY",
      },
      sophia: {
        name: "Sophia Lee",
        initials: "SL",
        status: "away",
        lastSeen: "1 hour ago",
        title: "UX Designer",
        email: "sophia.lee@company.com",
        phone: "+1 (555) 345-6789",
        location: "Los Angeles, CA",
      },
      robert: {
        name: "Robert Brown",
        initials: "RB",
        status: "offline",
        lastSeen: "2 hours ago",
        title: "Project Manager",
        email: "robert.brown@company.com",
        phone: "+1 (555) 456-7890",
        location: "Chicago, IL",
      },
    }

    return chatData[chatId] || chatData.emma
  }

  loadChatHistory(chatId) {
    const messagesContainer = document.getElementById("messagesContainer")
    messagesContainer.innerHTML = ""

    // Sample messages for demonstration
    const sampleMessages = [
      { content: "Hey! How's your day going?", type: "received", time: "10:30 AM" },
      { content: "Pretty good! Just finished the morning standup. How about you?", type: "sent", time: "10:32 AM" },
      {
        content: "Same here! I wanted to discuss the new project requirements with you.",
        type: "received",
        time: "10:35 AM",
      },
      { content: "I have some time now. What did you want to go over?", type: "sent", time: "10:36 AM" },
    ]

    sampleMessages.forEach((msg) => {
      this.addMessageToHistory(msg.content, msg.type, msg.time)
    })

    this.scrollToBottom()
  }

  addMessageToHistory(content, type, time) {
    const messagesContainer = document.getElementById("messagesContainer")
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${type}`

    let avatarHtml = ""
    if (type === "received") {
      const chatData = this.getChatData(this.currentChat)
      avatarHtml = `
      <div class="message-avatar">
          <img src="/placeholder.svg?height=32&width=32" alt="${chatData.name}">
          <div class="avatar-fallback ${chatData.initials.toLowerCase()}">${chatData.initials}</div>
      </div>
    `
    }

    messageDiv.innerHTML = `
    ${avatarHtml}
    <div class="message-content">
        <div class="message-bubble">${this.escapeHtml(content)}</div>
        <div class="message-time">${time}</div>
    </div>
  `

    messagesContainer.appendChild(messageDiv)
  }

  filterChats(filter) {
    // Remove active class from all tabs
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.classList.remove("active")
    })

    // Add active class to selected tab
    document.querySelector(`[data-filter="${filter}"]`).classList.add("active")

    // Filter logic would go here
    this.showToast(`Showing ${filter} conversations`, "info")
  }

  searchChats(query) {
    const chatItems = document.querySelectorAll(".chat-item")

    chatItems.forEach((item) => {
      const name = item.querySelector(".chat-name").textContent.toLowerCase()
      const preview = item.querySelector(".chat-preview").textContent.toLowerCase()

      if (name.includes(query.toLowerCase()) || preview.includes(query.toLowerCase())) {
        item.style.display = "grid"
      } else {
        item.style.display = query ? "none" : "grid"
      }
    })
  }

  updateChatPreview(content, type) {
    const activeChat = document.querySelector(".chat-item.active")
    if (activeChat) {
      const preview = activeChat.querySelector(".chat-preview")
      const time = activeChat.querySelector(".chat-time")

      // Update preview text
      const previewText = type === "sent" ? `You: ${content}` : content
      preview.textContent = previewText.length > 40 ? previewText.substring(0, 40) + "..." : previewText

      // Update time
      const now = new Date()
      time.textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  handleAttachment() {
    this.showToast("Attachment feature coming soon!", "info")
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

    // Create emoji picker modal
    const modal = this.createModal(
      "Choose Emoji",
      `
            <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 8px; max-height: 300px; overflow-y: auto;">
                ${emojis
                  .map(
                    (emoji) => `
                    <button style="padding: 8px; border: none; background: none; font-size: 20px; cursor: pointer; border-radius: 6px; transition: background-color 0.15s;" 
                            onmouseover="this.style.backgroundColor='var(--background-tertiary)'" 
                            onmouseout="this.style.backgroundColor='transparent'"
                            onclick="document.getElementById('messageInput').value += '${emoji}'; this.closest('.modal-overlay').remove(); document.getElementById('messageInput').focus();">
                        ${emoji}
                    </button>
                `,
                  )
                  .join("")}
            </div>
        `,
    )
  }

  showNotifications() {
    const notifications = [
      { title: "New message from Emma", message: "Hey, are you available for a quick call?", time: "5 min ago" },
      { title: "Meeting reminder", message: "Team standup in 15 minutes", time: "10 min ago" },
      { title: "File shared", message: "Michael shared a document with you", time: "30 min ago" },
    ]

    const content = `
            <div style="max-height: 400px; overflow-y: auto;">
                ${notifications
                  .map(
                    (notif) => `
                    <div style="padding: 16px; border-bottom: 1px solid var(--border-color); cursor: pointer;" 
                         onmouseover="this.style.backgroundColor='var(--background-tertiary)'" 
                         onmouseout="this.style.backgroundColor='transparent'">
                        <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">${notif.title}</h4>
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: var(--text-secondary);">${notif.message}</p>
                        <span style="font-size: 12px; color: var(--text-muted);">${notif.time}</span>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `

    this.createModal("Notifications", content)
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K - Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      document.getElementById("searchInput").focus()
    }

    // Ctrl/Cmd + T - Toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === "t") {
      e.preventDefault()
      this.toggleTheme()
    }

    // Ctrl/Cmd + N - New chat
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault()
      this.showNewChatModal()
    }

    // Ctrl/Cmd + Plus/Minus - Font size
    if ((e.ctrlKey || e.metaKey) && e.key === "=") {
      e.preventDefault()
      this.increaseFontSize()
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "-") {
      e.preventDefault()
      this.decreaseFontSize()
    }

    // Escape - Close modals/dropdowns
    if (e.key === "Escape") {
      this.closeProfileDropdown()
      document.querySelectorAll(".modal-overlay").forEach((modal) => modal.remove())
    }
  }

  increaseFontSize() {
    const sizes = ["small", "medium", "large"]
    const currentIndex = sizes.indexOf(this.fontSize)
    if (currentIndex < sizes.length - 1) {
      this.setFontSize(sizes[currentIndex + 1])
      this.showToast(`Font size increased to ${sizes[currentIndex + 1]}`, "success")
    }
  }

  decreaseFontSize() {
    const sizes = ["small", "medium", "large"]
    const currentIndex = sizes.indexOf(this.fontSize)
    if (currentIndex > 0) {
      this.setFontSize(sizes[currentIndex - 1])
      this.showToast(`Font size decreased to ${sizes[currentIndex - 1]}`, "success")
    }
  }

  handleResize() {
    // Handle responsive behavior
    if (window.innerWidth <= 768) {
      // Mobile behavior
    } else {
      // Desktop behavior
    }
  }

  focusMessageInput() {
    setTimeout(() => {
      document.getElementById("messageInput").focus()
    }, 100)
  }

  createModal(title, content) {
    const overlay = document.createElement("div")
    overlay.className = "modal-overlay"
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1050;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `

    const modal = document.createElement("div")
    modal.style.cssText = `
            background: var(--background-primary);
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            transform: scale(0.95);
            transition: transform 0.3s ease;
        `

    modal.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 24px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">${title}</h3>
                <button onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 8px; border-radius: 6px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div style="padding: 24px;">
                ${content}
            </div>
        `

    overlay.appendChild(modal)
    document.body.appendChild(overlay)

    // Animate in
    requestAnimationFrame(() => {
      overlay.style.opacity = "1"
      modal.style.transform = "scale(1)"
    })

    // Close on overlay click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove()
      }
    })

    return overlay
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div")
    toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--background-primary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 16px;
            box-shadow: var(--shadow-lg);
            z-index: 1060;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
        `

    const iconColors = {
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#6366f1",
    }

    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    }

    toast.innerHTML = `
            <i class="fas fa-${icons[type]}" style="color: ${iconColors[type]};"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; margin-left: auto;">
                <i class="fas fa-times"></i>
            </button>
        `

    document.body.appendChild(toast)

    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = "translateX(0)"
      toast.style.opacity = "1"
    })

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = "translateX(100%)"
      toast.style.opacity = "0"
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const app = new ChatApp()
  console.log("ChatPro initialized successfully!")
})
