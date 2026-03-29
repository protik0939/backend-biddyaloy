-- Create fee configuration table per department + semester/session
CREATE TABLE "department_semester_fee_configurations" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "totalFeeAmount" DECIMAL(12,2) NOT NULL,
    "monthlyFeeAmount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "department_semester_fee_configurations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "department_semester_fee_configurations_departmentId_semesterId_key"
    ON "department_semester_fee_configurations"("departmentId", "semesterId");

CREATE INDEX "department_semester_fee_configurations_institutionId_departmentId_idx"
    ON "department_semester_fee_configurations"("institutionId", "departmentId");

CREATE INDEX "department_semester_fee_configurations_semesterId_idx"
    ON "department_semester_fee_configurations"("semesterId");

-- Create payment transactions table used for SSLCommerz transactional flow
CREATE TABLE "student_fee_payments" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "feeConfigurationId" TEXT NOT NULL,
    "paymentMode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INITIATED',
    "monthsCovered" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "gatewayName" TEXT NOT NULL DEFAULT 'SSLCOMMERZ',
    "tranId" TEXT NOT NULL,
    "gatewaySessionKey" TEXT,
    "gatewayValId" TEXT,
    "gatewayBankTranId" TEXT,
    "gatewayCardType" TEXT,
    "gatewayStatus" TEXT,
    "gatewayRawPayload" JSONB,
    "paymentInitiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "student_fee_payments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "student_fee_payments_tranId_key"
    ON "student_fee_payments"("tranId");

CREATE UNIQUE INDEX "student_fee_payments_gatewaySessionKey_key"
    ON "student_fee_payments"("gatewaySessionKey");

CREATE INDEX "student_fee_payments_studentProfileId_semesterId_idx"
    ON "student_fee_payments"("studentProfileId", "semesterId");

CREATE INDEX "student_fee_payments_departmentId_semesterId_idx"
    ON "student_fee_payments"("departmentId", "semesterId");

CREATE INDEX "student_fee_payments_status_idx"
    ON "student_fee_payments"("status");

ALTER TABLE "department_semester_fee_configurations"
    ADD CONSTRAINT "department_semester_fee_configurations_institutionId_fkey"
    FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "department_semester_fee_configurations"
    ADD CONSTRAINT "department_semester_fee_configurations_departmentId_fkey"
    FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "department_semester_fee_configurations"
    ADD CONSTRAINT "department_semester_fee_configurations_semesterId_fkey"
    FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "student_fee_payments"
    ADD CONSTRAINT "student_fee_payments_institutionId_fkey"
    FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "student_fee_payments"
    ADD CONSTRAINT "student_fee_payments_departmentId_fkey"
    FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "student_fee_payments"
    ADD CONSTRAINT "student_fee_payments_semesterId_fkey"
    FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "student_fee_payments"
    ADD CONSTRAINT "student_fee_payments_studentProfileId_fkey"
    FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "student_fee_payments"
    ADD CONSTRAINT "student_fee_payments_feeConfigurationId_fkey"
    FOREIGN KEY ("feeConfigurationId") REFERENCES "department_semester_fee_configurations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
