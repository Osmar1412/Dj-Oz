// EMAILJS
(function(){
    emailjs.init("vY9bUzhQP96Kiag5h");
})();

document.addEventListener("DOMContentLoaded", function () {

    // CONFIG
    fetch('config.json')
    .then(res => res.json())
    .then(data => {
        document.getElementById('logo').src = data.logo;
        document.getElementById('descricao').innerText = data.descricao;
    });

    // CONTADOR
    let visitas = localStorage.getItem("visitasTotal") || 0;

    if (!sessionStorage.getItem("visitou")) {
        visitas++;
        localStorage.setItem("visitasTotal", visitas);
        sessionStorage.setItem("visitou", "true");
    }

    document.getElementById("contador").innerText = "👁️ Visitas: " + visitas;

    // FORM
    const form = document.getElementById("formDJ");
    const status = document.getElementById("statusEnvio");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        status.innerText = "📨 Enviando...";

        emailjs.sendForm("service_5fpydfh", "template_esjbqjl", form)
        .then(() => emailjs.sendForm("service_5fpydfh", "template_2qmhd1v", form))
        .then(() => {
            status.innerText = "✅ Pedido enviado com sucesso!";
            form.reset();
        })
        .catch(() => {
            status.innerText = "❌ Erro ao enviar.";
        });
    });

    // EVENTOS
    fetch('eventos.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('eventos');

        data.eventos.forEach((ev, index) => {
            container.innerHTML += `
                <div class="evento">
                    <h3 onclick="toggle(this)" class="titulo-click">
                        ${ev.titulo} - ${ev.data}
                    </h3>

                    <div class="conteudo">
                        <div class="carrossel-wrapper">

                            <button class="seta esquerda" onclick="scrollGaleria('evento-${index}', -1)">‹</button>

                            <div class="carrossel" id="evento-${index}">
                                ${ev.fotos.map(f => `<img src="${f}">`).join("")}
                                ${ev.videos.map(v => `<iframe src="${v}" allowfullscreen></iframe>`).join("")}
                            </div>

                            <button class="seta direita" onclick="scrollGaleria('evento-${index}', 1)">›</button>

                        </div>
                    </div>
                </div>
            `;
        });
    });

    // SETS
    fetch('sets.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('setsContent');

        container.innerHTML = `
            <div class="carrossel-wrapper">

                <button class="seta esquerda" onclick="scrollGaleria('sets-carrossel', -1)">‹</button>

                <div class="carrossel" id="sets-carrossel">
                    ${data.sets.map(set => `
                        <div class="set-card">
                            <h3>${set.titulo}</h3>
                            <p>${set.data}</p>
                            <audio controls>
                                <source src="${set.audio}">
                            </audio>
                        </div>
                    `).join("")}
                </div>

                <button class="seta direita" onclick="scrollGaleria('sets-carrossel', 1)">›</button>

            </div>
        `;
    });

});

// TOGGLE
function toggle(el) {
    const content = el.nextElementSibling;
    content.style.display =
        content.style.display === "block" ? "none" : "block";
}

// TOGGLE SECTION
function toggleSection(id) {
    const el = document.getElementById(id);
    el.style.display = el.style.display === "none" ? "block" : "none";
}

// SCROLL
function scrollGaleria(id, direction) {
    const el = document.getElementById(id);
    const item = el.querySelector('*');

    if (!item) return;

    const largura = item.offsetWidth + 15;

    el.scrollBy({
        left: largura * 6 * direction,
        behavior: "smooth"
    });
}
