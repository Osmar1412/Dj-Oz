// EMAILJS
(function(){
    emailjs.init("vY9bUzhQP96Kiag5h");
})();

document.addEventListener("DOMContentLoaded", function () {

    // LOGO
    fetch('config.json')
    .then(res => res.json())
    .then(data => {
        document.getElementById('logo').src = data.logo;
        document.getElementById('descricao').innerText = data.descricao;
    });

    // ============================
    // CONTADOR PROFISSIONAL
    // ============================
    const contador = document.getElementById("contador");

    // chave única do visitante
    let visitante = localStorage.getItem("visitante_id");

    if (!visitante) {
        visitante = Date.now() + Math.random();
        localStorage.setItem("visitante_id", visitante);

        // conta apenas novo visitante
        fetch("https://api.countapi.xyz/hit/djoz/visitas")
        .then(res => res.json())
        .then(data => {
            contador.innerText = "👁️ Visitas: " + data.value;
        })
        .catch(() => {
            contador.innerText = "👁️ Visitas: --";
        });

    } else {
        // apenas consulta (não incrementa)
        fetch("https://api.countapi.xyz/get/djoz/visitas")
        .then(res => res.json())
        .then(data => {
            contador.innerText = "👁️ Visitas: " + data.value;
        })
        .catch(() => {
            contador.innerText = "👁️ Visitas: --";
        });
    }


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
                    <div class="video">
                        ${ev.videos.map(v => `<iframe src="${v}"></iframe>`).join("")}
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

    // ============================
    // FORM
    // ============================
    const form = document.getElementById("formDJ");
    const status = document.getElementById("statusEnvio");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        status.innerText = "📨 Enviando...";

        const formData = {
            name: form.name.value,
            email: form.email.value,
            whatsapp: form.whatsapp.value,
            message: form.message.value
        };

        emailjs.send("service_5fpydfh", "template_esjbqjl", formData)
        .then(() => {
            return emailjs.send("service_5fpydfh", "template_2qmhd1v", formData);
        })
        .then(() => {
            status.innerText = "✅ Pedido enviado com sucesso!";
            form.reset();
        })
        .catch(() => {
            status.innerText = "❌ Erro ao enviar.";
        });
    });

});

// TOGGLE
function toggle(el) {
    const content = el.nextElementSibling;
    content.style.display =
        content.style.display === "block" ? "none" : "block";
}
