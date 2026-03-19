// GARANTE QUE O HTML CARREGOU
document.addEventListener("DOMContentLoaded", function () {

    // ============================
    // CONFIG (LOGO + TEXTO)
    // ============================
    fetch('config.json')
    .then(res => res.json())
    .then(data => {
        if (document.getElementById('logo')) {
            document.getElementById('logo').src = data.logo;
        }

        if (document.getElementById('descricao')) {
            document.getElementById('descricao').innerText = data.descricao;
        }
    });


    // ============================
    // EVENTOS
    // ============================
    fetch('eventos.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('eventos');

        if (!container) return;

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

        if (!container) return;

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
// CONTADOR REAL (SEM CONTAR F5)
// ============================
const contador = document.getElementById("contador");

if (contador) {

    // Se NUNCA visitou
    if (!localStorage.getItem("visitou")) {

        fetch('https://api.countapi.xyz/hit/djoz-unico/visitas')
        .then(res => res.json())
        .then(res => {
            contador.innerText = "👁️ Visitas: " + res.value;
        });

        // Marca como visitante
        localStorage.setItem("visitou", "true");

    } else {

        // Só consulta (não soma)
        fetch('https://api.countapi.xyz/get/djoz-unico/visitas')
        .then(res => res.json())
        .then(res => {
            contador.innerText = "👁️ Visitas: " + res.value;
        });
    }

}

    // ============================
    // FORMULÁRIO (SEM CONFLITO)
    // ============================
    const form = document.getElementById("formContato");

    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const data = new FormData(form);

            fetch("https://formsubmit.co/ajax/osmar.dj.oz@gmail.com", {
                method: "POST",
                body: data
            })
            .then(response => response.json())
            .then(() => {
                document.getElementById("statusEnvio").innerText = "✅ Mensagem enviada com sucesso!";
                form.reset();
            })
            .catch(() => {
                document.getElementById("statusEnvio").innerText = "❌ Erro ao enviar. Tente novamente.";
            });
        });
    }

});


// ============================
// TOGGLE EVENTOS
// ============================
function toggle(el) {
    const content = el.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
}
