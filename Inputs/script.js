
    (() => {
      'use strict';
      // Contact configuration enhances the ordinary HTML links. Blank values keep the HTML link.
      try {
        const profile = JSON.parse(document.getElementById('profile-details').textContent);
        const labels = { universityProfile: 'Academic profile', chtaProfile: 'CHTA profile', orcid: 'ORCID profile', linkedIn: 'LinkedIn profile', github: 'LCMicrosim repository', googleScholar: 'Google Scholar profile' };
        document.querySelectorAll('[data-contact]').forEach(container => {
          const key = container.dataset.contact;
          const value = typeof profile[key] === 'string' ? profile[key].trim() : '';
          if (!value) return;
          const link = document.createElement('a');
          if (key === 'email') {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return;
            link.href = 'mailto:' + encodeURIComponent(value).replace(/%40/gi, '@');
            link.textContent = value;
          } else {
            let url;
            try { url = new URL(value); } catch (error) { return; }
            if (url.protocol !== 'https:') return;
            link.href = url.href;
            link.textContent = labels[key] + ' ↗';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
          }
          container.replaceChildren(link);
        });
      } catch (error) {
        // The page remains readable if the optional configuration is incomplete.
      }

      const citations = {
        "smoking": "Di Silvestre J, Salgado MV, Jeon J, Mok Y, Holford TR, Vedøy TF, Pedersen K, Burger EA, Meza R. Age- and sex-specific smoking trends by birth cohort in Norway, 1978–2024: an analysis of cross-sectional survey data. The Lancet Regional Health – Europe. 2026;71:101886. https://doi.org/10.1016/j.lanepe.2026.101886",
        "cervical": "Pedersen K, Di Silvestre J, Sy S, Portnoy A, Castle PE, Kim JJ, Burger EA. Optimizing Cervical Cancer Screening by Age at Vaccination for Human Papillomavirus: Health and Resource Implications. Annals of Internal Medicine. 2026;179(4):497–505. https://doi.org/10.7326/ANNALS-25-03192"
      };
      document.querySelectorAll('.copy-button[data-citation]').forEach(copyButton => {
        const citation = citations[copyButton.dataset.citation];
        if (!citation) return;
        const article = copyButton.closest('.publication');
        const copyLabel = copyButton.querySelector('span');
        const copyStatus = article.querySelector('[role="status"]');
        const fallback = article.querySelector('.citation-fallback');
        const field = fallback.querySelector('textarea');
        let resetCopy;
        copyButton.hidden = false;
        copyButton.addEventListener('click', async () => {
          clearTimeout(resetCopy);
          try {
            if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
            await navigator.clipboard.writeText(citation);
            copyLabel.textContent = 'Citation copied';
            copyStatus.textContent = 'Citation copied to clipboard.';
            fallback.hidden = true;
          } catch (error) {
            fallback.hidden = false;
            field.value = citation;
            field.focus();
            field.select();
            copyStatus.textContent = 'Citation selected below. Use your device’s copy command.';
          }
          resetCopy = setTimeout(() => { copyLabel.textContent = 'Copy citation'; }, 2500);
        });
      });

      if ('IntersectionObserver' in window) {
        const navLinks = [...document.querySelectorAll('.nav a')];
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => {
              if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
              else link.removeAttribute('aria-current');
            });
          });
        }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
        document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
      }
    })();
  