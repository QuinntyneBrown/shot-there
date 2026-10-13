-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "LocationStatus" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "Disclosure" AS ENUM ('paid_in_full', 'discounted', 'comped');

-- CreateEnum
CREATE TYPE "LightRating" AS ENUM ('none', 'low', 'medium', 'strong');

-- CreateEnum
CREATE TYPE "LoadIn" AS ENUM ('stairs', 'elevator', 'freightElevator');

-- CreateEnum
CREATE TYPE "ParkingOption" AS ENUM ('onSite', 'street', 'none');

-- CreateEnum
CREATE TYPE "GearCategory" AS ENUM ('lights', 'modifiers', 'stands', 'other');

-- CreateEnum
CREATE TYPE "SpotType" AS ENUM ('park', 'architecture', 'waterfront', 'indoorPublic');

-- CreateEnum
CREATE TYPE "CrowdLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "ShootType" AS ENUM ('portrait', 'weddingEngagement', 'commercial', 'video');

-- CreateEnum
CREATE TYPE "BestUse" AS ENUM ('engagement', 'family', 'portrait', 'brand', 'video');

-- CreateEnum
CREATE TYPE "ImageRole" AS ENUM ('testShot', 'gallery', 'sampleShot');

-- CreateEnum
CREATE TYPE "ImageFormat" AS ENUM ('avif', 'webp', 'jpeg');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('studio', 'spot', 'guide');

-- CreateTable
CREATE TABLE "Studio" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "LocationStatus" NOT NULL DEFAULT 'draft',
    "name" TEXT NOT NULL,
    "neighbourhood" TEXT,
    "addressOrCrossStreets" TEXT,
    "bookingUrl" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "hourlyRate" DECIMAL(10,2),
    "minBookingHours" DECIMAL(4,2),
    "priceVerifiedAt" DATE NOT NULL,
    "usableWidthM" DECIMAL(6,2),
    "usableDepthM" DECIMAL(6,2),
    "ceilingHeightM" DECIMAL(6,2),
    "windowDirection" TEXT,
    "lightMorning" "LightRating",
    "lightMidday" "LightRating",
    "lightAfternoon" "LightRating",
    "lightEvening" "LightRating",
    "outletCount" INTEGER,
    "outletType" TEXT,
    "has20ACircuits" BOOLEAN,
    "hasCycWall" BOOLEAN,
    "cycWallCondition" TEXT,
    "backdrops" TEXT,
    "loadIn" "LoadIn",
    "loadInNote" TEXT,
    "parking" "ParkingOption",
    "parkingNote" TEXT,
    "transit" TEXT,
    "washroom" TEXT,
    "changingArea" TEXT,
    "clientSeating" TEXT,
    "noise" TEXT,
    "whoItsFor" TEXT,
    "whoShouldSkip" TEXT,
    "scoreValue" INTEGER,
    "scoreLight" INTEGER,
    "scoreSpace" INTEGER,
    "scoreGear" INTEGER,
    "scoreLogistics" INTEGER,
    "scoreCondition" INTEGER,
    "disclosure" "Disclosure",
    "disclosureProvider" TEXT,
    "videoId" TEXT,
    "episodeTitle" TEXT,
    "ogImageUrl" TEXT,
    "reviewedAt" DATE,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Studio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudioFee" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "mandatory" BOOLEAN NOT NULL,

    CONSTRAINT "StudioFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearItem" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "category" "GearCategory" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "included" BOOLEAN NOT NULL,
    "extraCost" DECIMAL(10,2),

    CONSTRAINT "GearItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "studioId" TEXT,
    "spotId" TEXT,
    "role" "ImageRole" NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "altText" TEXT NOT NULL,
    "caption" TEXT,
    "focalLengthMm" INTEGER,
    "angleNote" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageVariant" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "format" "ImageFormat" NOT NULL,
    "storageKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ImageVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spot" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "LocationStatus" NOT NULL DEFAULT 'draft',
    "name" TEXT NOT NULL,
    "neighbourhood" TEXT,
    "type" "SpotType",
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "directions" TEXT,
    "lightByTime" JSONB NOT NULL DEFAULT '[]',
    "lightBySeason" JSONB NOT NULL DEFAULT '[]',
    "weekdayCrowds" "CrowdLevel",
    "weekendCrowds" "CrowdLevel",
    "parking" TEXT,
    "washrooms" TEXT,
    "changing" TEXT,
    "permitSourceUrl" TEXT,
    "permitVerifiedAt" DATE NOT NULL,
    "bestUses" "BestUse"[],
    "disclosure" "Disclosure",
    "disclosureProvider" TEXT,
    "videoId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermitStatus" (
    "id" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,
    "shootType" "ShootType" NOT NULL,
    "required" BOOLEAN NOT NULL,

    CONSTRAINT "PermitStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "LocationStatus" NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideEntry" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "studioId" TEXT,
    "spotId" TEXT,
    "note" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "GuideEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlugRedirect" (
    "id" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "fromSlug" TEXT NOT NULL,
    "toSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlugRedirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL,
    "sourcePath" TEXT NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerSession" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "csrfToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnerSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignInAttempt" (
    "id" TEXT NOT NULL,
    "clientKey" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignInAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Studio_slug_key" ON "Studio"("slug");

-- CreateIndex
CREATE INDEX "Studio_name_idx" ON "Studio"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Image_storageKey_key" ON "Image"("storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "ImageVariant_storageKey_key" ON "ImageVariant"("storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "Spot_slug_key" ON "Spot"("slug");

-- CreateIndex
CREATE INDEX "Spot_name_idx" ON "Spot"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PermitStatus_spotId_shootType_key" ON "PermitStatus"("spotId", "shootType");

-- CreateIndex
CREATE UNIQUE INDEX "Guide_slug_key" ON "Guide"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GuideEntry_guideId_studioId_key" ON "GuideEntry"("guideId", "studioId");

-- CreateIndex
CREATE UNIQUE INDEX "GuideEntry_guideId_spotId_key" ON "GuideEntry"("guideId", "spotId");

-- CreateIndex
CREATE UNIQUE INDEX "SlugRedirect_type_fromSlug_key" ON "SlugRedirect"("type", "fromSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_email_key" ON "Owner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OwnerSession_tokenHash_key" ON "OwnerSession"("tokenHash");

-- CreateIndex
CREATE INDEX "SignInAttempt_clientKey_attemptedAt_idx" ON "SignInAttempt"("clientKey", "attemptedAt");

-- CreateIndex
CREATE INDEX "SignInAttempt_email_attemptedAt_idx" ON "SignInAttempt"("email", "attemptedAt");

-- AddForeignKey
ALTER TABLE "StudioFee" ADD CONSTRAINT "StudioFee_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearItem" ADD CONSTRAINT "GearItem_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageVariant" ADD CONSTRAINT "ImageVariant_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermitStatus" ADD CONSTRAINT "PermitStatus_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideEntry" ADD CONSTRAINT "GuideEntry_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideEntry" ADD CONSTRAINT "GuideEntry_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideEntry" ADD CONSTRAINT "GuideEntry_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerSession" ADD CONSTRAINT "OwnerSession_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
