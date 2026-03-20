// EMAILJS
(function(){
    emailjs.init("vY9bUzhQP96Kiag5h");
})();

document.addEventListener("DOMContentLoaded", function () {

    // ============================
    // CONFIG
    // ============================
    fetch('config.json')
    .then(res => res.json())
    .then(data => {
        document.getElementById('logo').src = data.logo;
        document.getElementById('descricao').innerText = data.descricao;
    });

    // ============================
    // CONTADOR SIMPLES (SEM F5)
    // ============================
    const contador = document.getElementById("contador");

    let visitas = localStorage.getItem("visitasTotal");

    // Se nunca visitou
    if (!visitas) {
        visitas = 1;
        localStorage.setItem("visitasTotal", visitas);
    } else {
        visitas = parseInt(visitas);

        // Só incrementa se for NOVA VISITA REAL (não F5)
        if (!sessionStorage.getItem("visitou")) {
            visitas++;
            localStorage.setItem("visitasTotal", visitas);
            sessionStorage.setItem("visitou", "true");
        }
    }

    contador.innerText = "👁️ Visitas: " + visitas;

    // ============================
    // FORMULÁRIO EMAILJS
    // ============================
    const form = document.getElementById("formDJ");
    const status = document.getElementById("statusEnvio");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        status.innerText = "📨 Enviando...";

        // ENVIA PRA VOCÊ
        emailjs.sendForm("service_5fpydfh", "template_esjbqjl", form)
        .then(() => {

            // ENVIA RESPOSTA AUTOMÁTICA
            return emailjs.sendForm("service_5fpydfh", "template_2qmhd1v", form);

        })
        .then(() => {
            status.innerText = "✅ Pedido enviado com sucesso!";
            form.reset();
        })
        .catch((error) => {
            status.innerText = "❌ Erro ao enviar.";
            console.log(error);
        });
    });

    // ============================
    // EVENTOS
    // ============================
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
                </div>
            `;

            container.appendChild(bloco);
        });
    });

    // ============================
    // SETS
    // ============================
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

});

// TOGGLE
function toggle(el) {
    const content = el.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
}
