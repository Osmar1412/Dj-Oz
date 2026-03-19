// CONFIG (LOGO + TEXTOS)
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

function toggle(el) {
    const content = el.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
}

// CONTADOR
let visitas = localStorage.getItem("visitas") || 0;
visitas++;
localStorage.setItem("visitas", visitas);

document.getElementById("contador").innerText = "👁️ Visitas: " + visitas;


// FORMULÁRIO AJAX
document.getElementById("formContato").addEventListener("submit", function(e) {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    fetch("https://formsubmit.co/ajax/osmar.dj.oz@gmail.com", {
        method: "POST",
        body: data
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("statusEnvio").innerText = "✅ Mensagem enviada com sucesso!";
        form.reset();
    })
    .catch(error => {
        document.getElementById("statusEnvio").innerText = "❌ Erro ao enviar. Tente novamente.";
    });
});
