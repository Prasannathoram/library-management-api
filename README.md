### Overview

This project implements a complete REST API for managing books, members, borrowing transactions, and fines in a library system. It includes full CRUD operations, state-machine logic for book statuses, overdue handling, fine calculation, rule enforcement, and database integrity using MySQL.



### Setup Instructions



1\. Install Node.js and MySQL on your system.





2\. Create a project folder and clone your repository into it.





3\. Open the project folder in VS Code.





4\. Open the terminal and run the command:

npm install





5\. Configure the database connection in src/config/db.js with your MySQL username, password, and database name.





6\. Start the server using the command:

node server.js





7\. The API will run on:

http://localhost:3000







### Database Setup

Create the database first:

CREATE DATABASE library\_db;

USE library\_db;



Books Table

CREATE TABLE books (

id INT AUTO\_INCREMENT PRIMARY KEY,

title VARCHAR(255) NOT NULL,

author VARCHAR(255) NOT NULL,

category VARCHAR(100),

status ENUM('available', 'borrowed', 'reserved', 'maintenance') DEFAULT 'available',

total\_copies INT DEFAULT 1,

available\_copies INT DEFAULT 1

);



Members Table

CREATE TABLE members (

id INT AUTO\_INCREMENT PRIMARY KEY,

name VARCHAR(255) NOT NULL,

email VARCHAR(255) NOT NULL UNIQUE,

status ENUM('active', 'suspended') DEFAULT 'active',

created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP

);



Transactions Table

CREATE TABLE transactions (

id INT AUTO\_INCREMENT PRIMARY KEY,

member\_id INT,

book\_id INT,

status ENUM('borrowed', 'returned', 'overdue') DEFAULT 'borrowed',

borrowed\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,

due\_date DATE,

returned\_at TIMESTAMP NULL,

FOREIGN KEY (member\_id) REFERENCES members(id),

FOREIGN KEY (book\_id) REFERENCES books(id)

);



Fines Table

CREATE TABLE fines (

id INT AUTO\_INCREMENT PRIMARY KEY,

member\_id INT,

transaction\_id INT,

amount DECIMAL(10,2),

paid\_at TIMESTAMP NULL,

FOREIGN KEY (member\_id) REFERENCES members(id),

FOREIGN KEY (transaction\_id) REFERENCES transactions(id)

);



### API Documentation

Books Endpoints

POST /books Adds a new book

GET /books Retrieves all books

GET /books/:id Retrieves a specific book

PUT /books/:id Updates book details

DELETE /books/:id Deletes a book

GET /books/available Lists only available books



Members Endpoints

POST /members Adds a new member

GET /members Retrieves all members

GET /members/:id Retrieves a single member

GET /members/:id/borrowed Lists all books borrowed by a member

PUT /members/:id Updates a member

DELETE /members/:id Deletes a member



Transactions Endpoints

POST /transactions/borrow Borrow a book

POST /transactions/return Return a book

GET /transactions/overdue List all overdue transactions



Fines Endpoints

POST /fines/pay Marks a fine as paid



### Database Schema (Text Representation)

members → transactions → books

transactions → fines

A member can have multiple transactions.

A book can appear in multiple transactions.

A fine belongs to one member and one transaction.



### State-Machine Logic

Book Status Flow

available → borrowed → returned → available

borrowed → overdue

reserved → borrowed

maintenance → available



Transaction States

borrowed: book taken

returned: book given back

overdue: due date passed without return



### Business Rule Enforcement

A member can borrow a maximum of 3 books at a time.

A member becomes suspended if they have 3 overdue books.

A book cannot be borrowed if no available copies remain.

A fine must be cleared before a member can borrow again.

Book status always updates correctly during borrowing and returning.



### Testing Instructions

Use Postman or Thunder Client in VS Code to test all API endpoints.

A Postman collection file is included in the repository for easy testing.



### Expected Outcome

A fully functional REST API with correct CRUD operations.

Accurate state management for books.

Correct fine calculation and overdue detection.

Proper rule enforcement based on member history.

Clean architecture with controllers, services, routes, and database modules.

Endpoints return correct responses and error messages.

