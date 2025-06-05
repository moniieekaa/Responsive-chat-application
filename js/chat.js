// Chat Management System
class ChatManager {
  constructor() {
    this.currentChatId = null
    this.chats = new Map()
    this.messages = new Map()
    this.users = new Map()
    this.isTyping = false
    this.typingTimeout = null

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
      "Could you tell me more about that?",
      "I see what you're getting at.",
      "That's a valid point to consider.",
      "I hadn't thought of it that way before.",
      "Let's schedule a time to discuss this further.",
    ]

    this.init()
  }

  init() {
    this.loadSampleData()
    this.bindEvents()
  }

  loadSampleData() {
    // Sample users
    const users = [
      {
        id: "emma",
        name: "Emma Thompson",
        initials: "EM",
        avatar: "assets/images/emma-avatar.jpg",
        status: "online",
        title: "Product Manager",
        email: "emma.thompson@company.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
      },
      {
        id: "michael",
        name: "Michael Johnson",
        initials: "MJ",
        status: "online",
        title: "Software Engineer",
      },
      {
        id: "sophia",
        name: "Sophia Lee",
        initials: "SL",
        status: "away",
        title: "UX Designer",
      },
      {
        id: "robert",
        name: "Robert Brown",
        initials: "RB",
        status: "offline",
        title: "Project Manager",
      },
      {
        id: "amelia",
        name: "Amelia Wilson",
        initials: "AW",
        status: "online",
        title: "Marketing Manager",
      },
      {
        id: "daniel",
        name: "Daniel Martinez",
        initials: "DM",
        status: "away",
        title: "Data Analyst",
      },
    ]

    users.forEach((user) => this.users.set(user.id, user))

    // Sample chats
    const chats = [
      {
        id: "emma",
        userId: "emma",
        lastMessage: {
          content: "I've sent you the latest project files.",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          type: "received",
        },
        unreadCount: 0,
        active: true,
      },
      {
        id: "michael",
        userId: "michael",
        lastMessage: {
          content: "Are we still meeting for coffee tomorrow?",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          type: "received",
        },
        unreadCount: 2,
        active: false,
      },
      {
        id: "sophia",
        userId: "sophia",
        lastMessage: {
          content: "The design team loved your presentation!",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          type: "received",
        },
        unreadCount: 1,
        active: false,
      },
      {
        id: "robert",
        userId: "robert",
        lastMessage: {
          content: "Can you review the budget proposal?",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          type: "received",
        },
        unreadCount: 0,
        active: false,
      },
      {
        id: "amelia",
        userId: "amelia",
        lastMessage: {
          content: "Thanks for your help with the client presentation!",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          type: "received",
        },
        unreadCount: 0,
        active: false,
      },
      {
        id: "daniel",
        userId: "daniel",
        lastMessage: {
          content: "Let's schedule a call to discuss the requirements.",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          type: "received",
        },
        unreadCount: 0,
        active: false,
      },
    ]

    chats.forEach((chat) => {
      chat.user = this.users.get(chat.userId)
      this.chats.set(chat.id, chat)
    })

    // Sample messages for Emma
    const emmaMessages = [
      {
        id: this.generateId(),
        content: "Sounds great! I've heard good things about their pasta. Looking forward to it.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        type: "received",
        userId: "emma",
      },
      {
        id: this.generateId(),
        content:
          "Oh, I almost forgot - do you have the latest version of the client presentation? I want to make sure we're all on the same page for tomorrow.",
        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        type: "received",
        userId: "emma",
      },
      {
        id: this.generateId(),
        content:
          "I've just sent it to your email. It includes all the updates we discussed in the last meeting. Let me know if you need anything else!",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        type: "sent",
        status: "read",
      },
      {
        id: this.generateId(),
        content: "Got it, thanks! I'll review it before our lunch. See you soon!",
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        type: "received",
        userId: "emma",
      },
      {
        id: this.generateId(),
        content: "Looking forward to it! 👍",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: "sent",
        status: "read",
      },
    ]

    this.messages.set("emma", emmaMessages)
    this.currentChatId = "emma"
  }

  bindEvents() {
    // Send message
    const sendBtn = document.getElementById("sendBtn")
    const messageInput = document.getElementById("messageInput")

    if (sendBtn) {
      sendBtn.addEventListener("click", () => this.sendMessage())
    }

    if (messageInput) {
      messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          this.sendMessage()
        }
      })

      messageInput.addEventListener("input", () => {
        this.handleTyping()
        this.updateCharCounter()
      })
    }

    // Chat selection
    document.addEventListener("click", (e) => {
      const chatItem = e.target.closest(".chat-item")
      if (chatItem) {
        const chatId = chatItem.dataset.chatId
        this.selectChat(chatId)
      }
    })
  }

  sendMessage() {
    const messageInput = document.getElementById("messageInput")
    const content = messageInput.value.trim()

    if (!content || !this.currentChatId) return

    const message = {
      id: this.generateId(),
      content: content,
      timestamp: new Date(),
      type: "sent",
      status: "sent",
    }

    // Add message to current chat
    if (!this.messages.has(this.currentChatId)) {
      this.messages.set(this.currentChatId, [])
    }

    this.messages.get(this.currentChatId).push(message)

    // Update UI
    this.renderMessage(message)
    this.updateChatPreview(this.currentChatId, message)

    // Clear input
    messageInput.value = ""
    this.autoResizeTextarea()
    this.updateCharCounter()

    // Scroll to bottom
    this.scrollToBottom()

    // Simulate message status updates
    this.simulateMessageStatus(message)

    // Show typing indicator and simulate bot response
    this.showTypingIndicator()

    setTimeout(
      () => {
        this.hideTypingIndicator()
        this.addBotResponse()
      },
      this.randomDelay(1000, 3000),
    )
  }

  addBotResponse() {
    if (!this.currentChatId) return

    const response = this.randomChoice(this.botResponses)
    const message = {
      id: this.generateId(),
      content: response,
      timestamp: new Date(),
      type: "received",
      userId: this.currentChatId,
    }

    this.messages.get(this.currentChatId).push(message)
    this.renderMessage(message)
    this.updateChatPreview(this.currentChatId, message)
    this.scrollToBottom()
  }

  renderMessage(message) {
    const messagesContainer = document.getElementById("chatMessages")
    if (!messagesContainer) return

    const messageEl = this.createMessage(message)
    messagesContainer.appendChild(messageEl)

    // Animate in
    requestAnimationFrame(() => {
      messageEl.classList.add("animate-fade-in-up")
    })
  }

  renderMessages(chatId) {
    const messagesContainer = document.getElementById("chatMessages")
    if (!messagesContainer) return

    messagesContainer.innerHTML = ""

    const messages = this.messages.get(chatId) || []
    messages.forEach((message) => {
      this.renderMessage(message)
    })

    this.scrollToBottom()
  }

  selectChat(chatId) {
    if (chatId === this.currentChatId) return

    // Update active state
    document.querySelectorAll(".chat-item").forEach((item) => {
      item.classList.remove("active")
    })

    const selectedItem = document.querySelector(`[data-chat-id="${chatId}"]`)
    if (selectedItem) {
      selectedItem.classList.add("active")
    }

    // Update current chat
    this.currentChatId = chatId

    // Update chat header
    this.updateChatHeader(chatId)

    // Render messages
    this.renderMessages(chatId)

    // Mark as read
    this.markAsRead(chatId)

    // Close sidebar on mobile
    if (this.isMobile()) {
      document.getElementById("sidebar").classList.remove("open")
    }
  }

  updateChatHeader(chatId) {
    const chat = this.chats.get(chatId)
    if (!chat) return

    const user = chat.user

    // Update avatar
    const avatar = document.querySelector(".contact-avatar")
    if (avatar) {
      avatar.innerHTML = ""
      const avatarEl = this.createAvatar(user, "lg")
      avatar.appendChild(avatarEl.firstChild) // img
      avatar.appendChild(avatarEl.lastChild) // fallback

      if (user.status === "online") {
        const status = document.createElement("div")
        status.className = "online-status"
        avatar.appendChild(status)
      }
    }

    // Update name and status
    const nameEl = document.querySelector(".contact-name")
    if (nameEl) nameEl.textContent = user.name

    const statusEl = document.querySelector(".status-text")
    if (statusEl) {
      statusEl.textContent = user.status === "online" ? "Online" : user.status === "away" ? "Away" : "Offline"
    }

    // Update right sidebar
    this.updateRightSidebar(user)
  }

  updateRightSidebar(user) {
    // Update profile section
    const profileAvatar = document.querySelector(".profile-avatar")
    if (profileAvatar) {
      profileAvatar.innerHTML = ""
      const avatarEl = this.createAvatar(user, "xl")
      profileAvatar.appendChild(avatarEl.firstChild)
      profileAvatar.appendChild(avatarEl.lastChild)

      if (user.status === "online") {
        const status = document.createElement("div")
        status.className = "profile-status online"
        profileAvatar.appendChild(status)
      }
    }

    const profileName = document.querySelector(".profile-name")
    if (profileName) profileName.textContent = user.name

    const profileTitle = document.querySelector(".profile-title")
    if (profileTitle) profileTitle.textContent = user.title || "Team Member"

    // Update contact information
    const infoItems = document.querySelectorAll(".info-item")
    infoItems.forEach((item) => {
      const icon = item.querySelector("i")
      const value = item.querySelector(".info-value")

      if (icon && value) {
        if (icon.classList.contains("fa-envelope")) {
          value.textContent = user.email || "Not available"
        } else if (icon.classList.contains("fa-phone")) {
          value.textContent = user.phone || "Not available"
        } else if (icon.classList.contains("fa-map-marker-alt")) {
          value.textContent = user.location || "Not available"
        }
      }
    })
  }

  updateChatPreview(chatId, message) {
    const chat = this.chats.get(chatId)
    if (!chat) return

    chat.lastMessage = {
      content: message.content,
      timestamp: message.timestamp,
      type: message.type,
    }

    const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`)
    if (chatItem) {
      const preview = chatItem.querySelector(".chat-preview")
      const time = chatItem.querySelector(".chat-time")

      if (preview) {
        const previewText = message.type === "sent" ? `You: ${message.content}` : message.content
        preview.textContent = this.truncateText(previewText, 40)
      }

      if (time) {
        time.textContent = this.formatTime(message.timestamp)
      }
    }
  }

  markAsRead(chatId) {
    const chat = this.chats.get(chatId)
    if (chat && chat.unreadCount > 0) {
      chat.unreadCount = 0

      const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`)
      if (chatItem) {
        const badge = chatItem.querySelector(".unread-badge")
        if (badge) {
          badge.remove()
        }
      }
    }
  }

  showTypingIndicator() {
    const indicator = document.getElementById("typingIndicator")
    if (indicator) {
      indicator.classList.add("show")
      this.scrollToBottom()
    }
  }

  hideTypingIndicator() {
    const indicator = document.getElementById("typingIndicator")
    if (indicator) {
      indicator.classList.remove("show")
    }
  }

  handleTyping() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
    }

    // In a real app, you would send typing status to server here

    this.typingTimeout = setTimeout(() => {
      // Stop typing
    }, 1000)
  }

  updateCharCounter() {
    const messageInput = document.getElementById("messageInput")
    const counter = document.getElementById("charCounter")

    if (messageInput && counter) {
      counter.textContent = messageInput.value.length
    }
  }

  autoResizeTextarea() {
    const textarea = document.getElementById("messageInput")
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
    }
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById("chatMessages")
    if (messagesContainer) {
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }, 100)
    }
  }

  simulateMessageStatus(message) {
    const messageEl = document.querySelector(`[data-message-id="${message.id}"]`)
    if (!messageEl) return

    const statusEl = messageEl.querySelector(".message-status")
    if (!statusEl) return

    // Delivered after 1 second
    setTimeout(() => {
      message.status = "delivered"
      statusEl.innerHTML = this.getStatusIcon("delivered")
    }, 1000)

    // Read after 3 seconds
    setTimeout(() => {
      message.status = "read"
      statusEl.innerHTML = this.getStatusIcon("read")
    }, 3000)
  }

  renderChatList() {
    const chatList = document.getElementById("chatList")
    if (!chatList) return

    chatList.innerHTML = ""

    // Sort chats by last message timestamp
    const sortedChats = Array.from(this.chats.values()).sort(
      (a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp,
    )

    sortedChats.forEach((chat) => {
      const chatItem = this.createChatItem(chat)
      chatList.appendChild(chatItem)
    })
  }

  searchChats(query) {
    const chatItems = document.querySelectorAll(".chat-item")

    chatItems.forEach((item) => {
      const name = item.querySelector(".chat-name").textContent.toLowerCase()
      const preview = item.querySelector(".chat-preview").textContent.toLowerCase()

      if (name.includes(query.toLowerCase()) || preview.includes(query.toLowerCase())) {
        item.style.display = "flex"
      } else {
        item.style.display = "none"
      }
    })
  }

  filterChats(filter) {
    const chatItems = document.querySelectorAll(".chat-item")

    chatItems.forEach((item) => {
      const chatId = item.dataset.chatId
      const chat = this.chats.get(chatId)

      let show = true

      switch (filter) {
        case "unread":
          show = chat && chat.unreadCount > 0
          break
        case "archived":
          show = chat && chat.archived
          break
        case "all":
        default:
          show = true
          break
      }

      item.style.display = show ? "flex" : "none"
    })
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9)
  }

  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..."
    }
    return text
  }

  formatTime(date) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  createMessage(message) {
    const messageEl = document.createElement("div")
    messageEl.className = `message ${message.type}`
    messageEl.dataset.messageId = message.id

    const contentEl = document.createElement("div")
    contentEl.className = "message-content"
    contentEl.textContent = message.content

    const statusEl = document.createElement("div")
    statusEl.className = "message-status"
    statusEl.innerHTML = this.getStatusIcon(message.status)

    messageEl.appendChild(contentEl)
    messageEl.appendChild(statusEl)

    return messageEl
  }

  createAvatar(user, size) {
    const avatarEl = document.createElement("div")
    avatarEl.className = `avatar ${size}`

    const imgEl = document.createElement("img")
    imgEl.src = user.avatar
    imgEl.alt = user.name

    const fallbackEl = document.createElement("div")
    fallbackEl.className = "avatar-fallback"
    fallbackEl.textContent = user.initials

    avatarEl.appendChild(imgEl)
    avatarEl.appendChild(fallbackEl)

    return avatarEl
  }

  createChatItem(chat) {
    const chatItem = document.createElement("div")
    chatItem.className = `chat-item ${chat.active ? "active" : ""}`
    chatItem.dataset.chatId = chat.id

    const avatarEl = this.createAvatar(chat.user, "sm")
    const nameEl = document.createElement("div")
    nameEl.className = "chat-name"
    nameEl.textContent = chat.user.name

    const previewEl = document.createElement("div")
    previewEl.className = "chat-preview"
    previewEl.textContent =
      chat.lastMessage.type === "sent" ? `You: ${chat.lastMessage.content}` : chat.lastMessage.content

    const timeEl = document.createElement("div")
    timeEl.className = "chat-time"
    timeEl.textContent = this.formatTime(chat.lastMessage.timestamp)

    const unreadBadgeEl = document.createElement("div")
    unreadBadgeEl.className = "unread-badge"
    unreadBadgeEl.textContent = chat.unreadCount

    chatItem.appendChild(avatarEl)
    chatItem.appendChild(nameEl)
    chatItem.appendChild(previewEl)
    chatItem.appendChild(timeEl)
    if (chat.unreadCount > 0) {
      chatItem.appendChild(unreadBadgeEl)
    }

    return chatItem
  }

  getStatusIcon(status) {
    switch (status) {
      case "sent":
        return '<i class="fas fa-check"></i>'
      case "delivered":
        return '<i class="fas fa-check-double"></i>'
      case "read":
        return '<i class="fas fa-eye"></i>'
      default:
        return ""
    }
  }

  isMobile() {
    return window.innerWidth < 768
  }
}

// Export for use in other modules
window.ChatManager = ChatManager
