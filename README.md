# VetTrack

VetTrack is a web application for veterinary clinics to manage animal records, owners, and visit histories. Built with Node.js, Express, MySQL, and EJS, VetTrack provides a simple and modern interface for tracking animals and their medical visits.

---

## Features

- **User Authentication:** Secure login for clinic staff.
- **Dashboard:** View all animals in the database with search functionality.
- **Animal Management:** Add, edit, and view animal records.
- **Owner Management:** Add and view animal owners.
- **Visit History:** Track and view visit history for each animal.
- **Appointment Scheduling:** Schedule and view upcoming appointments.
- **Fun Facts & Images:** See random animal facts and images on the homepage.
- **Responsive Design:** Modern, mobile-friendly UI using Bootstrap.

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, Bootstrap 5, Custom CSS
- **Database:** MySQL
- **Session Management:** express-session
- **Authentication:** bcrypt or bcryptjs

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MySQL

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/VetTrack.git
    cd VetTrack
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure the database:**
    - Create a MySQL database (e.g., `vettrack`).
    - Import the provided SQL schema or use the following tables:
      ```sql
      CREATE TABLE owner (
        owner_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        address VARCHAR(255) NOT NULL,
        phone_number VARCHAR(16) NOT NULL
      );

      CREATE TABLE animal (
        animal_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) DEFAULT NULL,
        breed VARCHAR(100) DEFAULT NULL,
        dob DATE DEFAULT NULL,
        weight INT DEFAULT NULL,
        owner_id INT NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES owner(owner_id)
      );

      CREATE TABLE user (
        user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        password_hash VARCHAR(155) NOT NULL
      );

      CREATE TABLE visit (
        visit_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        animal_id INT NOT NULL,
        visit_date DATE NOT NULL,
        reason VARCHAR(256) NOT NULL,
        FOREIGN KEY (animal_id) REFERENCES animal(animal_id)
      );
      ```
    - Update your database connection settings in [index.mjs](http://_vscodecontentref_/0).

4. **Run the application:**
    ```bash
    npm start
    ```
    or
    ```bash
    node index.mjs
    ```

5. **Access the app:**
    - Open your browser and go to `http://localhost:3000`

