DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InstitutionSubscriptionPlan') THEN
        CREATE TYPE "InstitutionSubscriptionPlan" AS ENUM ('MONTHLY', 'HALF_YEARLY', 'YEARLY');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InstitutionSubscriptionPaymentStatus') THEN
        CREATE TYPE "InstitutionSubscriptionPaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InstitutionSubscriptionStatus') THEN
        CREATE TYPE "InstitutionSubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');
    END IF;
END $$;

ALTER TABLE "institution_applications"
    ALTER COLUMN "subscriptionPlan" DROP DEFAULT,
    ALTER COLUMN "subscriptionPlan" TYPE "InstitutionSubscriptionPlan"
        USING (CASE
            WHEN "subscriptionPlan" IS NULL THEN NULL
            ELSE "subscriptionPlan"::"InstitutionSubscriptionPlan"
        END),
    ALTER COLUMN "subscriptionPaymentStatus" DROP DEFAULT,
    ALTER COLUMN "subscriptionPaymentStatus" TYPE "InstitutionSubscriptionPaymentStatus"
        USING ("subscriptionPaymentStatus"::"InstitutionSubscriptionPaymentStatus"),
    ALTER COLUMN "subscriptionPaymentStatus" SET DEFAULT 'PENDING';

ALTER TABLE "institution_subscriptions"
    ALTER COLUMN "plan" TYPE "InstitutionSubscriptionPlan"
        USING ("plan"::"InstitutionSubscriptionPlan"),
    ALTER COLUMN "status" DROP DEFAULT,
    ALTER COLUMN "status" TYPE "InstitutionSubscriptionStatus"
        USING ("status"::"InstitutionSubscriptionStatus"),
    ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
