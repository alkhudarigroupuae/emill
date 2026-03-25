import { PrismaClient, Species, SubscriptionTier } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@rescue.org";
  const adminPassword = "ChangeMe!12345";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      name: "Platform Admin",
      role: "ADMIN",
    },
  });

  const vets = await Promise.all([
    prisma.veterinarian.upsert({
      where: { slug: "dr-samira-haddad" },
      update: {},
      create: {
        slug: "dr-samira-haddad",
        name: "Dr. Samira Haddad",
        specialty: "Emergency Surgery",
        experienceYears: 12,
        bio: "Specializes in trauma stabilization and post-conflict rescue triage with a focus on rapid interventions that preserve mobility and prevent infection.",
        photoUrl:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=70",
        country: "Jordan",
        languages: ["English", "Arabic"],
      },
    }),
    prisma.veterinarian.upsert({
      where: { slug: "dr-luca-moretti" },
      update: {},
      create: {
        slug: "dr-luca-moretti",
        name: "Dr. Luca Moretti",
        specialty: "Orthopedics",
        experienceYears: 9,
        bio: "Supports complex fracture repair, limb reconstruction, and long-term rehab planning for animals rescued from severe injuries.",
        photoUrl:
          "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1200&q=70",
        country: "Italy",
        languages: ["English", "Italian"],
      },
    }),
  ]);

  const animals = await Promise.all([
    prisma.animal.upsert({
      where: { slug: "amira" },
      update: {},
      create: {
        slug: "amira",
        name: "Amira",
        species: Species.DOG,
        sex: "FEMALE",
        location: "Kharkiv Field Clinic",
        country: "Ukraine",
        warAffected: true,
        rescueDate: new Date("2025-11-04T10:00:00Z"),
        status: "RECOVERING",
        summary:
          "Found near a collapsed building with shrapnel wounds and severe dehydration. Stabilized within hours and began recovery with intensive wound care.",
        beforeImageUrl:
          "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1600&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1600&q=70",
        coverImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=2000&q=70",
      },
    }),
    prisma.animal.upsert({
      where: { slug: "saffron" },
      update: {},
      create: {
        slug: "saffron",
        name: "Saffron",
        species: Species.CAT,
        sex: "UNKNOWN",
        location: "Border Evacuation Shelter",
        country: "Syria",
        warAffected: true,
        rescueDate: new Date("2025-09-18T10:00:00Z"),
        status: "STABLE",
        summary:
          "Rescued from an abandoned apartment block. Treated for smoke inhalation and eye irritation. Showing strong appetite and calm behavior.",
        beforeImageUrl:
          "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1600&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1600&q=70",
      },
    }),
    prisma.animal.upsert({
      where: { slug: "atlas" },
      update: {},
      create: {
        slug: "atlas",
        name: "Atlas",
        species: Species.HORSE,
        sex: "MALE",
        location: "Rural Recovery Ranch",
        country: "Poland",
        warAffected: false,
        rescueDate: new Date("2025-06-12T10:00:00Z"),
        status: "RECOVERED",
        summary:
          "Arrived with severe malnutrition and hoof infections after prolonged neglect. Underwent rehab, nutrition support, and farrier care.",
        beforeImageUrl:
          "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1600&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?auto=format&fit=crop&w=1600&q=70",
      },
    }),
    prisma.animal.upsert({
      where: { slug: "milo" },
      update: {},
      create: {
        slug: "milo",
        name: "Milo",
        species: Species.DOG,
        sex: "MALE",
        location: "Coastal Treatment Unit",
        country: "Turkey",
        warAffected: false,
        rescueDate: new Date("2025-10-02T10:00:00Z"),
        status: "RECOVERING",
        summary:
          "Arrived weak and dehydrated after days without food or water. Treated with fluids, careful feeding, and antibiotics while monitoring vitals.",
        beforeImageUrl:
          "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1600&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=70",
        coverImageUrl:
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=2000&q=70",
      },
    }),
    prisma.animal.upsert({
      where: { slug: "lina" },
      update: {},
      create: {
        slug: "lina",
        name: "Lina",
        species: Species.CAT,
        sex: "FEMALE",
        location: "Temporary Foster Network",
        country: "Lebanon",
        warAffected: false,
        rescueDate: new Date("2025-08-10T10:00:00Z"),
        status: "STABLE",
        summary:
          "Recovered from malnutrition with careful feeding and follow-up checks. Calm behavior and steady weight gain.",
        beforeImageUrl:
          "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1600&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1600&q=70",
        coverImageUrl:
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=2000&q=70",
      },
    }),
    prisma.animal.upsert({
      where: { slug: "ember" },
      update: {},
      create: {
        slug: "ember",
        name: "Ember",
        species: Species.DOG,
        sex: "FEMALE",
        location: "Mobile Field Clinic",
        country: "Ukraine",
        warAffected: true,
        rescueDate: new Date("2025-12-07T10:00:00Z"),
        status: "RECOVERING",
        summary:
          "Treated for soft-tissue trauma and infection risk after a blast-adjacent incident. Rehab plan in progress with mobility monitoring.",
        beforeImageUrl:
          "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1600&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1600&q=70",
        coverImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=2000&q=70",
      },
    }),
    prisma.animal.upsert({
      where: { slug: "noura" },
      update: {},
      create: {
        slug: "noura",
        name: "Noura",
        species: Species.CAT,
        sex: "UNKNOWN",
        location: "Emergency Intake Shelter",
        country: "Syria",
        warAffected: true,
        rescueDate: new Date("2025-10-28T10:00:00Z"),
        status: "RECOVERING",
        summary:
          "Respiratory irritation treated with oxygen support, fluids, and follow-up care. Appetite returning.",
        beforeImageUrl:
          "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1600&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1600&q=70",
        coverImageUrl:
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=2000&q=70",
      },
    }),
    prisma.animal.upsert({
      where: { slug: "zahra" },
      update: {},
      create: {
        slug: "zahra",
        name: "Zahra",
        species: Species.HORSE,
        sex: "FEMALE",
        location: "Rehab Stable",
        country: "Romania",
        warAffected: false,
        rescueDate: new Date("2025-05-06T10:00:00Z"),
        status: "RECOVERING",
        summary:
          "Hoof care, nutrition plan, and gradual conditioning restored strength and mobility after prolonged neglect.",
        beforeImageUrl:
          "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1600&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?auto=format&fit=crop&w=1600&q=70",
        coverImageUrl:
          "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?auto=format&fit=crop&w=2000&q=70",
      },
    }),
    prisma.animal.upsert({
      where: { slug: "rio" },
      update: {},
      create: {
        slug: "rio",
        name: "Rio",
        species: Species.DOG,
        sex: "MALE",
        location: "Urban Rescue Partner Shelter",
        country: "Iraq",
        warAffected: true,
        rescueDate: new Date("2025-07-20T10:00:00Z"),
        status: "STABLE",
        summary:
          "Post-rescue monitoring and vaccinations completed. Awaiting placement with a long-term foster partner.",
        beforeImageUrl:
          "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1600&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1600&q=70",
        coverImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=2000&q=70",
      },
    }),
  ]);

  const amira = animals.find((a) => a.slug === "amira");
  const drSamira = vets.find((v) => v.slug === "dr-samira-haddad");

  if (amira && drSamira) {
    const report = await prisma.rescueReport.upsert({
      where: { id: "seed-amira-initial" },
      update: {},
      create: {
        id: "seed-amira-initial",
        animalId: amira.id,
        veterinarianId: drSamira.id,
        title: "Shrapnel Injury Stabilization",
        injuryDescription:
          "Multiple puncture wounds on left flank with localized infection risk. Dehydration and elevated heart rate on intake.",
        treatmentSteps:
          "IV fluids, wound debridement, antibiotics, pain management, and daily bandage changes. Ongoing monitoring for fever and mobility.",
        publishedAt: new Date("2025-11-06T12:00:00Z"),
      },
    });

    await prisma.progressLog.createMany({
      data: [
        {
          reportId: report.id,
          veterinarianId: drSamira.id,
          loggedAt: new Date("2025-11-07T12:00:00Z"),
          note: "Hydration improved. Appetite returned. Wound edges clean with reduced swelling.",
        },
        {
          reportId: report.id,
          veterinarianId: drSamira.id,
          loggedAt: new Date("2025-11-10T12:00:00Z"),
          note: "Mobility increasing. Transitioned to oral antibiotics. Bandage changes now every 48 hours.",
        },
      ],
    });

    await prisma.attachment.createMany({
      data: [
        {
          reportId: report.id,
          type: "IMAGE",
          url: amira.beforeImageUrl,
          fileName: "amira_before.jpg",
        },
        {
          reportId: report.id,
          type: "IMAGE",
          url: amira.afterImageUrl,
          fileName: "amira_after.jpg",
        },
      ],
    });

    await prisma.recoveryEvent.createMany({
      data: [
        {
          animalId: amira.id,
          happenedAt: new Date("2025-11-04T10:00:00Z"),
          title: "Rescue & Intake",
          description: "Field extraction and emergency stabilization.",
        },
        {
          animalId: amira.id,
          happenedAt: new Date("2025-11-06T12:00:00Z"),
          title: "Surgery & Debridement",
          description: "Wound cleaned and infection risk reduced.",
        },
        {
          animalId: amira.id,
          happenedAt: new Date("2025-11-10T12:00:00Z"),
          title: "Rehab Begins",
          description: "Gentle walks introduced and pain reduced.",
        },
      ],
    });
  }

  await prisma.blogPost.upsert({
    where: { slug: "why-war-zone-rescues-matter" },
    update: {},
    create: {
      slug: "why-war-zone-rescues-matter",
      title: "Why War-Zone Rescues Matter",
      excerpt:
        "Behind every siren is a silent victim. Here’s how field clinics keep animals alive when the world is falling apart.",
      content:
        "War impacts every living being. Animals suffer injuries, displacement, starvation, and abandonment. Our teams work with local partners to evacuate, triage, and treat animals under extreme conditions.\n\nThis platform is built for transparency: stories, timelines, medical reports, and progress logs — so supporters can see the real impact of every donation.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=2000&q=70",
      tags: ["war", "rescue", "medical"],
      publishedAt: new Date("2025-12-01T10:00:00Z"),
    },
  });

  await prisma.subscription.deleteMany({ where: { userId: "seed-nonexistent" } });

  await prisma.donation.deleteMany({ where: { userId: "seed-nonexistent" } });

  const tiers = Object.values(SubscriptionTier);
  if (tiers.length === 0) {
    throw new Error("Subscription tiers missing");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
