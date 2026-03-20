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

    // FORMULÁRIO
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

    // ============================
    // EVENTOS (CARROSSEL)
    // ============================
    fetch('eventos.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('eventos');

        data.eventos.forEach((ev, index) => {

            let bloco = document.createElement('div');
            bloco.classList.add("evento");

            bloco.innerHTML = `
                <h3 onclick="toggle(this)">${ev.titulo} - ${ev.data}</h3>

                <div class="conteudo">
                    <div class="carrossel-wrapper">

                        <button class="seta esquerda" onclick="scrollGaleria(${index}, -1)">❮</button>

                        <div class="carrossel" id="galeria-${index}">
                            ${ev.fotos.map(f => `<img src="${f}">`).join("")}
                            ${ev.videos.map(v => `<iframe src="${v}" allowfullscreen></iframe>`).join("")}
                        </div>

                        <button class="seta direita" onclick="scrollGaleria(${index}, 1)">❯</button>

                    </div>
                </div>
            `;

            container.appendChild(bloco);
        });
    });

    // ============================
    // SETS PROFISSIONAL
    // ============================
    fetch('sets.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('sets');

        data.sets.forEach((set, index) => {

            container.innerHTML += `
                <div class="set-card">

                    <div class="set-info">
                        <h3>${set.titulo}</h3>
                        <p>${set.data}</p>
                    </div>

                    <div class="player">
                        <audio controls src="${set.audio}"></audio>
                    </div>

                </div>
            `;
        });
    });

});

// TOGGLE EVENTOS
function toggle(el) {
    const content = el.nextElementSibling;
    content.style.display =
        content.style.display === "block" ? "none" : "block";
}

// SCROLL
function scrollGaleria(index, direction) {
    const galeria = document.getElementById(`galeria-${index}`);
    galeria.scrollLeft += direction * 300;
}
