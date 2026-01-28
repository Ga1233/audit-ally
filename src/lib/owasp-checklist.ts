export interface OwaspItem {
  code: string;
  category: string;
  title: string;
  description: string;
}

export const OWASP_TOP_10_2021: OwaspItem[] = [
  {
    code: "A01",
    category: "Broken Access Control",
    title: "Broken Access Control",
    description: "Restrictions on authenticated users are not properly enforced. Attackers can exploit these flaws to access unauthorized functionality and/or data."
  },
  {
    code: "A02",
    category: "Cryptographic Failures",
    title: "Cryptographic Failures",
    description: "Failures related to cryptography which often lead to exposure of sensitive data. This includes weak encryption, improper key management, and transmission of data in clear text."
  },
  {
    code: "A03",
    category: "Injection",
    title: "Injection",
    description: "Injection flaws such as SQL, NoSQL, OS, and LDAP injection occur when untrusted data is sent to an interpreter as part of a command or query."
  },
  {
    code: "A04",
    category: "Insecure Design",
    title: "Insecure Design",
    description: "Missing or ineffective control design. This includes threat modeling, secure design patterns, and reference architectures."
  },
  {
    code: "A05",
    category: "Security Misconfiguration",
    title: "Security Misconfiguration",
    description: "Missing appropriate security hardening or improperly configured permissions on cloud services. Includes default configurations and incomplete configurations."
  },
  {
    code: "A06",
    category: "Vulnerable Components",
    title: "Vulnerable and Outdated Components",
    description: "Using components with known vulnerabilities. This includes libraries, frameworks, and other software modules running with the same privileges as the application."
  },
  {
    code: "A07",
    category: "Authentication Failures",
    title: "Identification and Authentication Failures",
    description: "Weak authentication mechanisms, session management flaws, and credential stuffing. Includes improper validation of sessions and credentials."
  },
  {
    code: "A08",
    category: "Data Integrity Failures",
    title: "Software and Data Integrity Failures",
    description: "Code and infrastructure that does not protect against integrity violations. Includes insecure deserialization and using software without integrity verification."
  },
  {
    code: "A09",
    category: "Logging Failures",
    title: "Security Logging and Monitoring Failures",
    description: "Insufficient logging, detection, monitoring, and active response. Without proper logging and monitoring, attacks may go unnoticed."
  },
  {
    code: "A10",
    category: "SSRF",
    title: "Server-Side Request Forgery (SSRF)",
    description: "SSRF flaws occur when a web application fetches a remote resource without validating the user-supplied URL. Attackers can coerce the application to send requests to unexpected destinations."
  }
];

export const createChecklistItemsForAudit = (auditId: string) => {
  return OWASP_TOP_10_2021.map(item => ({
    audit_id: auditId,
    owasp_code: item.code,
    owasp_category: item.category,
    title: item.title,
    description: item.description,
    checked: false,
    notes: null
  }));
};
