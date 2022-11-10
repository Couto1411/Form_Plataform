$('#mytab a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
})

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values
function drawChart() {
    var data1 = google.visualization.arrayToDataTable([
        ['Resposta', 'Quantidade'],
        ['Masculino', 3],
        ['Feminino', 2]
        ]);
    var data2 = google.visualization.arrayToDataTable([
        ['Resposta', 'Quantidade'],
        ['2015', 1],
        ['2016', 1],
        ['2017', 1],
        ['2018', 1],
        ['2019', 1]
        ]);
    var data3 = google.visualization.arrayToDataTable([
        ['Resposta', 'Quantidade'],
        ['Mecatrônica / Eletromecânica', 1],
        ['Informática / Informática para a Internet', 3],
        ['Produção de Moda', 1]
        ]);
    var data4 = google.visualization.arrayToDataTable([
        ['Resposta', 'Quantidade'],
        ['Integrado', 2],
        ['Concomitante / subsequente', 3]
        ]);
    var data5 = google.visualization.arrayToDataTable([
        ['Resposta', 'Quantidade'],
        ['Nível técnico', 2],
        ['Graduação em andamento', 0],
        ['Graduação completa', 2],
        ['Especialização em andamento', 0],
        ['Especialização completa', 0],
        ['Mestrado em andamento', 1],
        ['Mestrado completo', 0],
        ['Doutorado em andamento', 0],
        ['Doutorado completo', 0]
        ]);
    // Optional; add a title and set the width and height of the chart
    var options1 = {title:'Questão 1'};
    var options2 = {title:'Questão 2'};
    var options3 = {title:'Questão 3'};
    var options4 = {title:'Questão 4'};
    var options5 = {title:'Questão 5'};
    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById('piechart1'));
    chart.draw(data1, options1);
    var chart = new google.visualization.PieChart(document.getElementById('piechart2'));
    chart.draw(data2, options2);
    var chart = new google.visualization.PieChart(document.getElementById('piechart3'));
    chart.draw(data3, options3);
    var chart = new google.visualization.PieChart(document.getElementById('piechart4'));
    chart.draw(data4, options4);
    var chart = new google.visualization.PieChart(document.getElementById('piechart5'));
    chart.draw(data5, options5);
    var chart = new google.visualization.PieChart(document.getElementById('piechart6'));
    chart.draw(data1, options1);
}