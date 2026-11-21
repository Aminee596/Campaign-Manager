# Campaign Manager — Vaccination Campaign Management Platform

A web application for managing vaccination campaigns in the context of occupational medicine, developed for **SRM-FM** (Société Régionale Multiservices Fès-Meknès).

It replaces manual Excel-based tracking with a centralized system that handles vaccination campaigns, targeted employees, consent collection, vaccination records, and statistical dashboards — with role-based access and data partitioning by division (pôle).

---

## Features

- **Campaign management** — create, track, and run vaccination campaigns through their full lifecycle (creation → targeting → consent → vaccination → closure).
- **Collaborator directory** — manage the list of employees targeted by campaigns.
- **User management** — staff accounts with roles and pôle assignments.
- **Vaccination workflow** — record consent, vaccination, and doses; campaigns can only be closed once no collaborator remains pending ("en instance").
- **Dashboards** — vaccination and consent rates, per-campaign breakdowns, and charts.
- **Role-based access** — Administrator, Doctor/Nurse, HR data-entry agent, and HR consultant, each with their own permissions.
- **Pôle partitioning** — users only access data from their own division; enforced server-side.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 13 (PHP 8.4) |
| Frontend | React (TypeScript) via Inertia.js |
| Database | MySQL |
| Charts | Recharts |
| Styling | Tailwind CSS |

---

## Requirements

- PHP 8.4+
- Composer
- Node.js & npm
- MySQL

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/Aminee596/Campaign-Manager.git
cd Campaign-Manager

# 2. Install backend dependencies
composer install

# 3. Install frontend dependencies
npm install

# 4. Set up the environment file
cp .env.example .env
php artisan key:generate
```

Then configure your database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vaccination
DB_USERNAME=root
DB_PASSWORD=
```

Create the database, then run the migrations and seeders:

```bash
php artisan migrate --seed
```

---

## Running the app

```bash
composer run dev
```

This starts the Laravel server and the Vite/React dev server together. The app is then available at `http://localhost:8000`.

---

## Roles

| Role | Permissions |
|------|-------------|
| **Administrator** | Manages users and collaborators; full read access, no medical actions |
| **Doctor / Nurse** | Creates and runs campaigns, records consent and vaccinations |
| **HR data-entry agent** | Manages the collaborator directory |
| **HR consultant** | Views dashboards |

> Collaborators (employees) do **not** log in — they are records managed by staff.

---

## Data Model

The application is built around six entities:

- **Pole** — organizational division (Meknès, Fès, Taza)
- **Collaborator** — an employee targeted for vaccination
- **User** — a staff member with a role and a pôle
- **Campaign** — a vaccination campaign tied to a pôle
- **Participation** — a collaborator's involvement in one campaign (status, consent, visit date)
- **Dose** — a dose administered within a participation

The **Participation** entity is central: it carries each collaborator's status (`en_instance`, `vaccine`, `non_vaccine`) within a specific campaign.

---

## Author

**EL AMRANI Ahmed Amine** — 1st year end project, AIAC (Académie Internationale Mohammed VI de l'Aviation Civile), 2025–2026.
