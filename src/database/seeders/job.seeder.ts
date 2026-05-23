import { prisma } from "../../lib/prisma.js";

const DUMMY_JOBS = [
  {
    company: "TechNova Solutions",
    rolePrefix: "Senior",
    location: "Jakarta Pusat",
    type: "Full-time",
    salary: "Rp 15M - 25M",
  },
  {
    company: "Global Innovate Corp",
    rolePrefix: "",
    location: "Remote",
    type: "Full-time",
    salary: "Rp 10M - 18M",
  },
  {
    company: "Startup Hub ID",
    rolePrefix: "Junior",
    location: "Bandung",
    type: "Hybrid",
    salary: "Rp 7M - 12M",
  },
];

// export async function seedJobOpenings() {
//   const careers = await prisma.career.findMany();

//   if (!careers.length) {
//     console.log("⚠️ No careers found. Skipping job seeding.");
//     return;
//   }

//   // Bersihkan data lama
//   await prisma.job_opening.deleteMany({});

//   let jobCount = 0;

//   // Buat 3 lowongan untuk setiap karir
//   for (const career of careers) {
//     for (const job of DUMMY_JOBS) {
//       await prisma.job_opening.create({
//         data: {
//           career_id: career.id,
//           company: job.company,
//           role: job.rolePrefix ? `${job.rolePrefix} ${career.title}` : career.title,
//           location: job.location,
//           type: job.type,
//           salary: job.salary,
//         },
//       });
//       jobCount++;
//     }
//   }

//   console.log(`✅ Job openings seeded: ${jobCount} jobs for ${careers.length} careers`);
// }
