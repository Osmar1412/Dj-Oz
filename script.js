(function(){
    emailjs.init("vY9bUzhQP96Kiag5h");
})();

document.addEventListener("DOMContentLoaded", function () {

    // --- CONFIGURAÇÕES E LOGO ---
    fetch('config.json')
    .then(res => res.json())
    .then(data => {
        const logo = document.getElementById('logo');
        const desc = document.getElementById('descricao');
        if (logo) logo.src = data.logo;
        if (desc) desc.innerText = data.descricao;
    })
    .catch(err => console.error("Erro ao carregar config:", err));

    // --- LINK DO PAINEL ADMIN CONDICIONAL ---
    const adminWrapper = document.getElementById('admin-link-wrapper');
    if (adminWrapper && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        adminWrapper.style.display = 'inline';
    }

    // --- DIRECIONAMENTO DO BOTÃO CONTRATAR AGORA (Bypass de Cache) ---
    const contratarBtn = document.getElementById('contratar-btn');
    if (contratarBtn) {
        contratarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const contatoSec = document.getElementById('contato');
            if (contatoSec) {
                const yOffset = -90; // Compensa a altura do menu sticky
                const y = contatoSec.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    }

    // --- ANIMAÇÃO DE REVELAÇÃO (INTERSECTION OBSERVER) ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-section').forEach(section => {
        observer.observe(section);
    });

    // --- NAVEGAÇÃO DINÂMICA NO SCROLL ---
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- FORMULÁRIO DE CONTATO ---
    const form = document.getElementById("formDJ");
    const status = document.getElementById("statusEnvio");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            status.innerText = "📨 Enviando sua proposta...";
            status.style.color = "var(--primary-color)";
            
            emailjs.sendForm("service_5fpydfh", "template_esjbqjl", form)
            .then(() => emailjs.sendForm("service_5fpydfh", "template_2qmhd1v", form))
            .then(() => { 
                status.innerText = "✅ Proposta enviada! Em breve entrarei em contato."; 
                status.style.color = "#00ff88";
                form.reset(); 
            })
            .catch(() => { 
                status.innerText = "❌ Erro ao enviar. Tente pelo WhatsApp!"; 
                status.style.color = "#ff4444";
            });
        });
    }

    // --- CARREGAMENTO DE SETS (ESTILO CDJ PRO) ---
    fetch('sets.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('sets-container');
        if (!container) return;

        container.innerHTML = `
            <div class="carrossel-wrapper">
                <button class="seta esquerda" onclick="scrollGaleria('sets-carrossel', -1)">❮</button>
                <div class="carrossel" id="sets-carrossel">
                    ${data.sets.map((set, index) => {
                        // Gera alturas de barras de áudio para o display LCD
                        const waveBars = Array.from({length: 22}, () => Math.floor(Math.random() * 20) + 4);
                        return `
                            <div class="set-card">
                                <div class="cdj-player" id="player-${index}">
                                    <div class="cdj-screen">
                                        <div class="screen-track-info">
                                            <span class="screen-title">${set.titulo}</span>
                                            <span class="screen-bpm">${124 + index * 4} BPM</span>
                                        </div>
                                        <div class="screen-time" id="time-${index}">00:00</div>
                                        <div class="screen-wave">
                                            ${waveBars.map(height => `<div class="wave-bar" style="height: ${height}px;"></div>`).join("")}
                                        </div>
                                    </div>
                                    <div class="cdj-platter" onclick="playCDJ(${index})">
                                        <div class="platter-center">
                                            <div class="platter-indicator"></div>
                                        </div>
                                    </div>
                                    <div class="cdj-controls">
                                        <button class="cdj-btn cue-btn" onclick="cueCDJ(${index})">CUE</button>
                                        <button class="cdj-btn play-btn" id="play-btn-${index}" onclick="playCDJ(${index})">▶</button>
                                    </div>
                                    <audio id="audio-${index}" src="${set.audio}"></audio>
                                </div>
                            </div>
                        `;
                    }).join("")}
                </div>
                <button class="seta direita" onclick="scrollGaleria('sets-carrossel', 1)">❯</button>
            </div>
        `;
    })
    .catch(err => console.error("Erro ao carregar sets:", err));
});

// --- CONTROLES DA CDJ DO DJ OZ ---
window.playCDJ = function(index) {
    const audio = document.getElementById(`audio-${index}`);
    const player = document.getElementById(`player-${index}`);
    const playBtn = document.getElementById(`play-btn-${index}`);
    
    if (!audio) return;

    // Pausar outros players caso estejam tocando
    document.querySelectorAll('audio').forEach((aud) => {
        if (aud.id !== `audio-${index}` && !aud.paused) {
            aud.pause();
            const otherIndex = aud.id.split('-')[1];
            const otherPlayer = document.getElementById(`player-${otherIndex}`);
            const otherPlayBtn = document.getElementById(`play-btn-${otherIndex}`);
            if (otherPlayer) otherPlayer.classList.remove('playing');
            if (otherPlayBtn) otherPlayBtn.innerText = '▶';
        }
    });

    if (audio.paused) {
        audio.play().then(() => {
            player.classList.add('playing');
            playBtn.innerText = '⏸';
        }).catch(err => console.error("Erro ao reproduzir áudio:", err));
    } else {
        audio.pause();
        player.classList.remove('playing');
        playBtn.innerText = '▶';
    }
};

window.cueCDJ = function(index) {
    const audio = document.getElementById(`audio-${index}`);
    const player = document.getElementById(`player-${index}`);
    const playBtn = document.getElementById(`play-btn-${index}`);
    
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    player.classList.remove('playing');
    playBtn.innerText = '▶';
    
    const timeDisplay = document.getElementById(`time-${index}`);
    if (timeDisplay) timeDisplay.innerText = "00:00";
};

// Monitoramento global de progresso para os visores LCD
document.addEventListener('timeupdate', function(e) {
    if (e.target.tagName === 'AUDIO') {
        const id = e.target.id;
        const index = id.split('-')[1];
        const audio = e.target;
        const timeDisplay = document.getElementById(`time-${index}`);
        
        if (timeDisplay) {
            const minutes = Math.floor(audio.currentTime / 60);
            const seconds = Math.floor(audio.currentTime % 60);
            timeDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }
}, true);

// --- FUNÇÕES GLOBAIS DE SCROLL ---
function scrollGaleria(id, dir) {
    const el = document.getElementById(id);
    if (!el) return;
    const card = el.querySelector('.set-card');
    if (card) {
        // Rola exatamente a largura de um card + gap (25px)
        const scrollAmount = card.offsetWidth + 25;
        el.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
    } else {
        const largura = el.offsetWidth / 3;
        el.scrollBy({ left: dir * largura, behavior: "smooth" });
    }
}
