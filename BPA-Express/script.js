AOS.init();

//  chave API google -  AIzaSyARLiv-4fC4XefW7g533SI5Mbwr2hQZYaU

const menuToggle = document.getElementById('menuToggle');
const headerButtons = document.querySelector('.header-buttons');

menuToggle.addEventListener('click', () => {
    headerButtons.classList.toggle('active');
});

document.getElementById('freightForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio do formulário padrão

    // Pegando os valores do formulário
    const weight = parseFloat(document.getElementById('weight').value); // Peso da carga
    const pickup = document.getElementById('pickup').value; // Endereço de coleta
    const delivery = document.getElementById('delivery').value; // Endereço de entrega
    const transportType = document.getElementById('transportType').value; // Tipo de transporte

    // Configurando o serviço DistanceMatrix da Google Maps API
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
        {
            origins: [pickup], // Endereço de coleta como origem
            destinations: [delivery], // Endereço de entrega como destino
            travelMode: 'DRIVING', // Modo de viagem
            unitSystem: google.maps.UnitSystem.METRIC, // Sistema métrico
        }, function (response, status) {
            if (status !== 'OK') {
                // Exibindo mensagem de erro se o status não for OK
                document.getElementById('result').innerHTML = `Erro ao calcular a distância: ${status}`;
            } else {
                // Calculando a distância em km
                const distance = response.rows[0].elements[0].distance.value / 1000;
                const baseFare = 10.0; // Tarifa base
                const ratePerKg = 5.0; // Taxa por kg

                // Calculando o custo do frete
                let cost = baseFare + (weight * ratePerKg) + (distance * 0.5); // Exemplo de taxa por km

                // Ajustando o custo para o tipo de transporte
                if (transportType === 'express') {
                    cost *= 1.5; // 50% a mais para transporte expresso
                }

                // Exibindo o resultado na seção de Detalhes do Frete
                exibirResultadoFrete(pickup, delivery, distance, weight, cost);

                // Exibindo o resultado também na seção original
                document.getElementById('result').innerHTML = `Distância: ${distance.toFixed(2)} km<br>O valor estimado do frete é R$ ${cost.toFixed(2)}`;
            }
        });
});

// Função para exibir o resultado detalhado do frete
function exibirResultadoFrete(enderecoColeta, enderecoEntrega, distancia, peso, valorFrete) {
    document.getElementById("enderecoColeta").textContent = enderecoColeta;
    document.getElementById("enderecoEntrega").textContent = enderecoEntrega;
    document.getElementById("distancia").textContent = distancia.toFixed(2);
    document.getElementById("pesoCarga").textContent = peso;
    document.getElementById("valorFrete").textContent = valorFrete.toFixed(2);
    
    // Exibindo a seção de detalhes do frete
    document.getElementById("resultadoFrete").style.display = "block";

    // Adicionando a funcionalidade de enviar orçamento via WhatsApp
    document.getElementById("enviarOrcamento").addEventListener("click", function() {
        const mensagem = `Orçamento de Frete:
        Endereço de Coleta: ${enderecoColeta}
        Endereço de Entrega: ${enderecoEntrega}
        Distância: ${distancia.toFixed(2)} km
        Peso da Carga: ${peso} kg
        Valor do Frete: R$ ${valorFrete.toFixed(2)}`;
        
        const numeroWhatsApp = "041999905296"; // Número desejado
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
        
        window.open(urlWhatsApp, "_blank"); // Abre o WhatsApp com a mensagem
    });

    // Adicionando a funcionalidade de salvar o orçamento como PDF
    document.getElementById("salvarPdf").addEventListener("click", function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Orçamento de Frete", 10, 10); // Título do PDF

        doc.setFontSize(12);
        doc.text(`Endereço de Coleta: ${enderecoColeta}`, 10, 20);
        doc.text(`Endereço de Entrega: ${enderecoEntrega}`, 10, 30);
        doc.text(`Distância: ${distancia.toFixed(2)} km`, 10, 40);
        doc.text(`Peso da Carga: ${peso} kg`, 10, 50);
        doc.text(`Valor do Frete: R$ ${valorFrete.toFixed(2)}`, 10, 60);

        doc.save("orcamento_frete.pdf"); // Salva o PDF com o nome "orcamento_frete.pdf"
    });
}

// Formulário de cadastro (passo-a-passo)
// form-steps.js

// Função para ir para a próxima etapa
function nextStep(step) {
    // Pegando valores dos campos de senha e confirmação
    if (step === 2) {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validação das senhas
        if (password !== confirmPassword) {
            alert("As senhas não coincidem. Por favor, tente novamente.");
            return; // Impede de avançar se as senhas não forem iguais
        }
    }

    // Oculta todas as etapas
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((s) => s.style.display = 'none');

    // Exibe a etapa atual
    document.getElementById('step' + step).style.display = 'block';
}

// Função para voltar para a etapa anterior
function previousStep(step) {
    // Oculta todas as etapas
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((s) => s.style.display = 'none');

    // Exibe a etapa anterior
    document.getElementById('step' + step).style.display = 'block';
}

// Inicia no primeiro passo
nextStep(1);

// Aplicando máscara para telefone, CNPJ e CPF
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona a máscara de telefone
    const phoneInput = document.getElementById('phone');
    const cnpjInput = document.getElementById('cnpj');
    const cpfInput = document.getElementById('cpf');

    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = phoneInput.value.replace(/\D/g, ''); // Remove tudo que não for número
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca o DDD
            value = value.replace(/(\d)(\d{4})$/, '$1-$2'); // Coloca o hífen
            phoneInput.value = value;
        });
    }

    if (cnpjInput) {
        cnpjInput.addEventListener('input', function() {
            let value = cnpjInput.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
            cnpjInput.value = value;
        });
    }

    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            let value = cpfInput.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            cpfInput.value = value;
        });
    }
});

// Função para atualizar a barra de progresso
function updateProgressBar(step) {
    const progress = document.getElementById('progress');
    const progressSteps = document.querySelectorAll('.progress-step');

    // Atualiza a largura da barra
    const stepPercent = (step - 1) / (progressSteps.length - 1) * 100;
    progress.style.width = stepPercent + '%';

    // Atualiza a cor das etapas
    progressSteps.forEach((element, index) => {
        if (index < step) {
            element.classList.add('progress-step-active');
        } else {
            element.classList.remove('progress-step-active');
        }
    });
}

// Modificamos as funções para avançar e retroceder para atualizar a barra de progresso
function nextStep(step) {
    // Validação da senha (como antes)
    if (step === 2) {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        if (password !== confirmPassword) {
            alert("As senhas não coincidem. Por favor, tente novamente.");
            return;
        }
    }

    // Ocultar etapas e mostrar a nova etapa (como antes)
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((s) => s.style.display = 'none');
    document.getElementById('step' + step).style.display = 'block';

    // Atualiza a barra de progresso
    updateProgressBar(step);
}

function previousStep(step) {
    // Ocultar etapas e mostrar a anterior
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((s) => s.style.display = 'none');
    document.getElementById('step' + step).style.display = 'block';

    // Atualiza a barra de progresso
    updateProgressBar(step);
}

// Inicializar a barra de progresso
nextStep(1);







