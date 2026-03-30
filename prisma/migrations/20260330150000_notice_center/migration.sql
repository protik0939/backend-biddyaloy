DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NoticeAudienceRole') THEN
        CREATE TYPE "NoticeAudienceRole" AS ENUM ('ADMIN', 'FACULTY', 'DEPARTMENT', 'TEACHER', 'STUDENT');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "notices" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "senderUserId" TEXT NOT NULL,
    "senderRole" "NoticeAudienceRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "notice_recipient_roles" (
    "id" TEXT NOT NULL,
    "noticeId" TEXT NOT NULL,
    "role" "NoticeAudienceRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notice_recipient_roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "notice_reads" (
    "id" TEXT NOT NULL,
    "noticeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notice_reads_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "notice_recipient_roles_noticeId_role_key" ON "notice_recipient_roles"("noticeId", "role");
CREATE UNIQUE INDEX IF NOT EXISTS "notice_reads_noticeId_userId_key" ON "notice_reads"("noticeId", "userId");

CREATE INDEX IF NOT EXISTS "notices_institutionId_createdAt_idx" ON "notices"("institutionId", "createdAt");
CREATE INDEX IF NOT EXISTS "notices_senderUserId_createdAt_idx" ON "notices"("senderUserId", "createdAt");
CREATE INDEX IF NOT EXISTS "notice_recipient_roles_role_idx" ON "notice_recipient_roles"("role");
CREATE INDEX IF NOT EXISTS "notice_reads_userId_readAt_idx" ON "notice_reads"("userId", "readAt");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'notices_institutionId_fkey'
    ) THEN
        ALTER TABLE "notices"
            ADD CONSTRAINT "notices_institutionId_fkey"
            FOREIGN KEY ("institutionId") REFERENCES "institutions"("id")
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'notices_senderUserId_fkey'
    ) THEN
        ALTER TABLE "notices"
            ADD CONSTRAINT "notices_senderUserId_fkey"
            FOREIGN KEY ("senderUserId") REFERENCES "user"("id")
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'notice_recipient_roles_noticeId_fkey'
    ) THEN
        ALTER TABLE "notice_recipient_roles"
            ADD CONSTRAINT "notice_recipient_roles_noticeId_fkey"
            FOREIGN KEY ("noticeId") REFERENCES "notices"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'notice_reads_noticeId_fkey'
    ) THEN
        ALTER TABLE "notice_reads"
            ADD CONSTRAINT "notice_reads_noticeId_fkey"
            FOREIGN KEY ("noticeId") REFERENCES "notices"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'notice_reads_userId_fkey'
    ) THEN
        ALTER TABLE "notice_reads"
            ADD CONSTRAINT "notice_reads_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "user"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
