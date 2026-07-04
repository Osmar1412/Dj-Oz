document.addEventListener("DOMContentLoaded", function () {

    // --- CARREGAR LOGO ---
    fetch('config.json')
    .then(res => res.json())
    .then(data => {
        const logo = document.getElementById('logo');
        if (logo && data.logo) logo.src = data.logo;
    })
    .catch(err => console.error("Erro ao carregar logo:", err));

    // --- GERADOR DE FOTOS ---
    function gerarFotos(cfg) {
        if (!cfg || !cfg.quantidade) return [];
        const lista = [];
        for (let i = 1; i <= cfg.quantidade; i++) {
            const num = String(i).padStart(2, '0');
            lista.push(`${cfg.pasta}${cfg.prefixo}${num}.${cfg.ext}`);
        }
        return lista;
    }

    // --- OBTER TODAS AS MÍDIAS DO EVENTO ---
    window.getEventMedia = function(event) {
        let fotos = [];
        if (Array.isArray(event.fotos)) {
            fotos = event.fotos;
        } else if (typeof event.fotos === 'object') {
            fotos = gerarFotos(event.fotos);
        }
        const videos = Array.isArray(event.videos) ? event.videos : [];
        return [...fotos, ...videos];
    };

    // --- CARREGAR EVENTOS ---
    fetch('eventos.json?v=1.0.1')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('eventos-container');
        if (!container || !data.eventos) return;

        window.eventsData = data.eventos; // Salva globalmente para o Lightbox
        container.innerHTML = "";

        data.eventos.forEach((ev, eventIdx) => {
            const midias = getEventMedia(ev);

            const bloco = document.createElement("div");
            bloco.classList.add("evento");
            bloco.innerHTML = `
                <div class="evento-header">
                    <h3>${ev.titulo}</h3>
                    <span>${ev.data}</span>
                </div>
                <div class="eventos-grid">
                    ${midias.map((m, mediaIdx) => {
                        const isVideo = /\.(mp4|webm)$/i.test(m);
                        return `
                            <div class="midia-card" onclick="openLightbox(${eventIdx}, ${mediaIdx})">
                                ${isVideo ? `
                                    <video src="${m}" muted loop></video>
                                    <div class="video-overlay-icon">▶</div>
                                ` : `
                                    <img src="${m}" alt="${ev.titulo}" loading="lazy">
                                `}
                            </div>
                        `;
                    }).join("")}
                </div>
            `;
            container.appendChild(bloco);
        });
    })
    .catch(err => console.error("Erro ao carregar eventos:", err));

    // --- CONTROLES DE LIGHTBOX ---
    let currentEventIndex = 0;
    let currentMediaIndex = 0;

    window.openLightbox = function(eventIdx, mediaIdx) {
        currentEventIndex = eventIdx;
        currentMediaIndex = mediaIdx;
        updateLightbox();
        
        const lightbox = document.getElementById('lightbox-modal');
        if (lightbox) {
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('active'), 10);
        }
    };

    window.closeLightbox = function() {
        const lightbox = document.getElementById('lightbox-modal');
        if (lightbox) {
            lightbox.classList.remove('active');
            const video = lightbox.querySelector('video');
            if (video) video.pause();
            setTimeout(() => lightbox.style.display = 'none', 300);
        }
    };

    window.changeLightboxMedia = function(dir) {
        if (!window.eventsData) return;
        const event = window.eventsData[currentEventIndex];
        const midias = getEventMedia(event);
        
        currentMediaIndex += dir;
        if (currentMediaIndex < 0) currentMediaIndex = midias.length - 1;
        if (currentMediaIndex >= midias.length) currentMediaIndex = 0;
        
        updateLightbox();
    };

    function updateLightbox() {
        const container = document.getElementById('lightbox-media-container');
        if (!container || !window.eventsData) return;

        const event = window.eventsData[currentEventIndex];
        const midias = getEventMedia(event);
        const mediaSrc = midias[currentMediaIndex];
        
        const isVideo = /\.(mp4|webm)$/i.test(mediaSrc);
        if (isVideo) {
            container.innerHTML = `<video src="${mediaSrc}" controls autoplay></video>`;
        } else {
            container.innerHTML = `<img src="${mediaSrc}" alt="Galeria ampliada">`;
        }
    }

    // Suporte a teclado no Lightbox (Esc, Setas)
    document.addEventListener('keydown', function(e) {
        const lightbox = document.getElementById('lightbox-modal');
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeLightboxMedia(-1);
            if (e.key === 'ArrowRight') changeLightboxMedia(1);
        }
    });
});
