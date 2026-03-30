CREATE TABLE "institution_payment_gateway_credentials" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "sslCommerzStoreIdEncrypted" TEXT NOT NULL,
    "sslCommerzStorePasswordEncrypted" TEXT NOT NULL,
    "sslCommerzBaseUrlEncrypted" TEXT NOT NULL,
    "sslCommerzStoreIdHash" TEXT NOT NULL,
    "sslCommerzStorePasswordHash" TEXT NOT NULL,
    "sslCommerzBaseUrlHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUpdatedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institution_payment_gateway_credentials_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "institution_payment_gateway_credentials_institutionId_key"
ON "institution_payment_gateway_credentials"("institutionId");

CREATE INDEX "institution_payment_gateway_credentials_institutionId_isActive_idx"
ON "institution_payment_gateway_credentials"("institutionId", "isActive");

ALTER TABLE "institution_payment_gateway_credentials"
ADD CONSTRAINT "institution_payment_gateway_credentials_institutionId_fkey"
FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
