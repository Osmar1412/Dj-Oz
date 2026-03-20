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
            status.innerText = "✅ Enviado com sucesso!";
            form.reset();
        })
        .catch(() => {
            status.innerText = "❌ Erro ao enviar.";
        });
    });

    // SETS
    fetch('sets.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('sets-container');

        container.innerHTML = `
            <div class="carrossel-wrapper">

                <button class="seta esquerda" onclick="scrollGaleria('sets-carrossel', -1)">❮</button>

                <div class="carrossel" id="sets-carrossel">
                    ${data.sets.map(set => `
                        <div class="set-card">
                            <h3>${set.titulo}</h3>
                            <p>${set.data}</p>
                            <audio controls src="${set.audio}"></audio>
                        </div>
                    `).join("")}
                </div>

                <button class="seta direita" onclick="scrollGaleria('sets-carrossel', 1)">❯</button>

            </div>
        `;
    });

    // EVENTOS
    fetch('eventos.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('eventos');

        data.eventos.forEach((ev, index) => {
            container.innerHTML += `
                <div class="evento">
                    <h3 onclick="toggle(this)">${ev.titulo} - ${ev.data}</h3>

                    <div class="conteudo">
                        <div class="carrossel-wrapper">

                            <button class="seta esquerda" onclick="scrollGaleria('evento-${index}', -1)">❮</button>

                            <div class="carrossel" id="evento-${index}">
                                ${ev.fotos.map(f => `<img src="${f}">`).join("")}
                                ${ev.videos.map(v => `<iframe src="${v}"></iframe>`).join("")}
                            </div>

                            <button class="seta direita" onclick="scrollGaleria('evento-${index}', 1)">❯</button>

                        </div>
                    </div>
                </div>
            `;
        });
    });

});

// FUNÇÕES
function toggle(el) {
    const c = el.nextElementSibling;
    c.style.display = c.style.display === "block" ? "none" : "block";
}

function scrollGaleria(id, dir) {
    const el = document.getElementById(id);
    const largura = el.offsetWidth;
    el.scrollBy({ left: dir * largura, behavior: "smooth" });
}
