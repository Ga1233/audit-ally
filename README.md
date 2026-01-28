
# 🛡️ Pentest Tracker – Security Audit Checklist Web Application

Pentest Tracker is a web-based security audit management application designed to streamline and standardize penetration testing workflows. The platform integrates the **OWASP Top 10 (2021)** checklist and provides structured tracking of audits, findings, and remediation progress.

This project focuses on clarity, repeatability, and real-world security assessment practices.

---

## 📌 Features

### 🔐 Secure Authentication
- Email-based signup and login
- Secure session handling
- Role-based access control (if enabled)

### 📊 Audit Management Dashboard
- Create, view, update, and delete audits
- Associate audits with clients and target systems
- Visual overview of audit status and progress

### ✅ OWASP Top 10 (2021) Checklist
- Automatic checklist generation for each audit
- Track status per OWASP category (Open, In Progress, Mitigated)
- Ensures no critical security area is missed

### 📝 Findings & Progress Tracking
- Document vulnerabilities with notes and evidence
- Track audit completion percentage
- Maintain historical audit records

### 📄 Report-Ready Structure
- Organized data suitable for exporting reports
- Clear separation between findings, risks, and remediation notes

---

## 🎯 Use Cases

- **Professional Penetration Testing**  
  Manage multiple client audits using a standardized methodology.

- **Internal Security Assessments**  
  Track recurring audits and security maturity over time.

- **Cybersecurity Learning & Training**  
  Helps students and junior pentesters follow a structured testing approach.

- **Compliance & Risk Reviews**  
  Maintain audit records for reporting and compliance purposes.

---

## 🧱 Tech Stack

### Frontend
- **React 18 + Vite** – Fast and modern UI
- **TypeScript** – Type safety and fewer runtime errors
- **Tailwind CSS** – Clean, dashboard-style UI
- **Lucide React** – Lightweight icons

### Backend
- **Supabase**
  - PostgreSQL database
  - Authentication
  - Real-time data handling

---

## 🔄 Application Workflow

1. **Create Audit**  
   Define client name, target system, and scope.

2. **Planning Phase**  
   Audit starts in a planning state.

3. **Testing Phase**  
   Follow the OWASP Top 10 checklist and mark progress.

4. **Add Findings**  
   Document vulnerabilities with severity and notes.

5. **Monitoring**  
   Dashboard updates risk counts and progress in real time.

6. **Reporting & Closure**  
   Export audit data and mark findings as resolved.

---

## 🔐 Security Focus

- Structured security methodology (OWASP Top 10)
- Controlled access to audit data
- Clear separation of technical and non-technical views
- Designed to reduce human error during audits

---

## 🚀 Future Enhancements

- PDF / CSV report export
- CVSS score calculation
- Advanced role-based access control
- Audit history comparison
- Multi-user collaboration
- Activity and audit logs

---

## 📄 Project Significance

Pentest Tracker bridges the gap between **technical penetration testing** and **clear security reporting**.  
It promotes a repeatable, defensible, and professional approach to application security auditing.

---
Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:


# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)



## 👨‍💻 Author

**Gaurav Gawade**  
Cybersecurity & Full-Stack Development  
