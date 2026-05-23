import { prisma } from "../../lib/prisma.js";

const career: { title: string; description: string }[] = [
  {
    title: "Backend Developer",
    description:
      "Membangun dan memelihara sisi server aplikasi, API, dan database yang mendukung produk digital",
  },
  {
    title: "Cloud Architect",
    description:
      "Membangun dan memelihara sisi server aplikasi, API, dan database yang mendukung produk digital",
  },
  {
    title: "Software Engineer",
    description:
      "Merancang, membangun, dan memelihara aplikasi perangkat lunak yang memenuhi kebutuhan bisnis dan pengguna",
  },
  {
    title: "Senior Software Engineer",
    description:
      "Merancang arsitektur sistem, memimpin implementasi fitur kompleks, dan membimbing developer junior",
  },
  {
    title: "Data Engineer",
    description:
      "Membangun dan memelihara infrastruktur data — pipeline, warehouse, dan sistem batch/streaming — yang mendukung analisis dan ML",
  },
  {
    title: "Frontend Developer",
    description:
      "Membangun antarmuka pengguna web yang responsif, interaktif, dan berkinerja tinggi menggunakan teknologi modern",
  },
  {
    title: "Cybersecurity Analyst",
    description:
      "Membangun antarmuka pengguna web yang responsif, interaktif, dan berkinerja tinggi menggunakan teknologi modern",
  },
  {
    title: "Machine Learning Engineer",
    description:
      "Membangun, mengoptimasi, dan men-deploy model machine learning ke dalam sistem produksi yang scalable",
  },
  {
    title: "UX Designer",
    description:
      "Merancang pengalaman pengguna yang intuitif, estetis, dan efektif melalui riset, prototyping, dan pengujian desain",
  },
  {
    title: "Data Analyst",
    description:
      "Mengumpulkan, mengolah, dan menganalisis data untuk menghasilkan insight bisnis yang mendukung pengambilan keputusan",
  },
  {
    title: "Data Scientist",
    description:
      "Membangun model statistik dan machine learning untuk mengekstrak insight prediktif dari data kompleks",
  },
  {
    title: "Research Scientist",
    description:
      "Melakukan penelitian ilmiah di bidang AI/ML untuk mengembangkan algoritma, metode, dan solusi inovatif",
  },
  {
    title: "DevOps Engineer",
    description:
      "Menjembatani pengembangan dan operasi dengan membangun pipeline CI/CD, otomasi infrastruktur, dan memastikan keandalan sistem",
  },
  {
    title: "Quantitative Analyst",
    description:
      "Menjembatani pengembangan dan operasi dengan membangun pipeline CI/CD, otomasi infrastruktur, dan memastikan keandalan sistem",
  },
  {
    title: "HR Manager",
    description:
      "Mengelola seluruh siklus sumber daya manusia — dari rekrutmen, pengembangan, kompensasi, hingga hubungan karyawan",
  },
  {
    title: "Operations Manager",
    description:
      "Mengoptimasi proses bisnis, rantai pasok, dan operasi sehari-hari untuk meningkatkan efisiensi dan mengurangi biaya",
  },
  {
    title: "Financial Analyst",
    description:
      "Menganalisis data keuangan, membangun model proyeksi, dan memberikan rekomendasi investasi atau strategi bisnis",
  },
  {
    title: "Marketing Manager",
    description:
      "Merancang dan mengeksekusi strategi pemasaran digital untuk meningkatkan brand awareness, lead generation, dan konversi",
  },
  {
    title: "Product Manager",
    description:
      "Mendefinisikan visi produk, mengelola roadmap, dan berkoordinasi dengan semua tim untuk menghadirkan produk yang dicintai pengguna",
  },
  {
    title: "Business Analyst",
    description:
      "Menjembatani kebutuhan bisnis dengan solusi teknis melalui analisis data, dokumentasi requirement, dan koordinasi stakeholder",
  },
];

export async function seedCareer() {
  await prisma.career.createMany({
    data: career.map((c) => ({ title: c.title, description: c.description })),
    skipDuplicates: true,
  });

  console.log(`✅ Career seeded: ${career.length} careers`);
}
