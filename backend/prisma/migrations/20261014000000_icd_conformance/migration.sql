-- ICD-001 conformance. Enum values are renamed in place so stored rows keep their meaning.

-- ICD §14: enumeration values are snake_case
ALTER TYPE "LoadIn" RENAME VALUE 'freightElevator' TO 'freight_elevator';
ALTER TYPE "ParkingOption" RENAME VALUE 'onSite' TO 'on_site';
ALTER TYPE "SpotType" RENAME VALUE 'indoorPublic' TO 'indoor_public';
ALTER TYPE "ImageRole" RENAME VALUE 'testShot' TO 'test_shot';
ALTER TYPE "ImageRole" RENAME VALUE 'sampleShot' TO 'sample_shot';
ALTER TYPE "GearCategory" ADD VALUE 'backdrops' BEFORE 'other';

-- ICD OI-4: a studio's review time is the time of its latest publish (publishedAt)
ALTER TABLE "Studio" DROP COLUMN "reviewedAt";
