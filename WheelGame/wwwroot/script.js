async function MyFunc() {
    const wheel = document.getElementById("wheel");
    const spinBtn = document.getElementById("spin-btn");
    const finalValue = document.getElementById("result");

    // Fetch JSON data dynamically
    const response = await fetch('/rummyGames-1.json'); // Ensure the file is in the wwwroot folder
    const jsonData = await response.json();

    // Extract labels and colors from JSON
    const labels = jsonData.map(game => game.title);
    const pieColors = jsonData.map(game => game.backgroundColor || `#${Math.floor(Math.random() * 16777215).toString(16)}`);

    const drawWheel = (ctx, labels, colors) => {
        const centerX = 150; // Updated center for 300x300 canvas
        const centerY = 150;
        const radius = 150; // Updated radius
        const sliceAngle = (2 * Math.PI) / labels.length;

        labels.forEach((label, index) => {
            const startAngle = index * sliceAngle;
            const endAngle = (index + 1) * sliceAngle;

            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index];
            ctx.fill();
            ctx.stroke();

            // Draw vertical text
            const midAngle = (startAngle + endAngle) / 2;
            const textX = centerX + Math.cos(midAngle) * (radius * 0.7);
            const textY = centerY + Math.sin(midAngle) * (radius * 0.7);

            ctx.save();
            ctx.translate(textX, textY);
            ctx.rotate(midAngle + Math.PI / 2); // Rotate the text to make it vertical
            ctx.textAlign = "center";
            ctx.font = "bold 08px Arial"; // Reduced font size for smaller wheel
            ctx.fillStyle = "#ff0000"; // Red color

            const chars = label.split("");
            chars.forEach((char, i) => {
                ctx.fillText(char, 0, i * 07); // Adjusted spacing
            });

            ctx.restore();
        });
    };

    const ctx = wheel.getContext("2d");
    drawWheel(ctx, labels, pieColors);

    let angle = 0;

    spinBtn.addEventListener("click", () => {
        const randomRotation = Math.floor(Math.random() * 360) + 720;
        const animationDuration = 5000;
        const start = performance.now();

        function animate(timestamp) {
            const elapsed = timestamp - start;
            if (elapsed < animationDuration) {
                angle = (randomRotation * (elapsed / animationDuration)) % 360;
                ctx.clearRect(0, 0, wheel.width, wheel.height);
                ctx.save();
                ctx.translate(150, 150); // Adjusted for smaller canvas
                ctx.rotate((angle * Math.PI) / 180);
                ctx.translate(-150, -150); // Adjusted for smaller canvas
                drawWheel(ctx, labels, pieColors);
                ctx.restore();
                requestAnimationFrame(animate);
            } else {
                // Final angle and result
                angle = randomRotation % 360;
                const sliceAngle = 360 / labels.length;
                const selectedIndex = Math.floor((360 - angle + sliceAngle / 2) / sliceAngle) % labels.length;
                const selectedGame = jsonData[selectedIndex];

                // Display the result
                finalValue.innerHTML = `
                    <div class="result-card">
                        <h2>Winner: ${selectedGame.title}</h2>
                        <div style="background-color:${selectedGame.backgroundColor || '#fff'}; color:${selectedGame.textColor || '#000'}; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                            <p>${selectedGame.description}</p>
                            <img src="${selectedGame.icon}" alt="${selectedGame.title}" style="max-width: 100px; display: block; margin: 10px auto;">
                            <p><a href="${selectedGame.instructionsUrl}" target="_blank" style="color: #1e90ff;">Game Rules</a></p>
                        </div>
                    </div>`;
            }
        }

        requestAnimationFrame(animate);
    });
}



//async function MyFunc() {
//    const wheel = document.getElementById("wheel");
//    const spinBtn = document.getElementById("spin-btn");
//    const finalValue = document.getElementById("final-value");

//    const generateColors = (count) => {
//        const colors = [];
//        for (let i = 0; i < count; i++) {
//            colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
//        }
//        return colors;
//    };

//    let pieColors = generateColors(6);

//    const rotationValues = [
//        { minDegree: 0,   maxDegree: 30,    value: "Phase 10" },
//        { minDegree: 31,  maxDegree: 90,    value: "Classic Canasta" },
//        { minDegree: 91,  maxDegree: 150,   value: "Rumipoo" },
//        { minDegree: 151, maxDegree: 210,   value: "Rummikub 6-Player Set" },
//        { minDegree: 211, maxDegree: 270,   value: "Okey" },
//        { minDegree: 271, maxDegree: 330,   value: "Rummikub" },
//        { minDegree: 331, maxDegree: 360,   value: "Phase 10" },
//    ];

//    let myChart = new Chart(wheel, {
//        plugins: [ChartDataLabels],
//        type: "pie",
//        data: {
//            labels: ["Classic Canasta", "Phase 10", "Rummikub", "Okey", "Rummikub 6-Player Set", "Rumipoo"],
//            datasets: [{
//                backgroundColor: pieColors,
//                data: [1, 1, 1, 1, 1, 1],
//            }],
//        },
//        options: {
//            responsive: true,
//            animation: { duration: 0 },
//            plugins: {
//                tooltip: false,
//                legend: { display: false },
//                datalabels: {
//                    color: "#ffffff",
//                    formatter: (_, context) => context.chart.data.labels[context.dataIndex],
//                    font: { size: 20 },
//                },
//            },
//        },
//    });

//    const valueGenerator = (angleValue) => {
//        for (let i of rotationValues) {
//            if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
//                finalValue.innerHTML = `<p>Winner: Section ${i.value}</p>`;
//                spinBtn.disabled = false;
//                break;
//            }
//        }
//    };

//    let count = 0;
//    let resultValue = 101;

//    spinBtn.addEventListener("click", () => {
//        spinBtn.disabled = true;
//        finalValue.innerHTML = `<p>Spinning the wheel. Good luck!</p>`;
//        let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
//        let rotationInterval = window.setInterval(() => {
//            myChart.options.rotation = myChart.options.rotation + resultValue;
//            myChart.update();
//            if (myChart.options.rotation >= 360) {
//                count += 1;
//                resultValue -= 5;
//                myChart.options.rotation = 0;
//            } else if (count > 15 && myChart.options.rotation == randomDegree) {
//                valueGenerator(randomDegree);
//                clearInterval(rotationInterval);
//                count = 0;
//                resultValue = 101;
//            }
//        }, 10);
//    });
//    //// Fetch JSON data from the file
//    //const response = await fetch('rummyGames-1.json'); // Ensure this file is in the correct location (e.g., wwwroot).
//    //const games = await response.json();

//    //// Extract titles and background colors for the wheel
//    //const labels = games.map(game => game.title);
//    //const colors = games.map(game => game.backgroundColor || `#${Math.floor(Math.random() * 16777215).toString(16)}`);

//    //// DOM Elements
//    //const wheel = document.getElementById("wheel");
//    //const spinBtn = document.getElementById("spin-btn");
//    //const finalValue = document.getElementById("final-value");

//    //const rotationValues = Array.from({ length: games.length }, (_, index) => {
//    //    const sliceAngle = 360 / games.length;
//    //    return {
//    //        minDegree: index * sliceAngle,
//    //        maxDegree: (index + 1) * sliceAngle - 1,
//    //        value: labels[index]
//    //    };
//    //});

//    //let myChart = new Chart(wheel, {
//    //    plugins: [ChartDataLabels],
//    //    type: "pie",
//    //    data: {
//    //        labels: labels,
//    //        datasets: [{
//    //            backgroundColor: colors,
//    //            data: Array(games.length).fill(1), // Equal slices for all games
//    //        }],
//    //    },
//    //    options: {
//    //        responsive: true,
//    //        animation: { duration: 0 },
//    //        plugins: {
//    //            tooltip: false,
//    //            legend: { display: false },
//    //            datalabels: {
//    //                color: "#ffffff",
//    //                formatter: (_, context) => context.chart.data.labels[context.dataIndex],
//    //                font: { size: 18 }, // Adjust font size
//    //                anchor: "center",
//    //                align: "center",
//    //                rotation: 0, // Disable text rotation by plugin
//    //            },
//    //        },
//    //    },
//    //    plugins: [{
//    //        beforeDraw: (chart) => {
//    //            const ctx = chart.ctx;
//    //            const labels = chart.data.labels;
//    //            const dataset = chart.data.datasets[0];
//    //            const total = dataset.data.length;
//    //            const radius = chart.chartArea.width / 2;

//    //            ctx.save();
//    //            ctx.font = "16px Arial"; // Adjust font size
//    //            ctx.textAlign = "center";
//    //            ctx.textBaseline = "middle";

//    //            labels.forEach((label, index) => {
//    //                const angle = (index / total) * (2 * Math.PI);
//    //                const midAngle = angle + Math.PI / total;

//    //                // Calculate text position
//    //                const x = chart.chartArea.left + radius + Math.cos(midAngle) * (radius / 1.5);
//    //                const y = chart.chartArea.top + radius + Math.sin(midAngle) * (radius / 1.5);

//    //                // Rotate context and draw text
//    //                ctx.translate(x, y);
//    //                ctx.rotate(midAngle);
//    //                ctx.fillStyle = "#ffffff"; // Text color
//    //                ctx.fillText(label, 0, 0);
//    //                ctx.rotate(-midAngle);
//    //                ctx.translate(-x, -y);
//    //            });
//    //            ctx.restore();
//    //        },
//    //    }],
//    //});




//    //// Value generator to display the selected game
//    //const valueGenerator = (angleValue) => {
//    //    for (let i of rotationValues) {
//    //        if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
//    //            finalValue.innerHTML = `<p>Winner: ${i.value}</p>`;
//    //            spinBtn.disabled = false;
//    //            break;
//    //        }
//    //    }
//    //};

//    //// Spin logic
//    //let count = 0;
//    //let resultValue = 101;

//    //spinBtn.addEventListener("click", () => {
//    //    spinBtn.disabled = true;
//    //    finalValue.innerHTML = `<p>Spinning the wheel. Good luck!</p>`;
//    //    let randomDegree = Math.floor(Math.random() * 360);
//    //    let rotationInterval = window.setInterval(() => {
//    //        myChart.options.rotation = (myChart.options.rotation + resultValue) % 360;
//    //        myChart.update();
//    //        if (resultValue > 0) {
//    //            count += 1;
//    //            resultValue -= 5;
//    //        } else if (count > 15 && myChart.options.rotation >= randomDegree - 2 && myChart.options.rotation <= randomDegree + 2) {
//    //            valueGenerator(randomDegree);
//    //            clearInterval(rotationInterval);
//    //            count = 0;
//    //            resultValue = 101;
//    //        }
//    //    }, 10);
//    //});
//}
