using System;

namespace MPark.Shared.Dtos
{
    public class MachineDto
    {
        public string Id { get; set; } = Guid.NewGuid().ToString("N");
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public bool Online { get; set; } = false;
        public DateTime Date { get; set; } = DateTime.MinValue;
        public string MachineType { get; set; } = string.Empty;

    }
}


