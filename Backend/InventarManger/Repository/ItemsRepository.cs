using System.Data;
using InventarManger.Classes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Data.SqlClient;

namespace InventarManger.Repository
{
    public class ItemsRepository
    {
        private readonly string connectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=InventarDB;Integrated Security=True;";

        public List<Theme> GetAllThemes()
        {
            var themes = new List<Theme>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string query = "SELECT ThemeID, ThemeName FROM Theme";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            themes.Add(new Theme
                            {
                                ThemeID = reader.GetInt32(reader.GetOrdinal("ThemeID")),
                                ThemeName = reader.GetString(reader.GetOrdinal("ThemeName"))
                            });
                        }
                    }
                }
            }

            return themes;
        }

        public List<Category> GetCategoriesByTheme(int themeId)
        {
            var categories = new List<Category>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string query = "SELECT CategoryID, CategoryName FROM Category WHERE ThemeID = @ThemeID";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@ThemeID", themeId);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            categories.Add(new Category
                            {
                                CategoryID = reader.GetInt32(reader.GetOrdinal("CategoryID")),
                                CategoryName = reader.GetString(reader.GetOrdinal("CategoryName"))
                            });
                        }
                    }
                }
            }

            return categories;
        }

        public List<Item> GetItemsByCategory(int categoryId)
        {
            var items = new List<Item>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();


                string query = "SELECT ItemID, ProductName FROM Items WHERE CategoryID = @CategoryID AND PersonID IS NULL";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@CategoryID", categoryId);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            items.Add(new Item
                            {
                                ItemID = reader.GetInt32(reader.GetOrdinal("ItemID")),
                                ProductName = reader.GetString(reader.GetOrdinal("ProductName"))
                            });
                        }
                    }
                }
            }

            return items;
        }

        public bool AddItem(Item item, int categoryId)
        {
            // Construct SQL query to insert without ItemID
            var query = $"INSERT INTO Items (ProductName, CategoryId) VALUES ('{item.ProductName}', {categoryId})";

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (var command = new SqlCommand(query, connection))
                {
                    var rowsAffected = command.ExecuteNonQuery();
                    return rowsAffected > 0;
                }
            }

        }
        public List<Item> GetItemsInUse()
        {
            var items = new List<Item>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string query = "SELECT ItemID, ProductName FROM Items WHERE PersonID IS NOT NULL";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            items.Add(new Item
                            {
                                ItemID = reader.GetInt32(reader.GetOrdinal("ItemID")),
                                ProductName = reader.GetString(reader.GetOrdinal("ProductName"))
                            });
                        }
                    }
                }
            }

            return items;
        }
        public List<(string CategoryName, string ThemeName)> GetItemInfo(int itemId)
        {
            var item = new List<(string CategoryName, string ThemeName)>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string query = @"
                    SELECT c.CategoryName, t.ThemeName
                    FROM Items i
                    JOIN Category c ON i.CategoryID = c.CategoryID
                    JOIN Theme t ON c.ThemeID = t.ThemeID
                    WHERE i.ItemID = @ItemID";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@ItemID", itemId);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var categoryName = reader.GetString(reader.GetOrdinal("CategoryName"));
                            var themeName = reader.GetString(reader.GetOrdinal("ThemeName"));
                            item.Add((categoryName, themeName));
                        }
                    }
                }
            }

            return item;
        }

        
    }
}
