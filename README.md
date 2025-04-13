HerbaLog

HerbaLog is a web application designed for Herbalife distributors to manage their product inventory, prices, and promotions. It includes a clear separation of roles between regular users and admins, enabling fine-grained control over features like stock management, product visibility, and reporting.

## 💡 Planned Features

- Register consumed and given-away products
- Admin interface to manage product and price history
- Stock tracking with price history per entry (FIFO logic)
- Email login confirmation and password reset
- Quarterly reporting with PDF export
- Role-based access control

## ✨ Features

- Authentication and Authorization

## 🚀 Tech Stack

**Frontend**:
- React (Vite + TypeScript)
- Tailwind CSS

**Backend**:
- Node.js
- Express
- Drizzle ORM
- PostgreSQL
- Zod
  
**Tooling**:
- Docker & Docker Compose

## 📆 Getting Started

### Prerequisites
Node 20
npm
Docker + Docker Compose

### Installation

```bash
git clone https://github.com/juantreses/HerbaLog.git
cd HerbaLog
```

Copy the .env.dist file to .env and fill in the required variables.

### Start Development Environment

```bash
docker-compose up --build
```

### Apply Migrations

docker exec -it herbalog npm run db:push

## 📅 Project Structure

HerbaLog/
├── client/             # React frontend
├── server/             # Node.js backend (Express)
├── shared/             # Shared types and constants (e.g., roles)
├── docker-compose.yml  # Development container orchestration
├── .env.dist           # Environment variable template
└── README.md

✉️ Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

📄 License

MIT
