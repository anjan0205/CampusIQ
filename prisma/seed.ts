import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Curated Management and Medical Colleges (to retain stream variety)
const managementAndMedicalColleges = [
  // ==========================================
  // Business Schools (CAT)
  // ==========================================
  {
    name: "Indian Institute of Management Ahmedabad",
    slug: "iim-ahmedabad",
    location: "Ahmedabad",
    state: "Gujarat",
    fees: 1250000,
    rating: 4.9,
    nirfRanking: 1,
    establishedYear: 1961,
    ownershipType: "Public",
    campusSize: "106 Acres",
    averagePlacement: 34.45,
    highestPackage: 115.0,
    medianPackage: 31.5,
    examName: "CAT",
    minRank: 1,
    maxRank: 120,
    category: "Management"
  },
  {
    name: "Indian Institute of Management Bangalore",
    slug: "iim-bangalore",
    location: "Bengaluru",
    state: "Karnataka",
    fees: 1220000,
    rating: 4.9,
    nirfRanking: 2,
    establishedYear: 1973,
    ownershipType: "Public",
    campusSize: "100 Acres",
    averagePlacement: 35.3,
    highestPackage: 120.0,
    medianPackage: 32.0,
    examName: "CAT",
    minRank: 10,
    maxRank: 160,
    category: "Management"
  },
  {
    name: "Indian Institute of Management Calcutta",
    slug: "iim-calcutta",
    location: "Kolkata",
    state: "West Bengal",
    fees: 1200000,
    rating: 4.8,
    nirfRanking: 3,
    establishedYear: 1961,
    ownershipType: "Public",
    campusSize: "135 Acres",
    averagePlacement: 35.0,
    highestPackage: 115.0,
    medianPackage: 31.0,
    examName: "CAT",
    minRank: 15,
    maxRank: 220,
    category: "Management"
  },
  {
    name: "Faculty of Management Studies Delhi",
    slug: "fms-delhi",
    location: "New Delhi",
    state: "Delhi",
    fees: 10000,
    rating: 4.7,
    nirfRanking: 35,
    establishedYear: 1954,
    ownershipType: "Public",
    campusSize: "2 Acres",
    averagePlacement: 34.1,
    highestPackage: 123.0,
    medianPackage: 31.0,
    examName: "CAT",
    minRank: 30,
    maxRank: 320,
    category: "Management"
  },
  {
    name: "Indian Institute of Management Indore",
    slug: "iim-indore",
    location: "Indore",
    state: "Madhya Pradesh",
    fees: 1100000,
    rating: 4.6,
    nirfRanking: 8,
    establishedYear: 1996,
    ownershipType: "Public",
    campusSize: "193 Acres",
    averagePlacement: 25.4,
    highestPackage: 114.0,
    medianPackage: 22.0,
    examName: "CAT",
    minRank: 100,
    maxRank: 600,
    category: "Management"
  },
  {
    name: "Indian Institute of Management Kozhikode",
    slug: "iim-kozhikode",
    location: "Kozhikode",
    state: "Kerala",
    fees: 1050000,
    rating: 4.7,
    nirfRanking: 5,
    establishedYear: 1996,
    ownershipType: "Public",
    campusSize: "112 Acres",
    averagePlacement: 29.5,
    highestPackage: 67.0,
    medianPackage: 25.0,
    examName: "CAT",
    minRank: 80,
    maxRank: 500,
    category: "Management"
  },
  {
    name: "Indian Institute of Management Lucknow",
    slug: "iim-lucknow",
    location: "Lucknow",
    state: "Uttar Pradesh",
    fees: 1000000,
    rating: 4.7,
    nirfRanking: 6,
    establishedYear: 1984,
    ownershipType: "Public",
    campusSize: "190 Acres",
    averagePlacement: 32.2,
    highestPackage: 100.0,
    medianPackage: 28.0,
    examName: "CAT",
    minRank: 50,
    maxRank: 450,
    category: "Management"
  },
  {
    name: "XLRI Jamshedpur",
    slug: "xlri-jamshedpur",
    location: "Jamshedpur",
    state: "Jharkhand",
    fees: 1290000,
    rating: 4.8,
    nirfRanking: 9,
    establishedYear: 1949,
    ownershipType: "Private",
    campusSize: "40 Acres",
    averagePlacement: 32.7,
    highestPackage: 78.2,
    medianPackage: 30.0,
    examName: "CAT",
    minRank: 60,
    maxRank: 550,
    category: "Management"
  },
  {
    name: "Indian Institute of Management Shillong",
    slug: "iim-shillong",
    location: "Shillong",
    state: "Meghalaya",
    fees: 950000,
    rating: 4.4,
    nirfRanking: 26,
    establishedYear: 2007,
    ownershipType: "Public",
    campusSize: "120 Acres",
    averagePlacement: 26.9,
    highestPackage: 71.3,
    medianPackage: 23.5,
    examName: "CAT",
    minRank: 200,
    maxRank: 1100,
    category: "Management"
  },
  {
    name: "Symbiosis Institute of Business Management",
    slug: "sibm-pune",
    location: "Pune",
    state: "Maharashtra",
    fees: 1100000,
    rating: 4.4,
    nirfRanking: 17,
    establishedYear: 1978,
    ownershipType: "Private",
    campusSize: "300 Acres",
    averagePlacement: 26.7,
    highestPackage: 35.0,
    medianPackage: 24.0,
    examName: "CAT",
    minRank: 300,
    maxRank: 1500,
    category: "Management"
  },

  // ==========================================
  // Medical Colleges (NEET)
  // ==========================================
  {
    name: "All India Institute of Medical Sciences New Delhi",
    slug: "aiims-delhi",
    location: "New Delhi",
    state: "Delhi",
    fees: 1628,
    rating: 4.9,
    nirfRanking: 1,
    establishedYear: 1956,
    ownershipType: "Public",
    campusSize: "115 Acres",
    averagePlacement: 18.0,
    highestPackage: 35.0,
    medianPackage: 16.0,
    examName: "NEET",
    minRank: 1,
    maxRank: 55,
    category: "Medical"
  },
  {
    name: "Maulana Azad Medical College",
    slug: "mamc-delhi",
    location: "New Delhi",
    state: "Delhi",
    fees: 3290,
    rating: 4.7,
    nirfRanking: 24,
    establishedYear: 1959,
    ownershipType: "Public",
    campusSize: "122 Acres",
    averagePlacement: 15.0,
    highestPackage: 30.0,
    medianPackage: 14.0,
    examName: "NEET",
    minRank: 20,
    maxRank: 160,
    category: "Medical"
  },
  {
    name: "Christian Medical College Vellore",
    slug: "cmc-vellore",
    location: "Vellore",
    state: "Tamil Nadu",
    fees: 52000,
    rating: 4.8,
    nirfRanking: 3,
    establishedYear: 1900,
    ownershipType: "Private",
    campusSize: "200 Acres",
    averagePlacement: 14.5,
    highestPackage: 28.0,
    medianPackage: 12.0,
    examName: "NEET",
    minRank: 10,
    maxRank: 350,
    category: "Medical"
  },
  {
    name: "Vardhman Mahavir Medical College & Safdarjung Hospital",
    slug: "vmmc-safdarjung",
    location: "New Delhi",
    state: "Delhi",
    fees: 50000,
    rating: 4.6,
    nirfRanking: 14,
    establishedYear: 2001,
    ownershipType: "Public",
    campusSize: "47 Acres",
    averagePlacement: 14.0,
    highestPackage: 28.0,
    medianPackage: 12.0,
    examName: "NEET",
    minRank: 50,
    maxRank: 280,
    category: "Medical"
  },
  {
    name: "King George's Medical University",
    slug: "kgmu-lucknow",
    location: "Lucknow",
    state: "Uttar Pradesh",
    fees: 54000,
    rating: 4.6,
    nirfRanking: 12,
    establishedYear: 1911,
    ownershipType: "Public",
    campusSize: "100 Acres",
    averagePlacement: 13.5,
    highestPackage: 26.0,
    medianPackage: 12.0,
    examName: "NEET",
    minRank: 150,
    maxRank: 950,
    category: "Medical"
  },
  {
    name: "JIPMER Puducherry",
    slug: "jipmer-puducherry",
    location: "Puducherry",
    state: "Puducherry",
    fees: 12000,
    rating: 4.7,
    nirfRanking: 5,
    establishedYear: 1823,
    ownershipType: "Public",
    campusSize: "192 Acres",
    averagePlacement: 15.5,
    highestPackage: 32.0,
    medianPackage: 13.5,
    examName: "NEET",
    minRank: 30,
    maxRank: 250,
    category: "Medical"
  },
  {
    name: "Grant Medical College Mumbai",
    slug: "grant-medical-college-mumbai",
    location: "Mumbai",
    state: "Maharashtra",
    fees: 135000,
    rating: 4.4,
    nirfRanking: 30,
    establishedYear: 1845,
    ownershipType: "Public",
    campusSize: "44 Acres",
    averagePlacement: 12.0,
    highestPackage: 24.0,
    medianPackage: 10.8,
    examName: "NEET",
    minRank: 100,
    maxRank: 750,
    category: "Medical"
  },
  {
    name: "Armed Forces Medical College Pune",
    slug: "afmc-pune",
    location: "Pune",
    state: "Maharashtra",
    fees: 25000,
    rating: 4.8,
    nirfRanking: 30,
    establishedYear: 1948,
    ownershipType: "Public",
    campusSize: "119 Acres",
    averagePlacement: 16.5,
    highestPackage: 32.0,
    medianPackage: 15.0,
    examName: "NEET",
    minRank: 50,
    maxRank: 450,
    category: "Medical"
  },
  {
    name: "Kasturba Medical College Manipal",
    slug: "kmc-manipal",
    location: "Manipal",
    state: "Karnataka",
    fees: 1780000,
    rating: 4.5,
    nirfRanking: 9,
    establishedYear: 1953,
    ownershipType: "Private",
    campusSize: "200 Acres",
    averagePlacement: 14.0,
    highestPackage: 28.0,
    medianPackage: 12.5,
    examName: "NEET",
    minRank: 300,
    maxRank: 2500,
    category: "Medical"
  },
  {
    name: "Institute of Medical Sciences BHU",
    slug: "ims-bhu-varanasi",
    location: "Varanasi",
    state: "Uttar Pradesh",
    fees: 14000,
    rating: 4.7,
    nirfRanking: 8,
    establishedYear: 1960,
    ownershipType: "Public",
    campusSize: "100 Acres",
    averagePlacement: 14.8,
    highestPackage: 30.0,
    medianPackage: 13.0,
    examName: "NEET",
    minRank: 80,
    maxRank: 480,
    category: "Medical"
  },
  {
    name: "Bangalore Medical College and Research Institute",
    slug: "bangalore-medical-college",
    location: "Bengaluru",
    state: "Karnataka",
    fees: 70000,
    rating: 4.4,
    nirfRanking: 32,
    establishedYear: 1955,
    ownershipType: "Public",
    campusSize: "200 Acres",
    averagePlacement: 11.5,
    highestPackage: 22.0,
    medianPackage: 10.5,
    examName: "NEET",
    minRank: 150,
    maxRank: 850,
    category: "Medical"
  },
  {
    name: "St. John's Medical College",
    slug: "st-johns-medical-college",
    location: "Bengaluru",
    state: "Karnataka",
    fees: 750000,
    rating: 4.4,
    nirfRanking: 19,
    establishedYear: 1963,
    ownershipType: "Private",
    campusSize: "140 Acres",
    averagePlacement: 12.0,
    highestPackage: 24.0,
    medianPackage: 11.0,
    examName: "NEET",
    minRank: 200,
    maxRank: 1100,
    category: "Medical"
  },
  {
    name: "Christian Medical College Ludhiana",
    slug: "cmc-ludhiana",
    location: "Ludhiana",
    state: "Punjab",
    fees: 660000,
    rating: 4.2,
    nirfRanking: 38,
    establishedYear: 1894,
    ownershipType: "Private",
    campusSize: "45 Acres",
    averagePlacement: 10.5,
    highestPackage: 22.0,
    medianPackage: 9.8,
    examName: "NEET",
    minRank: 350,
    maxRank: 1800,
    category: "Medical"
  },
  {
    name: "Sher-i-Kashmir Institute of Medical Sciences",
    slug: "skims-srinagar",
    location: "Srinagar",
    state: "Jammu & Kashmir",
    fees: 120000,
    rating: 4.1,
    nirfRanking: 40,
    establishedYear: 1982,
    ownershipType: "Public",
    campusSize: "100 Acres",
    averagePlacement: 11.0,
    highestPackage: 20.0,
    medianPackage: 9.5,
    examName: "NEET",
    minRank: 400,
    maxRank: 2200,
    category: "Medical"
  },
  {
    name: "Goa Medical College",
    slug: "goa-medical-college",
    location: "Bambolim",
    state: "Goa",
    fees: 90000,
    rating: 4.2,
    nirfRanking: 42,
    establishedYear: 1842,
    ownershipType: "Public",
    campusSize: "70 Acres",
    averagePlacement: 10.8,
    highestPackage: 21.0,
    medianPackage: 9.6,
    examName: "NEET",
    minRank: 300,
    maxRank: 1500,
    category: "Medical"
  }
];

const buildFinalSeedData = () => {
  const jsonPath = path.join(process.cwd(), "prisma", "engineering_colleges.json");
  console.log(`Reading engineering colleges from ${jsonPath}...`);
  
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const engColleges = JSON.parse(rawData);
  
  console.log(`Loaded ${engColleges.length} engineering colleges from JSON.`);

  // Format Engineering Colleges
  const formattedEngineering = engColleges.map((col: any) => {
    const reviews = [
      {
        studentName: "Arav Sharma",
        rating: col.rating,
        comment: `Excellent study environment at ${col.name}. The professors are very knowledgeable and supportive, and the peer group is highly motivating. Hostel amenities are top-notch and the student clubs keep the campus lively.`
      },
      {
        studentName: "Nisha Patel",
        rating: Math.max(3.5, col.rating - 0.3),
        comment: `Very happy with my choice of joining ${col.name}. The academic curriculum is industry-aligned and covers state-of-the-art topics. Placements are well-structured, although some rules can be a bit strict.`
      }
    ];

    const placements = [
      {
        averagePackage: col.averagePlacement,
        highestPackage: col.highestPackage,
        placementPercentage: 85.0 + (col.nirfRanking % 12)
      }
    ];

    const predictorRules = [
      {
        examName: col.examName,
        minRank: col.minRank,
        maxRank: col.maxRank
      }
    ];

    const imageMap: Record<string, string> = {
      "Public": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
      "Private": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&auto=format&fit=crop&q=80"
    };

    return {
      name: col.name,
      slug: col.slug,
      location: col.location,
      state: col.state,
      fees: col.fees,
      rating: col.rating,
      nirfRanking: col.nirfRanking,
      description: col.description,
      image: imageMap[col.ownershipType as string] || imageMap["Public"],
      establishedYear: col.establishedYear,
      ownershipType: col.ownershipType,
      campusSize: col.campusSize,
      averagePlacement: col.averagePlacement,
      highestPackage: col.highestPackage,
      medianPackage: col.medianPackage,
      courses: col.courses,
      placements,
      reviews,
      predictorRules
    };
  });

  // Format Management & Medical Colleges
  const formattedMgmtMed = managementAndMedicalColleges.map((col) => {
    let courses: any[] = [];
    let description = "";

    if (col.category === "Management") {
      description = `Established in ${col.establishedYear}, ${col.name} is one of India's top-tier business schools located in ${col.location}, ${col.state}. It is acclaimed for its postgraduate management programs, rigorous case-based learning methodology, stellar faculty expertise, and 100% placement records with elite global consulting, banking, and product firms.`;
      courses = [
        { 
          courseName: "Post Graduate Program in Management (MBA)", 
          duration: "2 Years", 
          fees: col.fees, 
          eligibility: `Bachelor's Degree + CAT exam score` 
        }
      ];
    } else {
      description = `Established in ${col.establishedYear}, ${col.name} is a premier healthcare education and medical research center located in ${col.location}, ${col.state}. Featuring a state-of-the-art multi-speciality training hospital, the institution is highly respected for its rich clinical diagnostics exposure, ethics-focused education, and top residency placements.`;
      courses = [
        { 
          courseName: "Bachelor of Medicine, Bachelor of Surgery (MBBS)", 
          duration: "5.5 Years", 
          fees: col.fees, 
          eligibility: `10+2 with Biology, Physics, Chemistry + NEET rank` 
        }
      ];
    }

    const imageMap: Record<string, string> = {
      "Management-Public": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
      "Management-Private": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
      "Medical-Public": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80",
      "Medical-Private": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80"
    };

    const image = imageMap[`${col.category}-${col.ownershipType}`] || imageMap["Medical-Public"];

    const reviews = [
      {
        studentName: "Arav Sharma",
        rating: col.rating,
        comment: `Excellent study environment at ${col.name}. The professors are very knowledgeable and supportive, and the peer group is highly motivating. Hostel amenities are top-notch and the student clubs keep the campus lively.`
      },
      {
        studentName: "Nisha Patel",
        rating: Math.max(3.5, col.rating - 0.3),
        comment: `Very happy with my choice of joining ${col.name}. The academic curriculum is industry-aligned and covers state-of-the-art topics. Placements are well-structured, although some rules can be a bit strict.`
      }
    ];

    const placements = [
      {
        averagePackage: col.averagePlacement,
        highestPackage: col.highestPackage,
        placementPercentage: col.category === "Management" ? 100.0 : 88.5 + (col.nirfRanking % 10)
      }
    ];

    const predictorRules = [
      {
        examName: col.examName,
        minRank: col.minRank,
        maxRank: col.maxRank
      }
    ];

    return {
      name: col.name,
      slug: col.slug,
      location: col.location,
      state: col.state,
      fees: col.fees,
      rating: col.rating,
      nirfRanking: col.nirfRanking,
      description,
      image,
      establishedYear: col.establishedYear,
      ownershipType: col.ownershipType,
      campusSize: col.campusSize,
      averagePlacement: col.averagePlacement,
      highestPackage: col.highestPackage,
      medianPackage: col.medianPackage,
      courses,
      placements,
      reviews,
      predictorRules
    };
  });

  return [...formattedEngineering, ...formattedMgmtMed];
};

async function main() {
  console.log("Cleaning database...");
  await prisma.predictorRule.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});
  console.log("Database cleaned.");

  const allColleges = buildFinalSeedData();
  console.log(`Starting to seed ${allColleges.length} colleges...`);

  // Using a single transaction to make SQLite inserts incredibly fast
  await prisma.$transaction(
    allColleges.map((col) =>
      prisma.college.create({
        data: {
          name: col.name,
          slug: col.slug,
          location: col.location,
          state: col.state,
          fees: col.fees,
          rating: col.rating,
          nirfRanking: col.nirfRanking,
          description: col.description,
          image: col.image,
          establishedYear: col.establishedYear,
          ownershipType: col.ownershipType,
          campusSize: col.campusSize,
          averagePlacement: col.averagePlacement,
          highestPackage: col.highestPackage,
          medianPackage: col.medianPackage,
          courses: {
            create: col.courses
          },
          placements: {
            create: col.placements
          },
          reviews: {
            create: col.reviews
          },
          predictorRules: {
            create: col.predictorRules
          }
        }
      })
    )
  );

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
