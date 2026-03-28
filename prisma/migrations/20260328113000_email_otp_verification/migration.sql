CREATE TABLE "email_otps" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "otpHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "email_otps_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "email_otps_userId_key" ON "email_otps"("userId");
CREATE INDEX "email_otps_expiresAt_idx" ON "email_otps"("expiresAt");

ALTER TABLE "email_otps"
  ADD CONSTRAINT "email_otps_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
