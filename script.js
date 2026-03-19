// INICIALIZA EMAILJS
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

        // CAPTURA OS DADOS
        const formData = {
            name: form.name.value,
            email: form.email.value,
            whatsapp: form.whatsapp.value,
            message: form.message.value
        };

        // ENVIA PARA VOCÊ
        emailjs.send("service_5fpydfh", "template_esjbqjl", formData)

        // ENVIA PARA CLIENTE
        .then(() => {
            return emailjs.send("service_5fpydfh", "template_2qmhd1v", formData);
        })

        // SUCESSO FINAL
        .then(() => {
            status.innerText = "✅ Pedido enviado com sucesso!";
            form.reset();
        })

        // ERRO
        .catch((error) => {
            status.innerText = "❌ Erro ao enviar. Verifique o template.";
            console.log(error);
        });
    });

});
