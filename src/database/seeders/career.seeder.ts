import { prisma } from "../../lib/prisma.js";

export async function seedCareer() {
  const career = [
    "Backend Developer",
    "Cloud Architect",
    "Software Engineer",
    "Senior Software Engineer",
    "Data Engineer",
    "Frontend Developer",
    "Cybersecurity Analyst",
    "Machine Learning Engineer",
    "UX Designer",
    "Data Analyst",
    "Data Scientist",
    "Research Scientist",
    "DevOps Engineer",
    "Quantitative Analyst",
    "HR Manager",
    "Operations Manager",
    "Financial Analyst",
    "Marketing Manager",
    "Product Manager",
    "Business Analyst",
  ];

export async function seedCareer() {
  for (const career of CAREERS) {
    await prisma.career.upsert({
      where: { title: career.title },
      update: {
        description: career.description,
        industry: career.industry,
      },
      create: {
        title: career.title,
        description: career.description,
        industry: career.industry,
      },
    });
  }

  console.log(`✅ Career seeded: ${CAREERS.length} careers`);
}
