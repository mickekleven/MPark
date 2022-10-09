using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using MPark.Api.Extensions;
using MPark.Shared.Dtos;
using MPark.Shared.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MPark.Api
{
    public static class MachinePark
    {

        [FunctionName("getengineparks")]
        public static async Task<ActionResult<IEnumerable<MachineDto>>> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "machinepark")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation($"Get collection of machine parks");

            string name = req.Query["name"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;

            string responseMessage = string.IsNullOrEmpty(name)
                ? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
                : $"Hello, {name}. This HTTP triggered function executed successfully.";

            var items = GetItems(20).OrderByDescending(n => n.Date);

            return new OkObjectResult(items);
        }


        [FunctionName("get")]
        public static async Task<ActionResult<IEnumerable<MachineDto>>> Get(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "machinepark/get/{id}")] HttpRequest req,
            [Table("machines", Connection = "AzureWebJobsStorage")] CloudTable machineTableGet,
            ILogger log, string id)
        {
            log.LogInformation($"Get collection from table storage");


            var retrieveOperation = TableOperation.Retrieve<MachineTableEntity>(Constants.PARTITION_KEY, id);
            var entity = await machineTableGet.ExecuteAsync(retrieveOperation);

            if (entity.Result == null) return new NotFoundResult();

            var result = entity.Result as MachineTableEntity;



            return new OkObjectResult(result.ConvertToDto());
        }


        [FunctionName("getall")]
        public static async Task<ActionResult<IEnumerable<MachineDto>>> GetAll(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "machinepark/getall")] HttpRequest req,
            [Table("machines", Connection = "AzureWebJobsStorage")] CloudTable machineTable,
            ILogger log)
        {
            log.LogInformation($"Get collection from table storage");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonConvert.DeserializeObject<MachineDto>(requestBody);

            var tblQuery = new TableQuery<MachineTableEntity>();
            var result = await machineTable.ExecuteQuerySegmentedAsync(tblQuery, null);



            var response = result.Select(TblMapper.ConvertToDto).ToList();


            return new OkObjectResult(response);
        }



        [FunctionName("insert")]
        public static async Task<IActionResult> Add(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "machinepark/insert")] HttpRequest req,
            [Table("machines", Connection = "AzureWebJobsStorage")] CloudTable machineTable,
            ILogger log)
        {
            log.LogInformation("Add machine park");


            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var insertItem = JsonConvert.DeserializeObject<MachineDto>(requestBody);

            if (insertItem is null || string.IsNullOrEmpty(insertItem.Country)) { return new BadRequestResult(); }

            var operation = TableOperation.InsertOrReplace(insertItem.ConvertToTable());

            var res = await machineTable.ExecuteAsync(operation);


            return new OkObjectResult(insertItem);
        }

        //toggleOnOffLine

        [FunctionName("update")]
        public static async Task<IActionResult> Update(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "machinepark/update/{id}")] HttpRequest req,
        [Table("machines", Connection = "AzureWebJobsStorage")] CloudTable machineTable,
        ILogger log, string id)
        {
            log.LogInformation("Update item");

            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var itemToUpdate = JsonConvert.DeserializeObject<MachineDto>(requestBody);

            if (itemToUpdate is null || string.IsNullOrEmpty(id)) return new BadRequestResult();

            var updItem = await GetItem(id, Constants.TABLE_STORAGE, machineTable);
            if (updItem is null) return new BadRequestResult();


            updItem.Country = itemToUpdate.Country;
            updItem.Online = itemToUpdate.Online;
            updItem.Location = itemToUpdate.Location;
            updItem.MachineType = itemToUpdate.MachineType;
            updItem.Name = itemToUpdate.Name;


            var opertionReplace = TableOperation.Replace(updItem);
            var updResult = await machineTable.ExecuteAsync(opertionReplace);

            return new NoContentResult();
        }



        [FunctionName("toggleonoffline")]
        public static async Task<IActionResult> ToggleOnOffLine(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "machinepark/ToggleOnOffLine/{id}")] HttpRequest req,
        [Table("machines", Connection = "AzureWebJobsStorage")] CloudTable machineTable,
        ILogger log, string id)
        {
            log.LogInformation("ToggleOnOffLine item");

            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var itemToUpdate = JsonConvert.DeserializeObject<MachineDto>(requestBody);

            if (itemToUpdate is null || string.IsNullOrEmpty(id)) return new BadRequestResult();

            var updItem = await GetItem(id, Constants.TABLE_STORAGE, machineTable);
            if (updItem is null) return new NotFoundResult();

            updItem.Online = itemToUpdate.Online;

            var opertionReplace = TableOperation.Replace(updItem);
            var updResult = await machineTable.ExecuteAsync(opertionReplace);

            return new NoContentResult();
        }

        [FunctionName("delete")]
        public static async Task<IActionResult> Delete(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "machinepark/delete/{id}")] HttpRequest req,
            [Table("machines", Connection = "AzureWebJobsStorage")] CloudTable machineTable,
            ILogger log, string id)
        {
            log.LogInformation("Delete item");

            var delItem = await GetItem(id, Constants.TABLE_STORAGE, machineTable);
            if (delItem is null) return new NotFoundResult();


            var opertionDelete = TableOperation.Delete(delItem);
            var updResult = await machineTable.ExecuteAsync(opertionDelete);

            return new NoContentResult();
        }





        [FunctionName("SeedData")]
        public static async Task<IActionResult> SeedData(
             [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Machingpark")] HttpRequest req,
             [Table("machine", Connection = "AzureWebJobsStorage")] CloudTable machineTable, ILogger log)
        {
            log.LogInformation("Add machine park");

            var items = GetItems(20);


            //var item = new Item { Text = createItem.Text };

            // await itemTable.AddAsync(item.ToTableEntity());

            //var operation = TableOperation.Insert(item.ToTableEntity());
            //var res = await itemTable.ExecuteAsync(operation);

            return new OkObjectResult("");


        }


        private static IEnumerable<MachineDto> GetItems(int nrOfItems = 10)
        {
            var rnd = new Random();

            List<MachineDto> items = new();
            MachineDto machine = null;

            var locations = new List<string> { "Stockholm", "Gävle", "Dalarna", "GöteBorg", "Uppsala" };
            var onlines = new List<bool> { true, false };


            for (int i = 0; i < nrOfItems; i++)
            {
                machine = new MachineDto
                {
                    Location = locations[rnd.Next(0, locations.Count)],
                    Country = "Sweden",
                    Date = DateTime.Now.AddDays(rnd.Next(-2, 10)),
                    Online = onlines[rnd.Next(onlines.Count)],
                    MachineType = $"Forecast censor{i}"
                };

                items.Add(machine);
            }

            return items;


        }

        private static void SaveToStore(IEnumerable<MachineDto> _items)
        {
            var json = JsonConvert.SerializeObject(_items);
        }



        private static async Task<MachineTableEntity> GetItem(string id, string partition, CloudTable machineTable)
        {
            var retrieveOperation = TableOperation.Retrieve<MachineTableEntity>(Constants.PARTITION_KEY, id);
            var entity = await machineTable.ExecuteAsync(retrieveOperation);

            if (entity.Result == null) { return default; }

            var result = entity.Result as MachineTableEntity;
            return result;
        }

    }



}
