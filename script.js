document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       Mobile Menu Toggle
       ========================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-links a');
    const icon = mobileMenuBtn.querySelector('i');

    function toggleMenu() {
        mobileMenuOverlay.classList.toggle('active');
        if (mobileMenuOverlay.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuOverlay.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================
       Navbar Scroll Effect
       ========================================== */
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================
       Smooth Scrolling for Anchor Links
       ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust for navbar height
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================
       Scroll Reveal Animation
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Trigger check on load for elements already in viewport
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    /* ==========================================
       Application Modal & n8n Form Submission
       ========================================== */
    const modal = document.getElementById('applicationModal');
    const openModalBtns = document.querySelectorAll('a[href="#apply"]');
    const closeModalBtn = document.querySelector('.close-modal');
    const applyForm = document.getElementById('applyForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');

    // Using Formsubmit to send the form directly to business@karostartup.com
    const WEBHOOK_URL = 'https://formsubmit.co/ajax/business@karostartup.com';

    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Reset form after closing
        setTimeout(() => {
            applyForm.reset();
            formMessage.style.display = 'none';
            formMessage.className = 'form-message';
        }, 400); // Wait for transition out
    }

    // Attach click events to all "Apply Now" buttons
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    // Close modal via (X) button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal by clicking outside the modal content window
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    if (applyForm) {
        applyForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Reset Message
            formMessage.style.display = 'none';
            formMessage.className = 'form-message';

            // Set loading state
            submitBtn.classList.add('loading');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';

            // Gather Data
            const formData = new FormData(applyForm);
            const payload = {
                founderName: formData.get('founderName'),
                startupName: formData.get('startupName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                pitchDeckLink: formData.get('pitchDeck'),
                submissionDate: new Date().toISOString()
            };

            try {
                // Send to Formsubmit
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    // Success
                    applyForm.reset();
                    formMessage.textContent = 'Application submitted successfully! We will be in touch soon.';
                    formMessage.className = 'form-message success';
                } else {
                    throw new Error('Network response was not ok.');
                }
            } catch (error) {
                // Error handling
                console.error('Error submitting form:', error);

                formMessage.innerHTML = 'There was an issue submitting your form. Please try again later.';
                formMessage.className = 'form-message error';
            } finally {
                // Remove loading state
                submitBtn.classList.remove('loading');
                submitBtn.innerText = originalBtnText;
            }
        });
    }

});
