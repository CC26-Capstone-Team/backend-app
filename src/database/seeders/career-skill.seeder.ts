import { prisma } from "../../lib/prisma.js";

export const jobTitleSkillsMap = [
  // --- Technology ---
  {
    jobTitle: "Backend Developer",
    skills: ["AWS", "Docker", "Java", "PostgreSQL", "Python", "Redis", "REST APIs", "SQL"],
  },
  {
    jobTitle: "Cloud Architect",
    skills: [
      "AWS",
      "Azure",
      "Cost Optimization",
      "GCP",
      "Kubernetes",
      "Microservices",
      "Security",
      "Terraform",
    ],
  },
  {
    jobTitle: "Cybersecurity Analyst",
    skills: [
      "Compliance",
      "Incident Response",
      "Network Security",
      "Penetration Testing",
      "Python",
      "SIEM",
    ],
  },
  {
    jobTitle: "DevOps Engineer",
    skills: ["AWS", "CI/CD", "Docker", "Git", "Linux", "Python", "Terraform"],
  },
  {
    jobTitle: "Frontend Developer",
    skills: ["Figma", "Git", "HTML/CSS", "JavaScript", "React", "REST APIs", "TypeScript"],
  },
  {
    jobTitle: "Senior Software Engineer",
    skills: ["AWS", "CI/CD", "Docker", "Java", "Kubernetes", "Microservices", "Python"],
  },
  {
    jobTitle: "Software Engineer",
    skills: ["AWS", "Docker", "Git", "Java", "Kubernetes", "Python", "REST APIs", "SQL"],
  },
  {
    jobTitle: "UX Designer",
    skills: [
      "Adobe XD",
      "Design Thinking",
      "Figma",
      "Prototyping",
      "Usability Testing",
      "User Research",
    ],
  },

  // --- Data & AI ---
  {
    jobTitle: "Data Analyst",
    skills: ["Data Visualization", "Excel", "Power BI", "Python", "SQL", "Statistics", "Tableau"],
  },
  {
    jobTitle: "Data Engineer",
    skills: ["Airflow", "AWS", "dbt", "Kafka", "Python", "Snowflake", "Spark", "SQL"],
  },
  {
    jobTitle: "Data Scientist",
    skills: [
      "Machine Learning",
      "Python",
      "R",
      "Spark",
      "SQL",
      "Statistics",
      "Tableau",
      "TensorFlow",
    ],
  },
  {
    jobTitle: "Machine Learning Engineer",
    skills: ["AWS", "Docker", "Kubernetes", "MLOps", "Python", "PyTorch", "Spark", "TensorFlow"],
  },
  {
    jobTitle: "Quantitative Analyst",
    skills: [
      "C++",
      "Derivatives",
      "Financial Modeling",
      "Python",
      "R",
      "Risk Management",
      "SQL",
      "Statistics",
    ],
  },
  {
    jobTitle: "Research Scientist",
    skills: [
      "Machine Learning",
      "Publications",
      "Python",
      "R",
      "Research",
      "Statistics",
      "TensorFlow",
    ],
  },

  // --- Business ---
  {
    jobTitle: "Business Analyst",
    skills: [
      "Agile",
      "Excel",
      "Requirements Gathering",
      "SQL",
      "Stakeholder Management",
      "Tableau",
    ],
  },
  {
    jobTitle: "Financial Analyst",
    skills: ["Accounting", "Bloomberg", "Excel", "Financial Modeling", "FP&A", "Power BI", "SQL"],
  },
  {
    jobTitle: "HR Manager",
    skills: [
      "Compensation",
      "Employment Law",
      "HRIS",
      "Performance Management",
      "Talent Acquisition",
    ],
  },
  {
    jobTitle: "Marketing Manager",
    skills: [
      "A/B Testing",
      "Analytics",
      "Content Strategy",
      "CRM",
      "Digital Marketing",
      "Google Ads",
      "SEO",
    ],
  },
  {
    jobTitle: "Operations Manager",
    skills: [
      "Budgeting",
      "Data Analysis",
      "ERP",
      "Lean",
      "Process Improvement",
      "Six Sigma",
      "Supply Chain",
    ],
  },
  {
    jobTitle: "Product Manager",
    skills: [
      "A/B Testing",
      "Agile",
      "Product Strategy",
      "Roadmapping",
      "SQL",
      "Stakeholder Management",
    ],
  },
];

export async function careerSkillSeeder() {
  for (const { jobTitle, skills } of jobTitleSkillsMap) {
    // Find the career ID for the given job title
    const career = await prisma.career.findUnique({
      where: { title: jobTitle },
    });

    if (!career) {
      console.warn(`⚠️ Career not found: ${jobTitle}`);
      continue;
    }

    // Find all skill IDs for the given skills
    const skillRecords = await prisma.skill.findMany({
      where: {
        name: {
          in: skills,
        },
      },
    });

    // Create associations between the career and skills
    const careerSkills = skillRecords.map((skill) => ({
      career_id: career.id,
      skill_id: skill.id,
    }));

    await prisma.career_skill.createMany({
      data: careerSkills,
      skipDuplicates: true,
    });

    console.log(`✅ Career-Skill seeded: ${jobTitle} - ${skills.length} skills`);
  }
}
