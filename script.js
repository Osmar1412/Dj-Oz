(function(){
    emailjs.init("vY9bUzhQP96Kiag5h");
})();

document.addEventListener("DOMContentLoaded", function () {

    fetch('config.json')
    .then(res => res.json())
    .then(data => {
        document.getElementById('logo').src = data.logo;
        document.getElementById('descricao').innerText = data.descricao;
    });

    let visitas = localStorage.getItem("visitasTotal") || 0;

    if (!sessionStorage.getItem("visitou")) {
        visitas++;
        localStorage.setItem("visitasTotal", visitas);
        sessionStorage.setItem("visitou", "true");
    }

    document.getElementById("contador").innerText = "👁️ Visitas: " + visitas;

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
                            <audio controls src="${set.audio}"></audio>
                        </div>
                    `).join("")}
                </div>
                <button class="seta direita" onclick="scrollGaleria('sets-carrossel', 1)">❯</button>
            </div>
        `;
    });

    fetch('eventos.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('eventos');

        data.eventos.forEach((ev, index) => {
            container.innerHTML += `
                <div class="evento">
                    <h3 onclick="toggle(this)">${ev.titulo} - ${ev.data}</h3>

                    <div class="conteudo">
                        <h4 onclick="toggle(this)">📸 Mídias</h4>
                        <div class="conteudo">
                            <div class="carrossel-wrapper">

                                <button class="seta esquerda" onclick="scrollGaleria('evento-${index}', -1)">❮</button>

                                <div class="carrossel" id="evento-${index}">
                                    ${ev.fotos.map(f => `<img src="${f}">`).join("")}
                                    ${ev.videos.map(v => `<iframe src="${v}" allowfullscreen></iframe>`).join("")}
                                </div>

                                <button class="seta direita" onclick="scrollGaleria('evento-${index}', 1)">❯</button>

                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    });

});

function toggle(el) {
    const c = el.nextElementSibling;
    c.style.display = c.style.display === "block" ? "none" : "block";
}

function toggleSection(el) {
    const c = el.nextElementSibling;
    c.style.display = c.style.display === "block" ? "none" : "block";
}

/* SCROLL CORRIGIDO */
function scrollGaleria(id, dir) {
    const el = document.getElementById(id);
    const items = el.children;

    if (!items.length) return;

    const itemWidth = items[0].offsetWidth + 20;
    const scrollAmount = itemWidth * 6;

    el.scrollBy({
        left: dir * scrollAmount,
        behavior: "smooth"
    });
}

/* SWIPE MOBILE */
document.querySelectorAll('.carrossel').forEach(carrossel => {
    let isDown = false;
    let startX;
    let scrollLeft;

    carrossel.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - carrossel.offsetLeft;
        scrollLeft = carrossel.scrollLeft;
    });

    carrossel.addEventListener('mouseleave', () => isDown = false);
    carrossel.addEventListener('mouseup', () => isDown = false);

    carrossel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carrossel.offsetLeft;
        const walk = (x - startX) * 1.5;
        carrossel.scrollLeft = scrollLeft - walk;
    });

    // TOUCH (CELULAR)
    carrossel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
        scrollLeft = carrossel.scrollLeft;
    });

    carrossel.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 1.5;
        carrossel.scrollLeft = scrollLeft - walk;
    });
});


/* SCROLL AUTOMÁTICO */
setInterval(() => {
    document.querySelectorAll('.carrossel').forEach(el => {
        el.scrollBy({ left: 300, behavior: 'smooth' });

        // loop infinito suave
        if (el.scrollLeft + el.offsetWidth >= el.scrollWidth - 10) {
            el.scrollTo({ left: 0, behavior: 'smooth' });
        }
    });
}, 5000);


/* FOCO CENTRAL */
function aplicarFoco() {
    document.querySelectorAll('.carrossel').forEach(carrossel => {
        const itens = carrossel.children;
        const centro = carrossel.scrollLeft + (carrossel.offsetWidth / 2);

        Array.from(itens).forEach(item => {
            const itemCentro = item.offsetLeft + item.offsetWidth / 2;
            const distancia = Math.abs(centro - itemCentro);

            if (distancia < item.offsetWidth) {
                item.style.transform = "scale(1.1)";
                item.style.zIndex = "2";
            } else {
                item.style.transform = "scale(0.9)";
                item.style.zIndex = "1";
            }
        });
    });
}

setInterval(aplicarFoco, 200);
