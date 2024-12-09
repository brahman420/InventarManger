using InventarManger.Classes;
using InventarManger.Repository;
using Microsoft.AspNetCore.Mvc;

namespace InventarManger.Controllers
{
    [ApiController]
    [Route("api/items")]
    public class ItemsController : ControllerBase
    {
        private readonly ItemsRepository repository = new ItemsRepository();

        // get all themes
        [HttpGet("themes")]
        public IActionResult GetAllThemes()
        {
            var themes = repository.GetAllThemes();
            return Ok(themes);
        }

        // find categories by theme
        [HttpGet("themes/categories")]
        public IActionResult GetCategoriesByTheme([FromQuery] int themeId)
        {
            var categories = repository.GetCategoriesByTheme(themeId);
            if (categories == null || !categories.Any())
            {
                return NotFound($"No categories found for theme ID {themeId}.");
            }
            return Ok(categories);
        }

        // used to get items by category
        [HttpGet("categories/items")]
        public IActionResult GetItemsByCategory([FromQuery] int categoryId)
        {
            var items = repository.GetItemsByCategory(categoryId);
            if (items == null || !items.Any())
            {
                return NotFound($"No items found for category ID {categoryId}.");
            }
            return Ok(items);
        }

        [HttpPost("add")]
        public IActionResult AddItem([FromBody] Item item, [FromQuery] int categoryId)
        {

            if (string.IsNullOrWhiteSpace(item.ProductName))
                return BadRequest("Product name is required.");

            if (categoryId <= 0)
                return BadRequest("Valid category ID is required.");


            var isAdded = repository.AddItem(item, categoryId);

            if (isAdded)
                return Ok("Item added successfully.");
            else
                return StatusCode(500, "Error adding the item.");
        }

        [HttpGet("GetItemsInUse")]
        public IActionResult GetItemsInUse()
        {
            var items = repository.GetItemsInUse();
            if (items == null || !items.Any())
            {
                return NotFound($"No items in use found for");
            }
            return Ok(items);
        }

        [HttpGet("GetItemInfo")]
        public IActionResult GetItemInfo([FromQuery] int itemId)
        {
            var item = repository.GetItemInfo(itemId);
            if (item == null)
            {
                return NotFound($"No item found for item ID {itemId}.");
            }
            var result = item.Select(t => new { CategoryName = t.CategoryName, ThemeName = t.ThemeName }).ToList();
            return Ok(result);
        }
        /*
    
        [HttpGet("ItemByPerson")]

        public IActionResult GetItemsByPerson([FromQuery] int personId)
        {
            var items = repository.GetItemByPerson(personId);
            if (items == null || !items.Any())
            {
                return NotFound($"No items found for person ID {personId}.");
            }
            return Ok(items);
        }
        */
    }

}
