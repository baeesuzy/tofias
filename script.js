// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Cart functionality
let cartCount = 0;
let cartItems = [];
const cartCountElement = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        const productImage = productCard.querySelector('img').src;

        // Add item to cart
        cartItems.push({
            name: productName,
            price: productPrice,
            image: productImage
        });
        
        cartCount++;
        cartCountElement.textContent = cartCount;
        
        // Add animation to cart icon
        const cartIcon = document.querySelector('.cart-icon');
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);

        // Show success message
        showNotification(`${productName} added to cart!`);
    });
});

// Cart Modal
const createCartModal = () => {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
        <div class="cart-modal-content">
            <span class="close-cart">&times;</span>
            <h2>Your Cart</h2>
            <div class="cart-items"></div>
            <div class="cart-total">
                <h3>Total: <span>₱0.00</span></h3>
            </div>
            <button class="checkout-facebook">
                <i class="fab fa-facebook"></i> Order via Facebook
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
};

// Show notification
const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
};

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart-icon');
    let cartModal = null;

    // Create cart modal
    cartModal = createCartModal();
    const cartItemsContainer = cartModal.querySelector('.cart-items');
    const closeCartButton = cartModal.querySelector('.close-cart');
    const checkoutButton = cartModal.querySelector('.checkout-facebook');

    // Open cart modal
    cartIcon.addEventListener('click', () => {
        updateCartModal();
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close cart modal
    closeCartButton.addEventListener('click', () => {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close cart modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Update cart modal content
    const updateCartModal = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cartItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price}</p>
                </div>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);

            // Add price to total
            total += parseFloat(item.price.replace('₱', ''));
        });

        // Update total
        cartModal.querySelector('.cart-total span').textContent = `₱${total.toFixed(2)}`;

        // Add remove functionality
        cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.dataset.index;
                cartItems.splice(index, 1);
                cartCount--;
                cartCountElement.textContent = cartCount;
                updateCartModal();
            });
        });
    };

    // Handle Facebook checkout
    checkoutButton.addEventListener('click', () => {
        if (cartItems.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }

        // Create order summary
        const orderSummary = cartItems.map(item => 
            `${item.name} - ${item.price}`
        ).join('\n');

        // Create Facebook message
        const message = `Hello! I would like to place an order:\n\n${orderSummary}\n\nTotal: ${cartModal.querySelector('.cart-total span').textContent}`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Open Facebook profile with message
        window.open(`https://www.facebook.com/profile.php?id=61575568994314&text=${encodedMessage}`, '_blank');
        
        // Clear cart
        cartItems = [];
        cartCount = 0;
        cartCountElement.textContent = '0';
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
        showNotification('Order sent to Facebook!');
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements when they come into view
document.querySelectorAll('.product-card, .about-content, .contact-form').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
});

// Form submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
});

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navWrapper = document.querySelector('.nav-wrapper');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navWrapper.classList.toggle('active');
        document.body.style.overflow = navWrapper.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navWrapper.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navWrapper.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navWrapper.classList.contains('active') && 
            !navWrapper.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navWrapper.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Carousel functionality
const carousel = {
    slides: document.querySelectorAll('.carousel-slide'),
    indicators: document.querySelectorAll('.indicator'),
    currentSlide: 0,
    interval: null,

    init() {
        // Start automatic slideshow
        this.startSlideshow();
        
        // Add click event listeners to indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
    },

    startSlideshow() {
        this.interval = setInterval(() => {
            this.nextSlide();
        }, 3000);
    },

    stopSlideshow() {
        clearInterval(this.interval);
    },

    nextSlide() {
        this.goToSlide((this.currentSlide + 1) % this.slides.length);
    },

    goToSlide(index) {
        // Remove active class from current slide and indicator
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');
        
        // Update current slide index
        this.currentSlide = index;
        
        // Add active class to new slide and indicator
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
    }
};

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    carousel.init();
});

// Product Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all product images and modals
    const productImages = document.querySelectorAll('.product-image');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Add click event to product images
    productImages.forEach((image, index) => {
        image.addEventListener('click', () => {
            const modalId = index === 0 ? 'tofuModal' : 'milkfishModal';
            const modal = document.getElementById(modalId);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    });

    // Close modal when clicking the close button
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    });

    // Close modal when clicking outside the modal content
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    });

    // Close modal when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
        }
    });
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}); 