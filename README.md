# Equiparenting API Documentation

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [Endpoints](#endpoints)
  - [Create User (Register)](#create-user-register)
  - [Login](#login)
  - [Create Member](#create-member)
  - [Get Member Data](#get-member-data)
  - [Get User Profile ](#get-user-profile)
  - [Update User Profile](#update-user-profile)
  - [Update User Password](#update-user-password)

# Introduction

This API provides functionality for managing Equiparenting application. It is built using Express.js, Sequelize for database interaction, and includes authentication and authorization features.

# Getting Started

## Prerequisites

- Node.js
- npm
- MySQL Database
- Sequelize CLI

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/RangkayoRasunaSaid/equiparenting-server.git
   ```

2. Navigate to the project directory:

   ```bash
   cd equiparenting-server
   ```

   Install dependencies:

   ```bash
   Copy code
   npm install
   ```

# Database-setup

1. Configure the database connection in config/config.json.

2. Run Sequelize migrations to create the database tables:

   ```bash
   npx sequelize-cli db:migrate
   ```

3. Seed the database with initial data:

   ```bash
   npx sequelize-cli db:seed:all
   ```

# Usage

1. Start the server:

   ```bash
   npm start
   ```

2. The application will be accessible at http://localhost:3000.

# Endpoints

## Create user register

- Endpoint : /register
- Method : POST
- Deskripsi : Endpoint ini digunakan untuk mendaftarkan pengguna baru ke dalam aplikasi Equiparenting.
- Request Body :

```json
{
  "username": "newuser",
  "password": "newpassword"
}
```

- Response :
  Sukses (Status Code: 201)

```json
{
  "message": "User created successfully"
}
```

Gagal (Status Code: 500)

```json
{
  "message": "Internal Server Error"
}
```

## Login

- Endpoint : /login
- Method : POST
- Deskripsi : Endpoint ini digunakan untuk login ke dalam aplikasi Equiparenting dan mendapatkan token JWT.
- Request Body :

```json
{
  "email": "existinguser@mail.com",
  "password": "existingpassword"
}
```

- Response :
  Sukses (Status Code: 200)

```json
{
  "token": "jwt_token_here"
}
```

Gagal (Status Code: 404)

```json
{
  message: "User not found"
}
```

Gagal (Status Code: 401)

```json
{
  message: "Invalid credentials"
}
```
## Create Member

- Endpoint : /members
- Method : POST
- Deskripsi : Endpoint ini digunakan untuk membuat member baru.
- Request Header
  - Authorization : jwt_token_here
- Request Body :

```json
{
  "name": "nama ayah",
  "member_role": "ayah"
}
```

- Response :
  Sukses (Status Code: 201)

```json
{
  message: "Member created successfully"
}
```

Gagal (Status Code: 500)

```json
{
  message: "Internal Server Error"
}
```

Note: untuk saat ini belum ada penanganan untuk upload avatar
## Get Member Data

- Endpoint : /members
- Method : GET
- Deskripsi : Endpoint ini digunakan untuk mendapatkan data semua member beserta scorenya.
- Request Header
  - Authorization : jwt_token_here
- Response :
  Sukses (Status Code: 200)

```json
{
    "members": [
        {
            "name": "nama ayah",
            "member_role": "ayah",
            "avatar": null,
            "Score": null,
            "score": 0
        },
        ..... data member lain
    ]
}
```
Note : contoh diatas response jika member belum memiliki score
Gagal (Status Code: 500)

```json
{
  message: "Internal Server Error"
}
```

## Get User Profile

- Endpoint : /profile
- Method : GET
- Deskripsi : Endpoint ini digunakan untuk mendapatkan data username dan picture profile user
- Request Header
  - Authorization : jwt_token_here
- Response :
  Sukses (Status Code: 200)

```json
{
    "username": "Naziilah",
    "avatar": null
}
```
Note : contoh diatas adalah response jika user belum mengupload profile picture

Gagal (Status Code: 404)

```json
{
  message: "User not found"
}
```

Gagal (Status Code: 500)

```json
{
  message: "Internal server error"
}
```
## Update User Profile

- Endpoint : /update-profile
- Method : POST
- Deskripsi : Endpoint ini digunakan untuk mengubah username user
- Request Header
  - Authorization : jwt_token_here
- Request Body :

```json
{
  "username": "username anda",
}
```

- Response :
  Sukses (Status Code: 200)

```json
{
  "message": "User profile updated successfully"
}
```

Gagal (Status Code: 404)

```json
{
  message: "User not found"
}
```

Gagal (Status Code: 500)

```json
{
  message: "Internal server error"
}
```

Note: untuk saat ini belum ada penanganan untuk upload profile picture

## Update User Password

- Endpoint : /update-password
- Method : POST
- Deskripsi : Endpoint ini digunakan untuk mengubah password user
- Request Header
  - Authorization : jwt_token_here
- Request Body :

```json
{
  "oldPassword": "passwordLama",
  "newPassword": "passwordBaru"
}
```

- Response :
  Sukses (Status Code: 200)

```json
{
  "message": "Password updated successfully"
}
```

Gagal (Status Code: 404)

```json
{
  message: "User not found"
}
```

Gagal (Status Code: 400)

```json
{
  message: "Invalid old password"
}
```

Gagal (Status Code: 500)

```json
{
  message: "Internal server error"
}
```
