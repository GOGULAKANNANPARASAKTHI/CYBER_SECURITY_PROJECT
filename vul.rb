require 'sqlite3'
require 'yaml'

# Vulnerability 1: SQL Injection
def find_user(username)
  db = SQLite3::Database.new("test.db")
  query = "SELECT * FROM users WHERE username = '#{username}'"
  results = db.execute(query)
  puts "User found: #{results}"
end

# Vulnerability 2: Command Injection
def run_command(user_input)
  system("ls #{user_input}")
end

# Vulnerability 3: Insecure Deserialization
def load_user_data(serialized_data)
  user_data = YAML.load(serialized_data)
  puts "User data loaded: #{user_data}"
end

# Example usage:

# SQL Injection
puts "Enter a username to search:"
username = gets.chomp
find_user(username)

# Command Injection
puts "Enter a directory to list:"
directory = gets.chomp
run_command(directory)

# Insecure Deserialization
puts "Enter serialized user data:"
serialized_data = gets.chomp
load_user_data(serialized_data)
