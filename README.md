# ECommerceQuest

This repository contains a complete E-Commerce application, featuring a **.NET API** backend and an **Angular** frontend.

Follow these step-by-step instructions to set up the environment, restore the database, and run the application locally.

## Prerequisites

Ensure you have the following tools installed on your local machine:

- [.NET SDK](https://dotnet.microsoft.com/download) (compatible with the API project version, e.g., **.NET 10.0**)
- [Node.js](https://nodejs.org/) (includes `npm`)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (Express or Developer edition)
- SQL Server Management Studio (SSMS) or Azure Data Studio

---

## 1. Restore the Database

The backend connects to a SQL Server database named `ECommerceQuest`. You need to restore it from the provided backup file.

1. Open **SQL Server Management Studio (SSMS)** and connect to your local SQL Server instance (e.g., `localhost` or `.\SQLEXPRESS`).
2. Right-click on **Databases** in Object Explorer and select **Restore Database...**.
3. Select **Device** as the source, click the `...` button, and browse to the backup file included in this repository:
   - `db_backup.bak`
4. Make sure the **Destination** database name is set to: `ECommerceQuest`.
5. Click **OK** to restore the database.

**Optional:** If your SQL Server instance is not `localhost` / `.\SQLEXPRESS`, update the `DefaultConnection` connection string inside:
- `ECommerceQuestAPI/ECommerceQuest.API/appsettings.json`

---

## 2. Run the .NET Backend

1. Open a terminal / command prompt.
2. Navigate to the backend project directory:
   ```bash
   cd ECommerceQuestAPI/ECommerceQuest.API
   ```
3. Restore the required .NET dependencies:
   ```bash
   dotnet restore
   ```
4. Start the API application:
   ```bash
   dotnet run
   ```

The backend API should now be running. Check the terminal output for the exact URL (usually something like `http://localhost:<port>` or `https://localhost:<port>`).

---

## 3. Start the Angular Frontend (HTTP)

1. Open a **new** terminal window (keep the backend terminal running).
2. Navigate to the frontend project directory:
   ```bash
   cd ECommerceQuestUI
   ```
3. Install the required Node.js dependencies:
   ```bash
   npm install
   ```
4. Start the Angular development server (**HTTP**):
   ```bash
   npm start
   ```
5. Open your web browser and navigate to the frontend application at:
   - **http://localhost:4200/**

> Note: When using `ng serve` (the default `npm start`), Angular runs over **HTTP** by default (not HTTPS).

---
