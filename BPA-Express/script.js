AOS.init();

//  chave API google -  AIzaSyARLiv-4fC4XefW7g533SI5Mbwr2hQZYaU

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






