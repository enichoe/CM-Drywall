
        // ==========================================
        // CM DRYWALL - Landing Page JavaScript
        // ==========================================
        
        // Initialize variables first
        const navbar = document.querySelector('.navbar');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeMobileMenu = document.getElementById('closeMobileMenu');
        const mobileLinks = document.querySelectorAll('.mobile-link');
        const chatbotButton = document.getElementById('chatbotButton');
        const chatbotWindow = document.getElementById('chatbotWindow');
        const chatbotMessages = document.getElementById('chatbotMessages');
        const chatInputContainer = document.getElementById('chatInputContainer');
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');
        const chatNotification = document.getElementById('chatNotification');
        const closeChatbot = document.getElementById('closeChatbot');
        
        // Chatbot state
        let chatState = 'initial';
        let userData = {
            name: '',
            service: '',
            location: ''
        };
        
        // Services list for chatbot
        const services = [
            'Ampliaciones',
            'Divisiones',
            'Cielo Raso',
            'Cielo Falso',
            'Cielo en PVC',
            'Departamentos',
            'Electricidad',
            'Pintura',
            'Soldadura'
        ];
        
        // ==========================================
        // Navbar Scroll Effect
        // ==========================================
        
        function handleScroll() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        window.addEventListener('scroll', handleScroll);
        
        // ==========================================
        // Mobile Menu
        // ==========================================
        
        function openMobileMenu() {
            mobileMenu.classList.add('active');
            mobileMenu.setAttribute('aria-hidden', 'false');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        
        function closeMobileMenuFn() {
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-hidden', 'true');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        
        mobileMenuBtn.addEventListener('click', openMobileMenu);
        closeMobileMenu.addEventListener('click', closeMobileMenuFn);
        
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenuFn);
        });
        
        // ==========================================
        // Scroll Reveal Animation
        // ==========================================
        
        function initScrollReveal() {
            const revealElements = document.querySelectorAll('.reveal');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('active');
                        }, index * 100);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            revealElements.forEach(el => observer.observe(el));
        }
        
        // ==========================================
        // Counter Animation
        // ==========================================
        
        function animateCounter(element, target, duration) {
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current) + '+';
            }, 16);
        }
        
        function initCounters() {
            const counters = [
                { id: 'projectCounter', target: 100 },
                { id: 'counterYears', target: 10 },
                { id: 'counterClients', target: 200 }
            ];
            
            counters.forEach(counter => {
                const element = document.getElementById(counter.id);
                if (element) {
                    const observer = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting) {
                            animateCounter(element, counter.target, 2000);
                            observer.disconnect();
                        }
                    });
                    observer.observe(element);
                }
            });
        }
        
        // ==========================================
        // Chatbot Functions
        // ==========================================
        
        function addBotMessage(text, options = null) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message bot';
            
            let html = `<div class="chat-bubble bot">${text}</div>`;
            
            if (options) {
                html += '<div class="chat-options">';
                options.forEach(option => {
                    html += `<button class="chat-option" data-value="${option}">${option}</button>`;
                });
                html += '</div>';
            }
            
            messageDiv.innerHTML = html;
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            // Add event listeners to options
            if (options) {
                messageDiv.querySelectorAll('.chat-option').forEach(btn => {
                    btn.addEventListener('click', () => handleOptionClick(btn.dataset.value));
                });
            }
        }
        
        function addUserMessage(text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message user';
            messageDiv.innerHTML = `<div class="chat-bubble user">${text}</div>`;
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
        
        function handleOptionClick(value) {
            addUserMessage(value);
            
            switch (chatState) {
                case 'initial':
                    if (value === 'Cotizar servicio') {
                        chatState = 'select_service';
                        addBotMessage('Perfecto, cuéntame qué servicio necesitas:', services);
                    } else if (value === 'Ver precios') {
                        addBotMessage('Los precios varían según el proyecto. Te recomiendo hablar con un asesor para una cotización exacta. ¿Deseas que te contacten?');
                        setTimeout(() => {
                            addBotMessage('Mientras tanto, puedes ver nuestros proyectos en la galería o contactarnos directamente por WhatsApp.', ['Hablar con asesor', 'Ver galería']);
                        }, 500);
                    } else if (value === 'Hablar con asesor') {
                        redirectToWhatsApp('Hola, quiero hablar con un asesor');
                    }
                    break;
                    
                case 'select_service':
                    userData.service = value;
                    chatState = 'get_name';
                    addBotMessage(`Excelente elección. ${value} es uno de nuestros servicios más solicitados. ¿Cuál es tu nombre?`);
                    chatInputContainer.style.display = 'flex';
                    chatInput.focus();
                    break;
                    
                case 'get_location':
                    userData.location = value;
                    chatState = 'complete';
                    finalizeChat();
                    break;
            }
        }
        
        function handleUserInput() {
            const value = chatInput.value.trim();
            if (!value) return;
            
            addUserMessage(value);
            chatInput.value = '';
            
            if (chatState === 'get_name') {
                userData.name = value;
                chatState = 'get_location';
                addBotMessage(`Mucho gusto, ${value}. ¿En qué distrito o zona estás ubicado?`);
            } else if (chatState === 'get_location') {
                userData.location = value;
                chatState = 'complete';
                finalizeChat();
            }
        }
        
        function finalizeChat() {
            chatInputContainer.style.display = 'none';
            addBotMessage(`Perfecto, ${userData.name}. Te derivaré con un asesor que te ayudará con tu proyecto de ${userData.service} en ${userData.location}.`);
            
            setTimeout(() => {
                const message = `Hola, soy ${userData.name}. Necesito ${userData.service} en ${userData.location}. Me gustaría recibir una cotización.`;
                redirectToWhatsApp(message);
            }, 1500);
        }
        
        function redirectToWhatsApp(message) {
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/51952466176?text=${encodedMessage}`, '_blank');
        }
        
        function startChat() {
            chatNotification.style.display = 'none';
            addBotMessage('Hola, soy el asistente virtual de CM Drywall. ¿En qué podemos ayudarte?', [
                'Cotizar servicio',
                'Ver precios',
                'Hablar con asesor'
            ]);
        }
        
        // Chatbot toggle
        let chatOpened = false;
        
        chatbotButton.addEventListener('click', () => {
            const isOpen = chatbotWindow.classList.contains('active');
            
            if (isOpen) {
                chatbotWindow.classList.remove('active');
                chatbotWindow.setAttribute('aria-hidden', 'true');
            } else {
                chatbotWindow.classList.add('active');
                chatbotWindow.setAttribute('aria-hidden', 'false');
                
                if (!chatOpened) {
                    chatOpened = true;
                    setTimeout(startChat, 500);
                }
                
                // Prevent scrolling on mobile when chat is open
                if (window.innerWidth <= 640) {
                    document.body.style.overflow = 'hidden';
                }
            }
        });
        
        // Close chatbot handler
        closeChatbot.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbotWindow.classList.remove('active');
            chatbotWindow.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
        
        // Chat input handlers
        chatSend.addEventListener('click', handleUserInput);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserInput();
            }
        });
        
        // Auto-open chatbot after delay
        setTimeout(() => {
            if (!chatOpened) {
                chatNotification.style.display = 'flex';
            }
        }, 5000);
        
        // ==========================================
        // Smooth Scroll for Anchor Links
        // ==========================================
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // ==========================================
        // Initialize Everything
        // ==========================================
        
        document.addEventListener('DOMContentLoaded', () => {
            initScrollReveal();
            initCounters();
        });
        
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.querySelectorAll('.animate-fade-in-up, .animate-fade-in-scale, .animate-slide-in-right, .animate-pulse-glow, .animate-float, .animate-bounce, .animate-pulse').forEach(el => {
                el.style.animation = 'none';
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        }
    