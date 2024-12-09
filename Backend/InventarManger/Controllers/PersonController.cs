using InventarManger.Classes;
using InventarManger.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InventarManger.Classes;

namespace InventarManger.Controllers
{
    [Route("api/Person")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly PersonRepository repository = new PersonRepository();

        [HttpGet("GetAllPersons")]

        public IActionResult GetAllPersons()
        {
            var persons = repository.GetAllPersons();
            return Ok(persons);
        }

        [HttpPost("GivePersonItem")]
        public IActionResult GivePersonItem(int personId, int itemId)
        {
            var result = repository.GivePersonItem(personId, itemId);
            if (result)
            {
                return Ok(new { Message = "Item successfully given to person." });
            }
            else
            {
                return BadRequest(new { Message = "Failed to give item to person." });
            }
        }

        [HttpGet("GetPersonByitem")]
        public IActionResult GetPersonByitem(int itemId)
        {
            var person = repository.GetPersonByitem(itemId);
            return Ok(person);

        }

    }
}
