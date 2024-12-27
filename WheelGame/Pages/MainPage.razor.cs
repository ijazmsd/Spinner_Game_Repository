using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using WheelGame.Models;

namespace RummyRoulette.Pages
{
    public partial class MainPage
    {
        private List<Game> Games = new();
        private Game SelectedGame;
        private string ErrorMessage;
        private int RotationAngle = 0;

        protected override async Task OnInitializedAsync()
        {
            try
            {
                var jsonData = await System.IO.File.ReadAllTextAsync("wwwroot/rummyGames-1.json");
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                Games = JsonSerializer.Deserialize<List<Game>>(jsonData, options);
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Error loading games: {ex.Message}";
            }
        }

        private async Task SpinWheel()
        {
            if (Games == null || Games.Count == 0) return;

            var random = new Random();
            var randomRotation = random.Next(720, 1080); // Random spin amount for smoother motion
            RotationAngle += randomRotation;
            StateHasChanged();

            await Task.Delay(5000); // Animation duration

            var sliceAngle = 360 / Games.Count;
            var adjustedAngle = (360 - (RotationAngle % 360) + 90) % 360;
            var selectedIndex = (int)(adjustedAngle / sliceAngle) % Games.Count;
            SelectedGame = Games[selectedIndex];

            StateHasChanged();
        }

        private string GetSliceColor(int index)
        {
            var colors = new[] { "#FF5733", "#33FF57", "#3357FF", "#FFD700", "#FF33A6", "#33FFF5" };
            return colors[index % colors.Length];
        }

        private string GetPathData(int index)
        {
            var totalSlices = Games.Count;
            var anglePerSlice = 360.0 / totalSlices;
            var startAngle = anglePerSlice * index;
            var endAngle = anglePerSlice * (index + 1);
            return DescribeArc(0, 0, 200, startAngle, endAngle);
        }

        private MarkupString GetVerticalTextElement(int index, string text)
        {
            var totalSlices = Games.Count;
            var sliceAngle = 360.0 / totalSlices;
            var startAngle = sliceAngle * index;
            var rotation = startAngle + sliceAngle / 2;
            var textRadius = 160; // Position text closer to the center

            return new MarkupString($@"
            <text x=""0"" y=""-{textRadius}"" fill=""#fff"" font-size=""10"" 
                  text-anchor=""middle"" transform=""rotate({rotation})"">
                {InsertVerticalText(text)}
            </text>");
        }

        private string DescribeArc(double x, double y, double radius, double startAngle, double endAngle)
        {
            var start = PolarToCartesian(x, y, radius, endAngle);
            var end = PolarToCartesian(x, y, radius, startAngle);

            var largeArcFlag = (endAngle - startAngle) <= 180 ? "0" : "1";

            return $"M {start.X} {start.Y} A {radius} {radius} 0 {largeArcFlag} 0 {end.X} {end.Y} L 0 0";
        }

        private (double X, double Y) PolarToCartesian(double x, double y, double radius, double angle)
        {
            var radians = angle * Math.PI / 180.0;
            return (x + radius * Math.Cos(radians), y - radius * Math.Sin(radians));
        }

        private string InsertVerticalText(string text)
        {
            return string.Join("", text.Select(c => $"<tspan x=\"0\" dy=\"1.2em\">{c}</tspan>"));
        }
    }
}
