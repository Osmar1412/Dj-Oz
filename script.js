// EMAILJS
(function(){
    emailjs.init("vY9bUzhQP96Kiag5h");
})();

document.addEventListener("DOMContentLoaded", function () {

    // ============================
    // CONFIG (LOGO + TEXTO)
    // ============================
    fetch('config.json')
    .then(res => res.json())
    .then(data => {
        const logo = document.getElementById('logo');
        const desc = document.getElementById('descricao');

        if (logo) logo.src = data.logo;
        if (desc) desc.innerText = data.descricao;
    });

    // ============================
    // CONTADOR (SEM F5)
    // ============================
    const contador = document.getElementById("contador");

    if (contador) {
        let visitas = localStorage.getItem("visitasTotal") || 0;

        if (!sessionStorage.getItem("visitou")) {
            visitas++;
            localStorage.setItem("visitasTotal", visitas);
            sessionStorage.setItem("visitou", "true");
        }

        contador.innerText = "👁️ Visitas: " + visitas;
    }

    // ============================
    // FORMULÁRIO (EMAILJS)
    // ============================
    const form = document.getElementById("formDJ");
    const status = document.getElementById("statusEnvio");

    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            status.innerText = "📨 Enviando...";

            emailjs.sendForm("service_5fpydfh", "template_esjbqjl", form)
            .then(() => emailjs.sendForm("service_5fpydfh", "template_2qmhd1v", form))
            .then(() => {
                status.innerText = "✅ Pedido enviado com sucesso!";
                form.reset();
            })
            .catch((error) => {
                console.log(error);
                status.innerText = "❌ Erro ao enviar.";
            });
        });
    }

    // ============================
    // EVENTOS (6 VISÍVEIS + CARROSSEL)
    // ============================
    fetch('eventos.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('eventos');
        if (!container) return;

        data.eventos.forEach((ev, index) => {

            const fotos = ev.fotos || [];
            const videos = ev.videos || [];

            container.innerHTML += `
                <div class="evento">
                    <h3 onclick="toggle(this)">${ev.titulo} - ${ev.data}</h3>

                    <div class="conteudo">
                        <div class="carrossel-wrapper">

                            <button class="seta esquerda" onclick="scrollGaleria('evento-${index}', -1)">❮</button>

                            <div class="carrossel" id="evento-${index}">
                                ${fotos.map(f => `<img src="${f}">`).join("")}
                                ${videos.map(v => `<iframe src="${v}" allowfullscreen></iframe>`).join("")}
                            </div>

                            <button class="seta direita" onclick="scrollGaleria('evento-${index}', 1)">❯</button>

                        </div>
                    </div>
                </div>
            `;
        });
    });

    // ============================
    // SETS (6 VISÍVEIS + SCROLL SUAVE)
    // ============================
    fetch('sets.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('sets');
        if (!container) return;

        container.innerHTML = `
            <div class="carrossel-wrapper">

                <button class="seta esquerda" onclick="scrollGaleria('sets-carrossel', -1)">❮</button>

                <div class="carrossel" id="sets-carrossel">
                    ${data.sets.map(set => `
                        <div class="set-card">
                            <h3>${set.titulo}</h3>
                            <p>${set.data}</p>

                            <audio controls>
                                <source src="${set.audio}" type="audio/mpeg">
                            </audio>
                        </div>
                    `).join("")}
                </div>

                <button class="seta direita" onclick="scrollGaleria('sets-carrossel', 1)">❯</button>

            </div>
        `;
    });

});

// ============================
// FUNÇÕES GLOBAIS
// ============================

function toggle(el) {
    const content = el.nextElementSibling;
    content.style.display =
        content.style.display === "block" ? "none" : "block";
}

// 🔥 SCROLL AJUSTADO (EXATAMENTE 1 "PÁGINA" = 6 ITENS)
function scrollGaleria(id, direction) {
    const el = document.getElementById(id);
    if (!el) return;

    const larguraItem = el.querySelector('*')?.offsetWidth || 250;
    const scrollTotal = larguraItem * 6; // 👈 6 itens por vez

    el.scrollBy({
        left: direction * scrollTotal,
        behavior: "smooth"
    });
}
