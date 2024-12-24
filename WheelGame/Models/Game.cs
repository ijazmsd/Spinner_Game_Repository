namespace WheelGame.Models
{
    public class Game
    {
        public string Uuid { get; set; }
        public string Title { get; set; }
        public List<string> OtherNames { get; set; }
        public List<string> Category { get; set; }
        public List<int> Players { get; set; }
        public string Icon { get; set; }
        public List<string> Videos { get; set; }
        public List<string> Pictures { get; set; }
        public string Description { get; set; }
        public string InstructionsUrl { get; set; }
        public List<string> Equipment { get; set; }
        public string CountryOfOrigin { get; set; }
        public string BackgroundColor { get; set; }
        public string TextColor { get; set; }
        public int MinAge { get; set; }
        public List<string> SimilarTo { get; set; }
    }
}
