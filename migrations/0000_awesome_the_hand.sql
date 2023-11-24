CREATE TABLE IF NOT EXISTS "user" (
	"id" text NOT NULL,
	"email" text NOT NULL,
	"hashed_password" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
