# 🛡️ APSIT S.A.F.E.
**S**tudent **A**sset **F**inder & **E**xchange

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg?logo=mysql)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern, highly secure, and elegantly designed Lost & Found platform specifically tailored for the APSIT University College campus.

---

## 📖 Overview
**APSIT S.A.F.E** bridges the gap between campus security and students. Losing valuable items on a bustling university campus is stressful—and currently handled via outdated ledger books and confusing communication channels. S.A.F.E solves this entirely by digitizing the process with a sleek Dual-Portal (Student & Admin) interface driven by an automated QR-Certification Verification engine.

## ✨ Key Features
* 🔍 **Discovery Hub:** A beautiful, filtering-enabled public dashboard allowing students to quickly pinpoint reported lost/found items mapped across categorized Campus Zones.
* 🛡️ **Zero-Fraud Claim System:** Claimants must securely authenticate and provide descriptive 'Proof of Ownership', pending Admin Approval natively via the system.
* 🎫 **Automated QR-Code Verification System:** Upon claim approval, a highly secure hexadecimal token triggers a QR code mapped to the user. Admins can scan this directly through the Web Camera to register a successful handover.
* 👨‍⚖️ **Admin Command Dashboard:** Full control suite. Admins receive robust metric charts, claim arbitration queues, inventory category builders, and built-in HR reporting graphs.
* 🌗 **Aesthetic UI/UX Elements:** Micro-animations, spring-loaded components, gradient-meshed glassmorphism styling, and responsive cards utilizing `Framer Motion`.

## 🛠️ Technology Stack
### Frontend
* **React 18** (`react-router-dom`, context APIs)
* **Framer Motion** (For advanced, spring-physics powered 60fps animations)
* **Recharts** (Interactive pie, line, and bar infographics rendering for Admins)
* **HTML5-QRCode** (Native browser web-cam scanner plugin for admin pickups)

### Backend
* **Java Spring Boot** (JPA, Hibernate, Web)
* **Spring Security / JWT** (Robust cross-platform session tokenization auth)
* **MySQL Database** (Relational mappings, interconnected schemas for Items, Users, and Claims)
* **Lombok & ZXing** (Boilerplate reduction and native QR matrix generation from Java)

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18+)
* **Java 17+** (JDK)
* **Maven** (`mvn`)
* **MySQL** Server running at port `3306`

### 1️⃣ Database Setup
Create the MySQL database named `nakshetra`:
```sql
CREATE DATABASE nakshetra;
```

### 2️⃣ Start Backend Server
Navigate to the `backend` directory and run the Spring Boot server:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
*The backend API will run natively at `http://localhost:8080/api`*

### 3️⃣ Start Frontend Engine 
Navigate to the `frontend` directory and initialize React:
```bash
cd frontend
npm install
npm start
```
*The SPA will launch via Webpack at `http://localhost:3000`*

---

## 📸 Platform Screenshots
| Discovery Hub | Admin Dashboard |
| :---: | :---: |
| *(Add your screenshot here)* | *(Add your screenshot here)* |
| **Claim Item Wizard** | **Admin QR Verification** |
| *(Add your screenshot here)* | *(Add your screenshot here)* |

---

## 🔐 Credentials & Default Seed Data
The application automatically seeds database entities via `DataSeeder.java`. 

* **Admin Portal Login:** `admin@apsit.edu.in` | **Password:** `admin123`
* **Demo Student Login:** `ayyan@apsit.edu.in` | **Password:** `password123`

---

## 🤝 Contribution Guidelines
This project is officially engineered for the modern college campus structure. Feel free to open issues or submit Pull Requests for improvements and architectural upgrades.

---

> Crafted carefully to secure thousands of assets for students daily. Keep it S.A.F.E.
