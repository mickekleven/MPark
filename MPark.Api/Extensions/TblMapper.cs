using MPark.Shared.Dtos;

namespace MPark.Api.Extensions
{
    public static class TblMapper
    {
        public static MachineTableEntity ConvertToTable(this MachineDto dto)
        {
            return new MachineTableEntity
            {
                Country = dto.Country,
                Date = dto.Date,
                Name = dto.Name,
                Location = dto.Location,
                MachineType = dto.MachineType,
                Online = dto.Online,
                PartitionKey = "machinePart",
                RowKey = dto.Id.ToString(),
            };
        }

        public static MachineDto ConvertToDto(this MachineTableEntity entity)
        {
            return new MachineDto
            {
                Country = entity.Country,
                Date = entity.Date,
                Name = entity.Name,
                Location = entity.Location,
                MachineType = entity.MachineType,
                Online = entity.Online,
                Id = entity.RowKey,
            };
        }
    }
}
