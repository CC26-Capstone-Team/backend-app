import { prisma } from "../../lib/prisma.js";

const CAREERS = [
  {
    title: "Backend Developer",
    description:
      "Merancang dan membangun logika server, API, dan basis data untuk mendukung aplikasi. Memastikan performa, keamanan, dan skalabilitas sistem backend.",
    industry: "Software Development",
  },
  {
    title: "Cloud Architect",
    description:
      "Merancang dan mengelola infrastruktur cloud yang aman, andal, dan cost-efficient. Mendefinisikan arsitektur cloud yang mendukung pertumbuhan bisnis.",
    industry: "Infrastructure & Operations",
  },
  {
    title: "Software Engineer",
    description:
      "Menerapkan prinsip-prinsip rekayasa perangkat lunak untuk merancang, mengembangkan, dan memelihara sistem perangkat lunak yang andal dan scalable.",
    industry: "Software Development",
  },
  {
    title: "Senior Software Engineer",
    description:
      "Memimpin pengembangan solusi teknis yang kompleks, mentoring junior developer, dan berkontribusi pada arsitektur sistem secara keseluruhan.",
    industry: "Software Development",
  },
  {
    title: "Data Engineer",
    description:
      "Merancang dan membangun infrastruktur pipeline data yang handal untuk mengumpulkan, menyimpan, dan memproses data dalam skala besar.",
    industry: "Data & Analytics",
  },
  {
    title: "Frontend Developer",
    description:
      "Membangun antarmuka pengguna yang interaktif dan responsif menggunakan teknologi web modern. Bertanggung jawab atas pengalaman visual dan interaksi pengguna.",
    industry: "Software Development",
  },
  {
    title: "Cybersecurity Analyst",
    description:
      "Melindungi sistem dan jaringan organisasi dari ancaman siber melalui pemantauan, analisis kerentanan, dan implementasi kontrol keamanan.",
    industry: "Cybersecurity",
  },
  {
    title: "Machine Learning Engineer",
    description:
      "Merancang, membangun, dan men-deploy model machine learning ke dalam sistem produksi yang dapat diandalkan dan scalable.",
    industry: "Artificial Intelligence",
  },
  {
    title: "UX Designer",
    description:
      "Menciptakan pengalaman pengguna yang intuitif dan menyenangkan melalui riset pengguna, wireframing, prototyping, dan pengujian usability.",
    industry: "Design & Creative",
  },
  {
    title: "Data Analyst",
    description:
      "Mengumpulkan, membersihkan, dan menganalisis data untuk menghasilkan insight bisnis yang actionable. Menyajikan temuan melalui laporan dan visualisasi data.",
    industry: "Data & Analytics",
  },
  {
    title: "Data Scientist",
    description:
      "Menggunakan teknik statistik dan machine learning untuk menemukan pola dalam data besar dan membangun model prediktif untuk kebutuhan bisnis.",
    industry: "Data & Analytics",
  },
  {
    title: "Research Scientist",
    description:
      "Melakukan penelitian mendalam di bidang ilmu komputer, AI, atau domain terkait untuk menghasilkan inovasi dan pengetahuan baru yang dapat dipublikasikan.",
    industry: "Research & Development",
  },
  {
    title: "DevOps Engineer",
    description:
      "Menjembatani antara tim pengembangan dan operasional dengan mengotomatiskan proses build, test, dan deployment untuk meningkatkan kecepatan dan kualitas rilis.",
    industry: "Infrastructure & Operations",
  },
  {
    title: "Quantitative Analyst",
    description:
      "Mengembangkan model matematika dan statistik untuk analisis risiko, strategi trading, dan penilaian instrumen keuangan di sektor perbankan dan investasi.",
    industry: "Finance & Accounting",
  },
  {
    title: "HR Manager",
    description:
      "Mengelola sumber daya manusia organisasi, termasuk rekrutmen, pengembangan karyawan, dan budaya perusahaan.",
    industry: "Human Resources",
  },
  {
    title: "Operation Manager",
    description:
      "Mengawasi dan mengoptimalkan proses operasional bisnis untuk meningkatkan efisiensi, produktivitas, dan profitabilitas perusahaan.",
    industry: "Business & Management",
  },
  {
    title: "Financial Analyst",
    description:
      "Menganalisis data keuangan untuk memberikan rekomendasi investasi, perencanaan anggaran, dan strategi keuangan bagi perusahaan atau klien.",
    industry: "Finance & Accounting",
  },
  {
    title: "Marketing Manager",
    description:
      "Merencanakan dan mengeksekusi strategi pemasaran untuk meningkatkan brand awareness, akuisisi pelanggan, dan pertumbuhan bisnis.",
    industry: "Marketing & Communications",
  },
  {
    title: "Product Manager",
    description:
      "Menentukan visi dan strategi produk, memprioritaskan fitur, dan bekerja sama dengan tim engineering dan desain untuk menghadirkan produk yang bernilai bagi pengguna.",
    industry: "Product & Strategy",
  },
  {
    title: "Business Analyst",
    description:
      "Menganalisis proses bisnis, mengidentifikasi kebutuhan, dan merumuskan solusi yang menghubungkan kebutuhan bisnis dengan kemampuan teknologi.",
    industry: "Business & Management",
  },
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
