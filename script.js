document.addEventListener("DOMContentLoaded", function () {

    // CONFIG
    fetch('config.json')
    .then(res => res.json())
    .then(data => {
        document.getElementById('logo').src = data.logo;
        document.getElementById('descricao').innerText = data.descricao;
    });

    // EVENTOS
    fetch('eventos.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('eventos');

        data.eventos.forEach(ev => {
            let bloco = document.createElement('div');
            bloco.classList.add("evento");

            bloco.innerHTML = `
                <h3 onclick="toggle(this)">${ev.titulo} - ${ev.data}</h3>
                <div class="conteudo">
                    <div class="galeria">
                        ${ev.fotos.map(f => `<img src="${f}">`).join("")}
                    </div>
                    <div class="video">
                        ${ev.videos.map(v => `<iframe src="${v}"></iframe>`).join("")}
                    </div>
                </div>
            `;

            container.appendChild(bloco);
        });
    });

    // SETS
    fetch('sets.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('sets');

        data.sets.forEach(set => {
            container.innerHTML += `
                <div class="set">
                    <h3>${set.titulo}</h3>
                    <p>${set.data}</p>
                    <audio controls src="${set.audio}"></audio>
                </div>
            `;
        });
    });

    // CONTADOR
    let visitas = localStorage.getItem("visitasTotal") || 0;

    if (!sessionStorage.getItem("visitouSessao")) {
        visitas++;
        localStorage.setItem("visitasTotal", visitas);
        sessionStorage.setItem("visitouSessao", "true");
    }

    document.getElementById("contador").innerText = "👁️ Visitas: " + visitas;

    // FORM
    const form = document.getElementById("formDJ");
    const status = document.getElementById("statusEnvio");
    const btn = document.getElementById("btnEnviar");

    form.addEventListener("submit", function () {
        status.innerText = "📨 Enviando...";
        btn.disabled = true;

        setTimeout(() => {
            status.innerText = "✅ Pedido enviado com sucesso!";
            form.reset();
            btn.disabled = false;
        }, 2000);
    });

});

// TOGGLE
function toggle(el) {
    const content = el.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
}
