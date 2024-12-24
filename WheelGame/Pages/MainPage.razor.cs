using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using System.Net.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.Web.Virtualization;
using Microsoft.JSInterop;
using RummyRoulette;
using RummyRoulette.Shared;
using System.Text.Json;
using WheelGame.Models;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic;
using System.IO;
using System.Security.Cryptography.Xml;

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

            // Generate a random rotation amount
            var random = new Random();
            var randomRotation = random.Next(720, 1080); // Random spin amount for smoother motion

            // Update rotation angle for animation
            RotationAngle += randomRotation;

            // Trigger UI update to start the spin animation
            StateHasChanged();

            // Wait for the animation to complete (5 seconds for the spin)
            await Task.Delay(2000);

            // Calculate the selected game based on the final angle
            var sliceAngle = 360 / Games.Count;
            var adjustedAngle = (360 - (RotationAngle % 360) + 90) % 360; // Adjust for the arrow's top position
            var selectedIndex = (int)(adjustedAngle / sliceAngle) % Games.Count;
            SelectedGame = Games[selectedIndex];

            // Update the UI to show the result
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

            // Adjusting the arc radius to match the wheel's radius (250px)
            return DescribeArc(0, 0, 250, startAngle, endAngle); // 250 is the radius of the wheel
        }

        private MarkupString GetVerticalTextElement(int index, string text)
        {
            var totalSlices = Games.Count;
            var sliceAngle = 360.0 / totalSlices;
            var startAngle = sliceAngle * index; // Start angle of the slice
            var rotation = startAngle + sliceAngle / 1; // Rotate to the center of the slice
            var textRadius = 250; // Adjust distance from the center

            return new MarkupString($@"
            <text x=""{index}"" y=""-{textRadius}"" fill=""#fff"" font-size=""07"" 
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
            // Inserts each character in a vertical format with a <tspan>
            return string.Join("", text.Select(c => $"<tspan x=\"2\" dy=\"1.2em\">{c}</tspan>"));
        }



    }
}