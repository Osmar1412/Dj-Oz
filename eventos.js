document.addEventListener("DOMContentLoaded", function () {

    // ============================
    // LOGO
    // ============================
    fetch('./config.json')
    .then(res => res.json())
    .then(data => {
        const logo = document.getElementById('logo');
        if (logo && data.logo) logo.src = data.logo;
    })
    .catch(() => console.warn("Erro ao carregar config.json"));



    // ============================
    // GERADOR DE FOTOS AUTOMÁTICAS
    // ============================
    function gerarFotos(config) {

        if (!config || !config.quantidade) return [];

        const lista = [];

        for (let i = 1; i <= config.quantidade; i++) {
            const numero = String(i).padStart(2, '0');
            lista.push(`${config.pasta}${config.prefixo}${numero}.${config.ext}`);
        }

        return lista;
    }



    // ============================
    // RENDER DE MÍDIA
    // ============================
    function renderMidia(item, titulo) {

        if (!item) return "";

        // imagem
        if (/\.(jpg|jpeg|png|webp)$/i.test(item)) {
            return `<img src="${item}" alt="${titulo}" loading="lazy">`;
        }

        // vídeo local
        if (/\.(mp4|webm)$/i.test(item)) {
            return `
                <video controls>
                    <source src="${item}" type="video/mp4">
                </video>
            `;
        }

        // iframe (youtube etc)
        return `<iframe src="${item}" loading="lazy" allowfullscreen></iframe>`;
    }



    // ============================
    // EVENTOS
    // ============================
    fetch('./eventos.json')
    .then(res => res.json())
    .then(data => {

        const container = document.getElementById('eventos-container');
        if (!container) return;

        if (!data.eventos || !Array.isArray(data.eventos)) {
            container.innerHTML = "<p>Formato de eventos inválido.</p>";
            return;
        }

        if (data.eventos.length === 0) {
            container.innerHTML = "<p>Nenhum evento cadastrado.</p>";
            return;
        }

        data.eventos.forEach((ev, index) => {

            // FOTOS
            let fotos = [];

            if (Array.isArray(ev.fotos)) {
                fotos = ev.fotos;
            } else if (typeof ev.fotos === "object") {
                fotos = gerarFotos(ev.fotos);
            }

            // VIDEOS
            const videos = Array.isArray(ev.videos) ? ev.videos : [];

            // JUNTA TUDO
            const midias = [...fotos, ...videos];

            // RENDER
            container.innerHTML += `
                <div class="evento">

                    <h3 onclick="toggle(this)">
                        ${ev.titulo || "Evento"} - ${ev.data || ""}
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

                </div>
            `;
        });

    })
    .catch(err => {
        console.error("Erro ao carregar eventos:", err);
        document.getElementById('eventos-container').innerHTML =
            "<p>Erro ao carregar eventos.</p>";
    });

});



// ============================
// TOGGLE
// ============================
function toggle(el) {
    const c = el.nextElementSibling;
    if (!c) return;

    c.style.display = c.style.display === "block" ? "none" : "block";
}



// ============================
// SCROLL (6 ITENS)
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
