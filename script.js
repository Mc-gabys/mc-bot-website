document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  if (!body.classList.contains('page-transition')) {
    body.classList.add('page-transition');
  }

  const playEnter = () => {
    body.classList.remove('fade-exit');
    body.classList.add('fade-enter');
    setTimeout(() => body.classList.remove('fade-enter'), 600);
  };
  playEnter();
  window.addEventListener('pageshow', (evt) => {
    playEnter();
  });

  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  document.querySelectorAll('a[href]').forEach(a => {
    if (a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
    if (a.hasAttribute('download')) return;
    if (a.dataset.noTransition !== undefined) return;

    try {
      const url = new URL(a.href, location.href);
      const isSameOrigin = url.origin === location.origin;
      const isSamePathAndHash = isSameOrigin && url.pathname === location.pathname && url.hash;
      if (isSamePathAndHash) {
        return;
      }
    } catch (e) {
      return;
    }

    a.addEventListener('click', (ev) => {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;

      ev.preventDefault();
      const destination = a.href;

      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }

      body.classList.remove('fade-enter');
      body.classList.add('fade-exit');

      const onAnimEnd = (e) => {
        if (e.animationName === 'pageFadeOut') {
          body.removeEventListener('animationend', onAnimEnd);
          location.href = destination;
        }
      };
      body.addEventListener('animationend', onAnimEnd);

      setTimeout(() => {
        location.href = destination;
      }, 800);
    });
  });

  const sections = document.querySelectorAll('.fade-in-section');

  if (sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, {
      threshold: 0.1
    });

    sections.forEach(section => {
      observer.observe(section);
    });
  }
});

const typingText = document.getElementById('typing-text');
        const words = ["améliorer", "protéger", "modérer"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                setTimeout(() => isDeleting = true, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
            
            const typingSpeed = isDeleting ? 100 : 200;
            setTimeout(type, typingSpeed);
        }
        
        document.addEventListener('DOMContentLoaded', type);