ALTER TABLE "institution_applications"
    ADD COLUMN "subscriptionPlan" TEXT,
    ADD COLUMN "subscriptionAmount" DECIMAL(12,2),
    ADD COLUMN "subscriptionCurrency" TEXT NOT NULL DEFAULT 'BDT',
    ADD COLUMN "subscriptionMonths" INTEGER,
    ADD COLUMN "subscriptionPaymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    ADD COLUMN "subscriptionTranId" TEXT,
    ADD COLUMN "subscriptionGatewayStatus" TEXT,
    ADD COLUMN "subscriptionGatewaySessionKey" TEXT,
    ADD COLUMN "subscriptionGatewayValId" TEXT,
    ADD COLUMN "subscriptionGatewayBankTranId" TEXT,
    ADD COLUMN "subscriptionGatewayCardType" TEXT,
    ADD COLUMN "subscriptionGatewayRawPayload" JSONB,
    ADD COLUMN "subscriptionPaidAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "institution_applications_subscriptionTranId_key"
    ON "institution_applications"("subscriptionTranId");

CREATE UNIQUE INDEX "institution_applications_subscriptionGatewaySessionKey_key"
    ON "institution_applications"("subscriptionGatewaySessionKey");

CREATE TABLE "institution_subscriptions" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "sourceApplicationId" TEXT,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "monthsCovered" INTEGER NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "institution_subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "institution_subscriptions_institutionId_status_endsAt_idx"
    ON "institution_subscriptions"("institutionId", "status", "endsAt");

CREATE INDEX "institution_subscriptions_sourceApplicationId_idx"
    ON "institution_subscriptions"("sourceApplicationId");

ALTER TABLE "institution_subscriptions"
    ADD CONSTRAINT "institution_subscriptions_institutionId_fkey"
    FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "institution_subscriptions"
    ADD CONSTRAINT "institution_subscriptions_sourceApplicationId_fkey"
    FOREIGN KEY ("sourceApplicationId") REFERENCES "institution_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
