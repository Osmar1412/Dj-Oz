// SUBSTITUA APENAS A PARTE DE EVENTOS POR ESTA:

fetch('eventos.json')
.then(res => res.json())
.then(data => {
    const container = document.getElementById('eventos');

    data.eventos.forEach((ev, index) => {
        container.innerHTML += `
            <div class="evento">
                <h3 onclick="toggle(this)">${ev.titulo} - ${ev.data}</h3>

                <div class="conteudo">

                    <h4 onclick="toggle(this)">Mídias</h4>

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
            </div>
        `;
    });
});
