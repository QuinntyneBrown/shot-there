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

-- ICD §13.2: backdrops are a list
ALTER TABLE "Studio" ALTER COLUMN "backdrops" TYPE TEXT[]
  USING CASE WHEN "backdrops" IS NULL OR btrim("backdrops") = '' THEN ARRAY[]::TEXT[] ELSE ARRAY["backdrops"] END;
ALTER TABLE "Studio" ALTER COLUMN "backdrops" SET DEFAULT ARRAY[]::TEXT[];

-- ICD §13.1 A8: spots carry an episode title like studios
ALTER TABLE "Spot" ADD COLUMN "episodeTitle" TEXT;

-- ICD §13.6, §13.12, A21, OI-8: guides store a summary and their data points; introduction and entry notes may be empty
CREATE TYPE "GuideDataPointKey" AS ENUM ('all_in_cost_2h', 'overall_score');
ALTER TABLE "Guide" ADD COLUMN "summary" TEXT;
ALTER TABLE "Guide" ADD COLUMN "dataPoints" "GuideDataPointKey"[] DEFAULT ARRAY[]::"GuideDataPointKey"[];
-- Existing guides showed both facts on studio entries; keep that.
UPDATE "Guide" SET "dataPoints" = ARRAY['all_in_cost_2h', 'overall_score']::"GuideDataPointKey"[];
ALTER TABLE "Guide" ALTER COLUMN "introduction" DROP NOT NULL;
UPDATE "Guide" SET "introduction" = NULL WHERE btrim("introduction") = '';
ALTER TABLE "GuideEntry" ALTER COLUMN "note" DROP NOT NULL;
UPDATE "GuideEntry" SET "note" = NULL WHERE btrim("note") = '';

-- ICD §13.10: the parking note is not part of the studio contract
ALTER TABLE "Studio" DROP COLUMN "parkingNote";
