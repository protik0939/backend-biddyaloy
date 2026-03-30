CREATE TABLE "institution_subscription_renewal_payments" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "initiatedByUserId" TEXT NOT NULL,
    "plan" "InstitutionSubscriptionPlan" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "monthsCovered" INTEGER NOT NULL,
    "status" "InstitutionSubscriptionPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "tranId" TEXT NOT NULL,
    "gatewayStatus" TEXT,
    "gatewaySessionKey" TEXT,
    "gatewayValId" TEXT,
    "gatewayBankTranId" TEXT,
    "gatewayCardType" TEXT,
    "gatewayRawPayload" JSONB,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_subscription_renewal_payments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "institution_subscription_renewal_payments_tranId_key"
ON "institution_subscription_renewal_payments"("tranId");

CREATE UNIQUE INDEX "institution_subscription_renewal_payments_gatewaySessionKey_key"
ON "institution_subscription_renewal_payments"("gatewaySessionKey");

CREATE INDEX "institution_subscription_renewal_payments_institutionId_status_createdAt_idx"
ON "institution_subscription_renewal_payments"("institutionId", "status", "createdAt");

CREATE INDEX "institution_subscription_renewal_payments_initiatedByUserId_status_idx"
ON "institution_subscription_renewal_payments"("initiatedByUserId", "status");

ALTER TABLE "institution_subscription_renewal_payments"
ADD CONSTRAINT "institution_subscription_renewal_payments_institutionId_fkey"
FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
