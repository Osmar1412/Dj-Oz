document.addEventListener("DOMContentLoaded", function () {

    // Logo
    fetch('./config.json')
    .then(res => res.json())
    .then(data => {
        document.getElementById('logo').src = data.logo;
    });

    // Eventos
    fetch('./eventos.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('eventos-container');

        if (!data.eventos || data.eventos.length === 0) {
            container.innerHTML = "<p>Nenhum evento cadastrado.</p>";
            return;
        }

        data.eventos.forEach((ev, index) => {
            container.innerHTML += `
                <div class="evento">
                    <h3 onclick="toggle(this)">${ev.titulo} - ${ev.data}</h3>

                    <div class="conteudo">
                        <div class="carrossel-wrapper">

                            <button class="seta esquerda" onclick="scrollGaleria('evento-${index}', -1)">❮</button>

                            <div class="carrossel" id="evento-${index}">
                                ${ev.fotos.map(f => `<img src="${f}" alt="${ev.titulo}">`).join("")}
                                ${ev.videos.map(v => `<iframe src="${v}" allowfullscreen></iframe>`).join("")}
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

// FUNÇÕES
function toggleSection(el) {
    const c = el.nextElementSibling;
    c.style.display = c.style.display === "block" ? "none" : "block";
}

function toggle(el) {
    const c = el.nextElementSibling;
    c.style.display = c.style.display === "block" ? "none" : "block";
}

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
