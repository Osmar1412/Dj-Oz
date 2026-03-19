// INICIALIZA EMAILJS
(function(){
    emailjs.init("vY9bUzhQP96Kiag5h");
})();

document.addEventListener("DOMContentLoaded", function () {

    // CONFIG (logo e descrição)
    fetch('config.json')
    .then(res => res.json())
    .then(data => {
        document.getElementById('logo').src = data.logo;
        document.getElementById('descricao').innerText = data.descricao;
    });

    // CONTADOR (não conta F5)
    let visitas = localStorage.getItem("visitasTotal") || 0;

    if (!sessionStorage.getItem("visitouSessao")) {
        visitas++;
        localStorage.setItem("visitasTotal", visitas);
        sessionStorage.setItem("visitouSessao", "true");
    }

    document.getElementById("contador").innerText = "👁️ Visitas: " + visitas;

    // FORMULÁRIO
    const form = document.getElementById("formDJ");
    const status = document.getElementById("statusEnvio");

    form.addEventListener("submit", function(e) {
    e.preventDefault();

    status.innerText = "📨 Enviando...";

    emailjs.sendForm("service_5fpydfh", "template_esjbqjl", this)
    .then(() => {
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
