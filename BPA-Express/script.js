AOS.init();

//  chave API google -  AIzaSyARLiv-4fC4XefW7g533SI5Mbwr2hQZYaU

document.getElementById('freightForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Pegando os valores do formulário
    const weight = parseFloat(document.getElementById('weight').value);
    const pickup = document.getElementById('pickup').value;
    const delivery = document.getElementById('delivery').value;
    const transportType = document.getElementById('transportType').value;

    // Configurando o serviço DistanceMatrix
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
        {
            origins: [pickup],
            destinations: [delivery],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
        }, function (response, status) {
            if (status !== 'OK') {
                document.getElementById('result').innerHTML = `Erro ao calcular a distância: ${status}`;
            } else {
                const distance = response.rows[0].elements[0].distance.value / 1000; // em km
                const baseFare = 10.0; // Tarifa base
                const ratePerKg = 5.0; // Taxa por kg

                // Calculando o custo
                let cost = baseFare + (weight * ratePerKg) + (distance * 0.5); // Exemplo de taxa por km

                // Ajustando o custo para o tipo de transporte
                if (transportType === 'express') {
                    cost *= 1.5; // 50% a mais para transporte expresso
                }

                // Exibindo o resultado
                document.getElementById('result').innerHTML = `Distância: ${distance.toFixed(2)} km<br>O valor estimado do frete é R$ ${cost.toFixed(2)}`;
            }
        });

        
});


