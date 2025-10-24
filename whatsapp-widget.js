/**
 * WhatsApp Chat Widget - Standalone JavaScript
 * A complete WhatsApp chat widget that can be embedded on any website
 * 
 * Usage:
 * 1. Include this script in your HTML: <script src="whatsapp-widget.js"></script>
 * 2. Add the CSS styles to your page
 * 3. Add the HTML structure to your page
 * 
 * Customization:
 * - Change phone number: WhatsAppWidget.config.phoneNumber = '+1234567890';
 * - Change profile name: WhatsAppWidget.config.profileName = 'Your Name';
 * - Change profile image: WhatsAppWidget.config.profileImage = 'your-image-url';
 * - Change welcome message: WhatsAppWidget.config.welcomeMessage = 'Your message';
 */

(function() {
    'use strict';

    // WhatsApp Widget Configuration
    window.WhatsAppWidget = window.WhatsAppWidget || {};
    
    // Get current time in HH:MM format (24-hour format)
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    window.WhatsAppWidget.config = {
        phoneNumber: '+923124500050',
        profileName: 'Speech Therapy Solutions',
        profileImage: 'avatar1.jpg',
        welcomeMessage: 'How can I help you? :)',
        timestamp: getCurrentTime(),
        activateText: 'Activate Windows<br>Go to Settings to activate Windows'
    };

    // WhatsApp Widget Class
    class WhatsAppWidgetCore {
        constructor(config = {}) {
            // Merge default config with user config
            this.config = { ...window.WhatsAppWidget.config, ...config };
            this.phoneNumber = this.config.phoneNumber;
            this.isOpen = false;
            this.isInitialized = false;
        }

        // Initialize the widget
        init() {
            if (this.isInitialized) return;
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        }

        // Setup the widget
        setup() {
            this.injectHTML();
            this.injectCSS();
            this.bindEvents();
            this.hideNotificationAfterDelay();
            this.addInteractiveEffects();
            this.isInitialized = true;
        }

        // Inject HTML structure
        injectHTML() {
            // Check if widget already exists
            if (document.querySelector('.whatsapp-widget')) return;

            const widgetHTML = `
                <div class="whatsapp-widget">
                    <!-- Floating WhatsApp Button -->
                    <div class="whatsapp-float" id="whatsapp-float">
                        <svg viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        <div class="notification-badge">1</div>
                    </div>

                    <!-- Chat Interface -->
                    <div class="whatsapp-chat" id="whatsapp-chat">
                        <!-- Chat Header -->
                        <div class="chat-header">
                            <img src="${this.config.profileImage}" alt="${this.config.profileName}" class="profile-pic">
                            <div class="profile-info">
                                <div class="profile-name">${this.config.profileName}</div>
                                <div class="profile-status">
                                    <div class="status-dot"></div>
                                    Online
                                </div>
                            </div>
                            <button class="close-btn" id="close-chat">&times;</button>
                        </div>

                        <!-- Chat Body -->
                        <div class="chat-body">
                            <div class="message-time">${this.config.timestamp}</div>
                            <div class="message incoming">
                                ${this.config.welcomeMessage}
                            </div>
                        </div>

                        <!-- Chat Input -->
                        <div class="chat-input">
                            <input type="text" class="message-input" id="message-input" placeholder="Enter Your Message...">
                            <button class="send-btn" id="send-btn">
                                <svg viewBox="0 0 24 24">
                                    <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                                </svg>
                            </button>
                        </div>

                        <!-- Activate Text -->
                        <div class="activate-text">
                            ${this.config.activateText}
                        </div>
                    </div>
                </div>
            `;

            // Append to body
            document.body.insertAdjacentHTML('beforeend', widgetHTML);
        }

        // Inject CSS styles
        injectCSS() {
            // Check if styles already exist
            if (document.querySelector('#whatsapp-widget-styles')) return;

            const css = `
                /* WhatsApp Widget Styles */
                .whatsapp-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                }

                .whatsapp-float {
                    width: 60px;
                    height: 60px;
                    background: #25d366;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
                    transition: all 0.3s ease;
                    position: relative;
                    animation: whatsapp-float 3s ease-in-out infinite;
                }

                .whatsapp-float:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
                    animation: none;
                }

                .whatsapp-float svg {
                    width: 32px;
                    height: 32px;
                    fill: white;
                }

                .notification-badge {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 20px;
                    height: 20px;
                    background: #ff3333;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    color: white;
                    font-weight: bold;
                }

                .whatsapp-chat {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 350px;
                    max-width: calc(100vw - 40px);
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(20px) scale(0.95);
                    transition: all 0.3s ease;
                    overflow: hidden;
                }

                .whatsapp-chat.active {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0) scale(1);
                }

                .chat-header {
                    background: #128c7e;
                    color: white;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    position: relative;
                }

                .profile-pic {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin-right: 12px;
                    object-fit: cover;
                }

                .profile-info {
                    flex: 1;
                }

                .profile-name {
                    font-weight: 600;
                    font-size: 16px;
                    margin-bottom: 2px;
                }

                .profile-status {
                    font-size: 13px;
                    opacity: 0.9;
                    display: flex;
                    align-items: center;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #4fc3f7;
                    border-radius: 50%;
                    margin-right: 6px;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background 0.2s ease;
                }

                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .chat-body {
                    height: 300px;
                    background: #e5ddd5;
                    background-image: 
                        radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2%, transparent 2%),
                        radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2%, transparent 2%);
                    background-size: 100px 100px;
                    padding: 16px;
                    overflow-y: auto;
                    position: relative;
                }

                .chat-body::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
                    pointer-events: none;
                }

                .message-time {
                    text-align: center;
                    color: #999;
                    font-size: 12px;
                    margin-bottom: 16px;
                }

                .message {
                    max-width: 80%;
                    margin-bottom: 12px;
                    position: relative;
                }

                .message.incoming {
                    background: white;
                    padding: 8px 12px;
                    border-radius: 18px 18px 18px 4px;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    font-size: 14px;
                    line-height: 1.4;
                    color: #333;
                }

                .message.incoming::before {
                    content: '';
                    position: absolute;
                    left: -6px;
                    bottom: 0;
                    width: 0;
                    height: 0;
                    border: 6px solid transparent;
                    border-right-color: white;
                    border-left: 0;
                    border-bottom: 0;
                }

                .chat-input {
                    padding: 12px 16px;
                    background: #f0f0f0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .message-input {
                    flex: 1;
                    border: none;
                    background: white;
                    padding: 12px 16px;
                    border-radius: 24px;
                    font-size: 14px;
                    outline: none;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                }

                .message-input::placeholder {
                    color: #999;
                }

                .send-btn {
                    width: 40px;
                    height: 40px;
                    background: #25d366;
                    border: none;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .send-btn:hover {
                    background: #128c7e;
                    transform: scale(1.05);
                }

                .send-btn svg {
                    width: 20px;
                    height: 20px;
                    fill: white;
                }

                .activate-text {
                    text-align: center;
                    padding: 16px;
                    color: #999;
                    font-size: 13px;
                    background: #f8f8f8;
                    border-top: 1px solid #eee;
                }

                /* Responsive Design */
                @media (max-width: 480px) {
                    .whatsapp-chat {
                        width: calc(100vw - 20px);
                        right: 10px;
                        bottom: 90px;
                    }

                    .whatsapp-float {
                        width: 56px;
                        height: 56px;
                        bottom: 15px;
                        right: 15px;
                    }

                    .whatsapp-float svg {
                        width: 28px;
                        height: 28px;
                    }

                    .chat-body {
                        height: 250px;
                    }
                }

                /* Animation for floating effect */
                @keyframes whatsapp-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                /* Ripple animation */
                @keyframes whatsapp-ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;

            const style = document.createElement('style');
            style.id = 'whatsapp-widget-styles';
            style.textContent = css;
            document.head.appendChild(style);
        }

        // Bind event listeners
        bindEvents() {
            const floatBtn = document.getElementById('whatsapp-float');
            const closeBtn = document.getElementById('close-chat');
            const sendBtn = document.getElementById('send-btn');
            const messageInput = document.getElementById('message-input');

            if (!floatBtn || !closeBtn || !sendBtn || !messageInput) return;

            // Toggle chat on float button click
            floatBtn.addEventListener('click', () => this.toggleChat());

            // Close chat on close button click
            closeBtn.addEventListener('click', () => this.closeChat());

            // Send message on send button click
            sendBtn.addEventListener('click', () => this.sendMessage());

            // Send message on Enter key press
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            // Close chat when clicking outside
            document.addEventListener('click', (e) => {
                const widget = document.querySelector('.whatsapp-widget');
                if (widget && !widget.contains(e.target) && this.isOpen) {
                    this.closeChat();
                }
            });
        }

        // Toggle chat visibility
        toggleChat() {
            const chat = document.getElementById('whatsapp-chat');
            const notification = document.querySelector('.notification-badge');
            
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
                // Hide notification badge when chat is opened
                if (notification) {
                    notification.style.display = 'none';
                }
            }
        }

        // Open chat
        openChat() {
            const chat = document.getElementById('whatsapp-chat');
            if (chat) {
                chat.classList.add('active');
                this.isOpen = true;
                
                // Focus on input field
                setTimeout(() => {
                    const input = document.getElementById('message-input');
                    if (input) input.focus();
                }, 300);
            }
        }

        // Close chat
        closeChat() {
            const chat = document.getElementById('whatsapp-chat');
            if (chat) {
                chat.classList.remove('active');
                this.isOpen = false;
                
                // Clear input field
                const input = document.getElementById('message-input');
                if (input) input.value = '';
            }
        }

        // Send message to WhatsApp
        sendMessage() {
            const messageInput = document.getElementById('message-input');
            if (!messageInput) return;

            const message = messageInput.value.trim();
            
            // Create WhatsApp URL
            let whatsappUrl = `https://wa.me/${this.phoneNumber}`;
            
            if (message) {
                // URL encode the message
                const encodedMessage = encodeURIComponent(message);
                whatsappUrl += `?text=${encodedMessage}`;
            }
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            // Clear input and close chat
            messageInput.value = '';
            this.closeChat();
        }

        // Hide notification badge after delay
        hideNotificationAfterDelay() {
            setTimeout(() => {
                const notification = document.querySelector('.notification-badge');
                if (notification && !this.isOpen) {
                    notification.style.opacity = '0';
                    setTimeout(() => {
                        notification.style.display = 'none';
                    }, 300);
                }
            }, 10000);
        }

        // Add interactive effects
        addInteractiveEffects() {
            const buttons = document.querySelectorAll('.whatsapp-float, .send-btn');
            
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.cssText = `
                        position: absolute;
                        width: ${size}px;
                        height: ${size}px;
                        left: ${x}px;
                        top: ${y}px;
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        transform: scale(0);
                        animation: whatsapp-ripple 0.6s linear;
                        pointer-events: none;
                    `;
                    
                    this.style.position = 'relative';
                    this.style.overflow = 'hidden';
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            });
        }

        // Public method to update configuration
        updateConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            this.phoneNumber = this.config.phoneNumber;
            
            // Update existing elements if widget is already initialized
            if (this.isInitialized) {
                const profileName = document.querySelector('.profile-name');
                const profilePic = document.querySelector('.profile-pic');
                const welcomeMessage = document.querySelector('.message.incoming');
                const timestamp = document.querySelector('.message-time');
                const activateText = document.querySelector('.activate-text');

                if (profileName) profileName.textContent = this.config.profileName;
                if (profilePic) {
                    profilePic.src = this.config.profileImage;
                    profilePic.alt = this.config.profileName;
                }
                if (welcomeMessage) welcomeMessage.innerHTML = this.config.welcomeMessage;
                if (timestamp) timestamp.textContent = this.config.timestamp;
                if (activateText) activateText.innerHTML = this.config.activateText;
            }
        }
    }

    // Initialize widget automatically
    const widget = new WhatsAppWidgetCore();
    widget.init();

    // Expose widget instance globally for customization
    window.WhatsAppWidget.instance = widget;

    // Expose configuration update method
    window.WhatsAppWidget.updateConfig = function(config) {
        widget.updateConfig(config);
    };

    // Expose control methods
    window.WhatsAppWidget.open = function() {
        widget.openChat();
    };

    window.WhatsAppWidget.close = function() {
        widget.closeChat();
    };

    window.WhatsAppWidget.toggle = function() {
        widget.toggleChat();
    };

})();