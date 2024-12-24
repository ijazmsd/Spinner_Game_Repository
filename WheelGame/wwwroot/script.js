async function MyFunc() {
    const wheel = document.getElementById("wheel");
    const spinBtn = document.getElementById("spin-btn");
    const finalValue = document.getElementById("final-value");

    const generateColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
        }
        return colors;
    };

    let pieColors = generateColors(6);

    const rotationValues = [
        { minDegree: 0, maxDegree: 30, value: 2 },
        { minDegree: 31, maxDegree: 90, value: 1 },
        { minDegree: 91, maxDegree: 150, value: 6 },
        { minDegree: 151, maxDegree: 210, value: 5 },
        { minDegree: 211, maxDegree: 270, value: 4 },
        { minDegree: 271, maxDegree: 330, value: 3 },
        { minDegree: 331, maxDegree: 360, value: 2 },
    ];

    let myChart = new Chart(wheel, {
        plugins: [ChartDataLabels],
        type: "pie",
        data: {
            labels: ["Section 1", "Section 2", "Section 3", "Section 4", "Section 5", "Section 6"],
            datasets: [{
                backgroundColor: pieColors,
                data: [1, 1, 1, 1, 1, 1],
            }],
        },
        options: {
            responsive: true,
            animation: { duration: 0 },
            plugins: {
                tooltip: false,
                legend: { display: false },
                datalabels: {
                    color: "#ffffff",
                    formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                    font: { size: 24 },
                },
            },
        },
    });

    const valueGenerator = (angleValue) => {
        for (let i of rotationValues) {
            if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
                finalValue.innerHTML = `<p>Winner: Section ${i.value}</p>`;
                spinBtn.disabled = false;
                break;
            }
        }
    };

    let count = 0;
    let resultValue = 101;

    spinBtn.addEventListener("click", () => {
        spinBtn.disabled = true;
        finalValue.innerHTML = `<p>Spinning the wheel. Good luck!</p>`;
        let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
        let rotationInterval = window.setInterval(() => {
            myChart.options.rotation = myChart.options.rotation + resultValue;
            myChart.update();
            if (myChart.options.rotation >= 360) {
                count += 1;
                resultValue -= 5;
                myChart.options.rotation = 0;
            } else if (count > 15 && myChart.options.rotation == randomDegree) {
                valueGenerator(randomDegree);
                clearInterval(rotationInterval);
                count = 0;
                resultValue = 101;
            }
        }, 10);
    });
    //// Fetch JSON data from the file
    //const response = await fetch('rummyGames-1.json'); // Ensure this file is in the correct location (e.g., wwwroot).
    //const games = await response.json();

    //// Extract titles and background colors for the wheel
    //const labels = games.map(game => game.title);
    //const colors = games.map(game => game.backgroundColor || `#${Math.floor(Math.random() * 16777215).toString(16)}`);

    //// DOM Elements
    //const wheel = document.getElementById("wheel");
    //const spinBtn = document.getElementById("spin-btn");
    //const finalValue = document.getElementById("final-value");

    //const rotationValues = Array.from({ length: games.length }, (_, index) => {
    //    const sliceAngle = 360 / games.length;
    //    return {
    //        minDegree: index * sliceAngle,
    //        maxDegree: (index + 1) * sliceAngle - 1,
    //        value: labels[index]
    //    };
    //});

    //let myChart = new Chart(wheel, {
    //    plugins: [ChartDataLabels],
    //    type: "pie",
    //    data: {
    //        labels: labels,
    //        datasets: [{
    //            backgroundColor: colors,
    //            data: Array(games.length).fill(1), // Equal slices for all games
    //        }],
    //    },
    //    options: {
    //        responsive: true,
    //        animation: { duration: 0 },
    //        plugins: {
    //            tooltip: false,
    //            legend: { display: false },
    //            datalabels: {
    //                color: "#ffffff",
    //                formatter: (_, context) => context.chart.data.labels[context.dataIndex],
    //                font: { size: 18 }, // Adjust font size
    //                anchor: "center",
    //                align: "center",
    //                rotation: 0, // Disable text rotation by plugin
    //            },
    //        },
    //    },
    //    plugins: [{
    //        beforeDraw: (chart) => {
    //            const ctx = chart.ctx;
    //            const labels = chart.data.labels;
    //            const dataset = chart.data.datasets[0];
    //            const total = dataset.data.length;
    //            const radius = chart.chartArea.width / 2;

    //            ctx.save();
    //            ctx.font = "16px Arial"; // Adjust font size
    //            ctx.textAlign = "center";
    //            ctx.textBaseline = "middle";

    //            labels.forEach((label, index) => {
    //                const angle = (index / total) * (2 * Math.PI);
    //                const midAngle = angle + Math.PI / total;

    //                // Calculate text position
    //                const x = chart.chartArea.left + radius + Math.cos(midAngle) * (radius / 1.5);
    //                const y = chart.chartArea.top + radius + Math.sin(midAngle) * (radius / 1.5);

    //                // Rotate context and draw text
    //                ctx.translate(x, y);
    //                ctx.rotate(midAngle);
    //                ctx.fillStyle = "#ffffff"; // Text color
    //                ctx.fillText(label, 0, 0);
    //                ctx.rotate(-midAngle);
    //                ctx.translate(-x, -y);
    //            });
    //            ctx.restore();
    //        },
    //    }],
    //});




    //// Value generator to display the selected game
    //const valueGenerator = (angleValue) => {
    //    for (let i of rotationValues) {
    //        if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
    //            finalValue.innerHTML = `<p>Winner: ${i.value}</p>`;
    //            spinBtn.disabled = false;
    //            break;
    //        }
    //    }
    //};

    //// Spin logic
    //let count = 0;
    //let resultValue = 101;

    //spinBtn.addEventListener("click", () => {
    //    spinBtn.disabled = true;
    //    finalValue.innerHTML = `<p>Spinning the wheel. Good luck!</p>`;
    //    let randomDegree = Math.floor(Math.random() * 360);
    //    let rotationInterval = window.setInterval(() => {
    //        myChart.options.rotation = (myChart.options.rotation + resultValue) % 360;
    //        myChart.update();
    //        if (resultValue > 0) {
    //            count += 1;
    //            resultValue -= 5;
    //        } else if (count > 15 && myChart.options.rotation >= randomDegree - 2 && myChart.options.rotation <= randomDegree + 2) {
    //            valueGenerator(randomDegree);
    //            clearInterval(rotationInterval);
    //            count = 0;
    //            resultValue = 101;
    //        }
    //    }, 10);
    //});
}
