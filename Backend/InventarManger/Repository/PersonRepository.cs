using InventarManger.Classes;
using Microsoft.Data.SqlClient;

namespace InventarManger.Repository
{
    public class PersonRepository
    {
        private readonly string connectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=InventarDB;Integrated Security=True;";

        public List<Person> GetAllPersons() 
        { 
            var persons = new List<Person>();

            string query = "SELECT PersonID, Name, Email FROM Person";

            using (var connection = new SqlConnection(connectionString)) 
            {
                connection.Open();

                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            persons.Add(new Person
                            {
                                PersonID = reader.GetInt32(reader.GetOrdinal("PersonID")),
                                Name = reader.GetString(reader.GetOrdinal("Name")),
                                Email = reader.GetString(reader.GetOrdinal("Email"))
                            });
                        }
                    }
                }
            }

            return persons;
        }

        public bool GivePersonItem(int personId, int itemId)
        {
            string query = @"
                UPDATE Items
                SET PersonID = @PersonID
                WHERE ItemID = @ItemID;
            ";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@PersonID", personId);
                command.Parameters.AddWithValue("@ItemID", itemId);

                connection.Open();
                int result = command.ExecuteNonQuery();

                return result > 0;
            }
        }

        public Person GetPersonByitem(int itemId)
        {
            string query = @"
                SELECT Person.PersonID, Person.Name, Person.Email
                FROM Person
                JOIN Items ON Person.PersonID = Items.PersonID
                WHERE Items.ItemID = @ItemID;";

            Person person = null;

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@ItemID", itemId);

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            person = new Person
                            {
                                PersonID = reader.GetInt32(reader.GetOrdinal("PersonID")),
                                Name = reader.GetString(reader.GetOrdinal("Name")),
                                Email = reader.GetString(reader.GetOrdinal("Email"))
                            };
                        }
                    }
                }
            }

            return person;
        }
    }
}
