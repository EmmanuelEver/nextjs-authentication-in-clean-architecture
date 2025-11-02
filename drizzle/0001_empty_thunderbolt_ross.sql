CREATE TABLE "sessions" (
	"id" varchar(512) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"issuedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"lastActivityAt" timestamp with time zone DEFAULT now() NOT NULL
);
