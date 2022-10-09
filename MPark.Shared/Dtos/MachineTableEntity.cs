using Microsoft.Azure.Cosmos.Table;

namespace MPark.Shared.Dtos
{
    public class MachineTableEntity : TableEntity
    {
        public string Location { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public bool Online { get; set; } = false;
        public DateTime Date { get; set; } = DateTime.MinValue;
        public string MachineType { get; set; } = string.Empty;

    }
}


