DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'StudentFeePaymentMode'
    ) THEN
        CREATE TYPE "StudentFeePaymentMode" AS ENUM ('MONTHLY', 'FULL');
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'StudentFeePaymentStatus'
    ) THEN
        CREATE TYPE "StudentFeePaymentStatus" AS ENUM ('INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'CANCELLED');
    END IF;
END $$;

ALTER TABLE "student_fee_payments"
    ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "student_fee_payments"
    ALTER COLUMN "paymentMode" TYPE "StudentFeePaymentMode"
    USING "paymentMode"::"StudentFeePaymentMode";

ALTER TABLE "student_fee_payments"
    ALTER COLUMN "status" TYPE "StudentFeePaymentStatus"
    USING "status"::"StudentFeePaymentStatus";

ALTER TABLE "student_fee_payments"
    ALTER COLUMN "status" SET DEFAULT 'INITIATED'::"StudentFeePaymentStatus";
