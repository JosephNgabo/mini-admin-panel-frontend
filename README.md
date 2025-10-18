
### **Mini Admin Panel — Frontend**, 

##### This is the frontend application of Mini Admin Panel,which is application for managing users(CRUD Operation), viewing analytics, handling cryptography, and exporting data.
---
###  Features Implemented

###  **1. User Management**

* Create, update, delete, and list users.
* Displays user **status**, **creation date**, and **email**.
* Backend integration with **PostgreSQL** for data persistence.

---

### **2. Analytics**

* Interactive chart visualizing **user creation trends** over the last 7 days.
* Built with **Recharts** and **React Query** for real-time updates.
* Dynamic insights into user growth and engagement.

---

### **3. Cryptography**

* Email hashes generated with **SHA-384**.
* Each user is digitally signed using **RSA-2048** keypair.
* Frontend validates signatures before displaying user data in the table.
* Only users with validated signatures are listed in the table.
---

### 🧾 **4. Protocol Buffer Integration**

* Fetches and decodes `/users/export` data in **Protobuf** format.
* Efficient binary data handling using `protobuf.js`.
* Displays verified users in a structured, easy-to-read table.
---

## ⚙️ Tech Stack

| Category               | Technology                     |
| ---------------------- | ------------------------------ |
| **Frontend Framework** | React + TypeScript + Vite      |
| **UI Library**         | Tailwind CSS                   |
| **State & Data**       | React Query, Axios             |
| **Charting**           | Recharts                       |
| **Data Serialization** | Protocol Buffers (protobuf.js) |
| **Crypto Algorithms**  | SHA-384, RSA-2048              |
| **Backend Database**   | PostgreSQL                     |
| **Containerization**   | Docker, Docker Compose         |
---
## 🖼️ Screenshots

| Section                           | Preview                    |
| --------------------------------- | -------------------------- |
| **Dashboard Overview**            |<img width="1512" height="823" alt="Screenshot 2025-10-18 at 16 37 27" src="https://github.com/user-attachments/assets/5df014ec-645f-49c1-aab6-efb66ad259b2" /> |
| **User Management (CRUD)**        | <img width="1512" height="821" alt="Screenshot 2025-10-18 at 16 39 05" src="https://github.com/user-attachments/assets/d4f4cede-49ea-48d3-ab5b-56ffcb9001ec" />
**Analytics (User Charts)**        | <img width="1512" height="823" alt="Screenshot 2025-10-18 at 16 42 04" src="https://github.com/user-attachments/assets/492eae2e-8d64-42b3-9cd7-ceb22983a330" />
| **Protobuf Data Export**          | <img width="1490" height="775" alt="Screenshot 2025-10-18 at 16 48 51" src="https://github.com/user-attachments/assets/50f39d19-1358-4b06-b454-cbe8c2133db7" />
 **List Protocol Buffer Decoded Users** |<img width="1512" height="712" alt="Screenshot 2025-10-18 at 16 49 49" src="https://github.com/user-attachments/assets/9e0c40ec-dfba-4e08-b3b4-3b33c36112d5" />
---
## Installation

### Prerequisites

* Node.js 18+
* npm (or yarn)

### Clone the repository
```bash
git clone (https://github.com/JosephNgabo/mini-admin-panel-frontend.git)
cd mini-admin-panel-frontend
```
### Install dependencies

```bash
npm install
npm run dev
```
---

## 🧭 Steps to Run Locally

### 1. Start the backend

Ensure your backend (Node.js/Express + PostgreSQL) is running:

```bash
http://localhost:3026
```

### 2. Start the frontend

```bash
npm run dev
```

### 3. Access the app

Visit:

```
http://localhost:3000
```
---

## 🐳 Docker Setup

### Build and run the container

```bash
docker build -t mini-admin-frontend .
docker run -d -p 3000:80 mini-admin-frontend
```

If using `docker-compose` with backend and database:

```yaml
environment:
  - VITE_API_URL=http://mini-admin-backend:3026
```
---


##  Author

**Joseph Ntwali**

Mini Admin Panel — Frontend Implementation
