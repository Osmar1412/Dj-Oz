document.addEventListener("DOMContentLoaded", function () {

    // ============================
    // LOGO
    // ============================
    fetch('./config.json')
    .then(res => res.json())
    .then(data => {
        const logo = document.getElementById('logo');
        if (logo) logo.src = data.logo;
    });

    // ============================
    // FUNÇÃO GERAR FOTOS AUTOMÁTICAS
    // ============================
    function gerarFotos(config) {
        let lista = [];

        for (let i = 1; i <= config.quantidade; i++) {
            let numero = String(i).padStart(2, '0');
            lista.push(`${config.pasta}${config.prefixo}${numero}.${config.ext}`);
        }

        return lista;
    }

    // ============================
    // RENDER MIDIA (FOTO / VIDEO)
    // ============================
    function renderMidia(item, titulo) {

        // FOTO
        if (item.match(/\.(jpg|jpeg|png|webp)$/i)) {
            return `<img src="${item}" alt="${titulo}" loading="lazy">`;
        }

        // VÍDEO LOCAL
        if (item.match(/\.(mp4|webm)$/i)) {
            return `
                <video controls>
                    <source src="${item}" type="video/mp4">
                </video>
            `;
        }

        // VÍDEO EXTERNO (YouTube etc)
        return `<iframe src="${item}" loading="lazy" allowfullscreen></iframe>`;
    }

    // ============================
    // EVENTOS
    // ============================
    fetch('./eventos.json')
    .then(res => res.json())
    .then(data => {

        const container = document.getElementById('eventos-container');

        if (!data.eventos || data.eventos.length === 0) {
            container.innerHTML = "<p>Nenhum evento cadastrado.</p>";
            return;
        }

        data.eventos.forEach((ev, index) => {

            // ============================
            // FOTOS (manual ou automático)
            // ============================
            const fotos = Array.isArray(ev.fotos)
                ? ev.fotos
                : (ev.fotos ? gerarFotos(ev.fotos) : []);

            // ============================
            // VÍDEOS
            // ============================
            const videos = ev.videos || [];

            // ============================
            // JUNTA MIDIAS
            // ============================
            const midias = [...fotos, ...videos];

            // ============================
            // RENDER
            // ============================
            container.innerHTML += `
                <div class="evento">

                    <h3 onclick="toggle(this)">
                        ${ev.titulo} - ${ev.data}
                    </h3>

                    <div class="conteudo">
                        <div class="carrossel-wrapper">

                            <button class="seta esquerda" onclick="scrollGaleria('evento-${index}', -1)">❮</button>

                            <div class="carrossel" id="evento-${index}">
                                ${midias.map(m => renderMidia(m, ev.titulo)).join("")}
                            </div>

                            <button class="seta direita" onclick="scrollGaleria('evento-${index}', 1)">❯</button>

                        </div>
                    </div>

                </div>
            `;
        });

    })
    .catch(err => {
        document.getElementById('eventos-container').innerHTML = "<p>Erro ao carregar eventos.</p>";
        console.error(err);
    });

});


// ============================
// TOGGLE
// ============================
function toggle(el) {
    const c = el.nextElementSibling;
    c.style.display = c.style.display === "block" ? "none" : "block";
}


// ============================
// SCROLL (6 ITENS POR VEZ)
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
