using InventarManger.Classes;
using InventarManger.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InventarManger.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class LoginUser : ControllerBase
    {
        private readonly LoginRepository repository = new LoginRepository();

        [HttpPost("LoginUser")]
        public IActionResult Login([FromBody] User user)
        {
            if (user == null || string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Invalid username or password.");
            }

            bool loginSuccessful = repository.Login(user.Username, user.Password);

            if (loginSuccessful)
            {
                return Ok(new { Message = "Login successful!" });
            }
            else
            {
                return Unauthorized(new { Message = "Invalid username or password." });
            }
        }
    }
}
