using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace RummyRoulette.Pages
{
    public partial class Index
    {
        [Inject]
        public IJSRuntime jsRuntime { get; set; }

        protected override async Task  OnAfterRenderAsync(bool firstRender)
        {
            await jsRuntime.InvokeVoidAsync("MyFunc");
        }
    }
}