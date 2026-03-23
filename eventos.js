document.addEventListener("DOMContentLoaded", function () {

    // ============================
    // LOGO
    // ============================
    fetch('config.json')
    .then(res => res.json())
    .then(data => {
        const logo = document.getElementById('logo');
        if (logo && data.logo) logo.src = data.logo;
    })
    .catch(() => console.warn("Erro ao carregar logo"));



    // ============================
    // GERAR FOTOS AUTOMÁTICAS
    // ============================
    function gerarFotos(cfg) {
        if (!cfg || !cfg.quantidade) return [];

        const lista = [];

        for (let i = 1; i <= cfg.quantidade; i++) {
            const num = String(i).padStart(2, '0');
            lista.push(`${cfg.pasta}${cfg.prefixo}${num}.${cfg.ext}`);
        }

        return lista;
    }



    // ============================
    // RENDER MIDIA
    // ============================
    function renderMidia(src, titulo) {

        if (!src) return "";

        // imagem
        if (/\.(jpg|jpeg|png|webp)$/i.test(src)) {
            return `<img src="${src}" alt="${titulo}" loading="lazy">`;
        }

        // vídeo local
        if (/\.(mp4|webm)$/i.test(src)) {
            return `
                <video controls>
                    <source src="${src}" type="video/mp4">
                </video>
            `;
        }

        // iframe
        return `<iframe src="${src}" loading="lazy" allowfullscreen></iframe>`;
    }



    // ============================
    // EVENTOS
    // ============================
    fetch('eventos.json')
    .then(res => res.json())
    .then(data => {

        console.log("Eventos carregados:", data); // DEBUG

        const container = document.getElementById('eventos-container');
        if (!container) return;

        if (!data.eventos || !Array.isArray(data.eventos)) {
            container.innerHTML = "<p>Erro no formato do JSON.</p>";
            return;
        }

        if (data.eventos.length === 0) {
            container.innerHTML = "<p>Nenhum evento encontrado.</p>";
            return;
        }

        container.innerHTML = "";

        data.eventos.forEach((ev, index) => {

            // fotos
            let fotos = [];

            if (Array.isArray(ev.fotos)) {
                fotos = ev.fotos;
            } else if (typeof ev.fotos === "object") {
                fotos = gerarFotos(ev.fotos);
            }

            // videos
            const videos = Array.isArray(ev.videos) ? ev.videos : [];

            const midias = [...fotos, ...videos];

            const bloco = document.createElement("div");
            bloco.classList.add("evento");

            bloco.innerHTML = `
                <h3 onclick="toggle(this)">
                    ${ev.titulo} - ${ev.data}
                </h3>

                <div class="conteudo">
                    <div class="carrossel-wrapper">

                        <button class="seta esquerda"
                            onclick="scrollGaleria('evento-${index}', -1)">❮</button>

                        <div class="carrossel" id="evento-${index}">
                            ${midias.map(m => renderMidia(m, ev.titulo)).join("")}
                        </div>

                        <button class="seta direita"
                            onclick="scrollGaleria('evento-${index}', 1)">❯</button>

                    </div>
                </div>
            `;

            container.appendChild(bloco);
        });

    })
    .catch(err => {
        console.error("Erro real:", err);

        const container = document.getElementById('eventos-container');
        if (container) {
            container.innerHTML = "<p>Erro ao carregar eventos.</p>";
        }
    });

});



// ============================
// TOGGLE GLOBAL
// ============================
function toggle(el) {
    const c = el.nextElementSibling;
    if (!c) return;

    c.style.display = c.style.display === "block" ? "none" : "block";
}

function toggleSection(el) {
    const c = el.nextElementSibling;
    if (!c) return;

    c.style.display = c.style.display === "block" ? "none" : "block";
}



// ============================
// SCROLL
// ============================
function scrollGaleria(id, dir) {
    const el = document.getElementById(id);
    if (!el) return;

    const item = el.children[0];
    const largura = item ? item.offsetWidth + 15 : 250;

    el.scrollBy({
        left: dir * largura * 6,
        behavior: "smooth"
    });
}
