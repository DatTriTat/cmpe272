# CMPE 272 – FEDBRIDGE  
**A Platform for Reskilling Laid-Off Federal Employees for Private Sector Careers**

---

## 🚧 Problem Statement

Laid-off federal employees often face significant barriers when transitioning into private-sector roles. These include:

- Misalignment in job expectations and required skills  
- Difficulty translating federal experience and clearances into private-sector value  
- Bureaucratic communication styles that don’t align with corporate culture  
- Lack of tailored resources to guide career pivoting and upskilling  

---

## 💡 Solution

**FEDBRIDGE** is a digital reskilling and career transition platform designed specifically for former federal employees.  
By leveraging AI and real-time labor market data, it:

- Translates government-specific roles and competencies into private-sector job equivalents  
- Recommends targeted learning paths using top e-learning platforms  
- Offers AI-powered job suggestions and interview prep  
- Facilitates mentorship through a federal alumni network  

---

## 🧱 Architecture & Tech Stack

### 🔐 Frontend  
- **Language:** TypeScript  
- **Framework:** React  
- **Styling:** Tailwind CSS  
- **UI Library:** HeroUI  

### ⚙️ Backend  
- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Authentication:** Firebase Auth  
- **Database:** MongoDB Atlas (Cloud-hosted NoSQL DB)  

### 🧠 AI Integration  
- **Framework:** Langchain  
- **Model Provider:** OpenAI GPT-4  
- **Use Cases:**  
  - Translating federal job experience into private-sector equivalents  
  - Personalized job and course recommendations  
  - AI-driven interview practice and communication coaching  

### ☁️ Deployment & DevOps  
- **Cloud Provider:** Google Cloud Platform (GCP)  
- **Containerization:** Docker  
- **Orchestration:** Kubernetes Engine  
- **CI/CD:** GitHub Actions  

### 🧩 External APIs  
- **APIFY:** Online course scraping (e.g., Udemy, Coursera)  
- **AFFINDA:** Resume parsing and keyword extraction  
- **RapidAPI:** Job listings and labor market analytics  

---

## 🗂 Sample MongoDB Schema

```json
{
  "user_profile": {
    "clearance_level": "TS/SCI",
    "GS_grade": 13,
    "skills": ["ITAR Compliance", "Procurement Oversight"],
    "interests": ["Supply Chain", "Operations"],
    "transition_goal": "Private Sector Procurement Manager"
  }
}
```


 ---

## ✨ Features

### ✅ Upload Resume  
Upload your resume to unlock two AI-powered modes:

#### 1. Map to Profile  
- Parses resume content using AFFINDA API  
- Automatically extracts skills, certifications, and job history  
- Maps transferable competencies to your FEDBRIDGE profile

#### 2. Analyze Resume  
- Identifies strengths, achievements, and leadership signals  
- Flags gaps or areas for improvement  
- Analyzes keywords for industry alignment  
- Reviews formatting and ATS (Applicant Tracking System) compatibility  

---

### ✅ AI-Powered Job Matching  
FEDBRIDGE uses OpenAI’s GPT-4 and labor market analytics to:  
- Recommend roles aligned with a user’s federal experience and skills  
- Suggest emerging job titles based on industry trends  
- Recommend prioritized upskilling options via Coursera, Udemy, or LinkedIn Learning  
- Visualize skill gaps and progress toward a chosen private-sector path

---

### ✅ Interview Simulation & Coaching  
With **LangChain + GPT-4**, candidates can:  
- Practice mock interviews tailored to targeted job roles  
- Receive STAR-format coaching (Situation, Task, Action, Result)  
- Improve verbal delivery and reduce reliance on bureaucratic language  
- Get instant AI feedback on tone, clarity, and relevance

---

### ✅ Personalized Job Search  
Integrated with RapidAPI to:  
- Pull live job listings by industry, region, and skill match  
- Display job descriptions with estimated salary ranges  
- Offer filters for remote/in-person roles, companies, and growth metrics  
- Provide direct application links and saving/bookmarking functionality  

---

### ✅ Federal Alumni Mentorship  
- Match users with former federal employees now working in the private sector  
- Enable 1:1 chat, video calls, and milestone guidance  
- Build a community of support and real-world transition stories

---

### ✅ Progress Dashboard  
- View your job readiness status at a glance  
- Track uploaded resumes, matched roles, and completed upskilling modules  
- Monitor AI feedback history and interview improvement over time

---
## ✅ Testing & Code Quality --- BONUS POINTS

### 📌 Static Analysis (Linting)

To maintain code quality and enforce consistent style across the backend, we used **ESLint**:

- Detects syntax errors, unreachable code, and unused variables
- Enforces best practices with modern ES module standards
- Helps prevent bugs before runtime

#### 🔧 Run ESLint:
```bash
cd resume-analyze/server
npx eslint .
npx eslint . --fix
```
### 🧪 Unit Testing with Code Coverage

We implemented unit tests using **Vitest**, and used **C8** to measure code coverage.

Test cases cover:
- Input validation
- AI-driven logic (mocked)
- MongoDB session persistence (mocked)

#### ✅ Test Coverage Summary

| Endpoint               | Description                                           |
|------------------------|-------------------------------------------------------|
| `getFirstQuestion`     | Returns question (valid input)                        |
| `getFirstQuestion`     | Returns 400 (missing role)                            |
| `getFeedback`          | Returns feedback (valid input)                        |
| `getFeedback`          | Returns 400 (missing fields)                          |
| `saveInterview`        | Saves session (valid input with mocked DB)            |
| `saveInterview`        | Returns 400 (invalid or missing input)                |
| `getNextQuestion`      | Returns 400 (missing required fields)                 |

#### ▶️ Run Tests
```bash
npm test
npx c8 npm test
npx c8 report
```
## 📄 License

This project is licensed under the **MIT License**.

You are free to:

- Use the software for personal, academic, or commercial purposes
- Modify, merge, publish, and distribute copies of the software
- Grant sublicenses of the software

**Conditions:**

- Attribution must be given to the original creators (FEDBRIDGE team - CMPE 272)
- The license and copyright notice must be included

For the full text of the license, refer to the `LICENSE` file in the root of the repository.

---
