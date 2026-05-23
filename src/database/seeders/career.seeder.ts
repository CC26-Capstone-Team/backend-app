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

  await prisma.career.createMany({
    data: career.map((career) => ({ title: career })),
    skipDuplicates: true,
  });

  console.log(`✅ Career seeded: ${career.length} careers`);
}
