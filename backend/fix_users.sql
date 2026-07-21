BEGIN;
--
-- Change Meta options on user
--
-- (no-op)
--
-- Change managers on user
--
-- (no-op)
--
-- Add field created_at to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL);
INSERT INTO "new__users_user" ("id", "created_at") SELECT "id", '2026-07-16 21:27:03.104678' FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
--
-- Add field created_by to user
--
ALTER TABLE "users_user" ADD COLUMN "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED;
--
-- Add field date_joined to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined") SELECT "id", "created_at", "created_by_id", '2026-07-16 21:27:03.163618' FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field email to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email") SELECT "id", "created_at", "created_by_id", "date_joined", '' FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field failed_login_attempts to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts") SELECT "id", "created_at", "created_by_id", "date_joined", "email", 0 FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field first_name to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", '' FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field groups to user
--
CREATE TABLE "users_user_groups" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "user_id" bigint NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "group_id" integer NOT NULL REFERENCES "auth_group" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Add field is_active to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", 1 FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE UNIQUE INDEX "users_user_groups_user_id_group_id_b88eab82_uniq" ON "users_user_groups" ("user_id", "group_id");
CREATE INDEX "users_user_groups_user_id_5f6f5a90" ON "users_user_groups" ("user_id");
CREATE INDEX "users_user_groups_group_id_9afc8d0e" ON "users_user_groups" ("group_id");
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field is_deleted to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", 0 FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field is_locked to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "is_locked" bool NOT NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", 0 FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field is_staff to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "is_locked" bool NOT NULL, "is_staff" bool NOT NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", 0 FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field is_superuser to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "is_locked" bool NOT NULL, "is_staff" bool NOT NULL, "is_superuser" bool NOT NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", 0 FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field is_verified to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "is_locked" bool NOT NULL, "is_staff" bool NOT NULL, "is_superuser" bool NOT NULL, "is_verified" bool NOT NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", 0 FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field last_login to user
--
ALTER TABLE "users_user" ADD COLUMN "last_login" datetime NULL;
--
-- Add field last_login_ip to user
--
ALTER TABLE "users_user" ADD COLUMN "last_login_ip" char(39) NULL;
--
-- Add field last_name to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "is_locked" bool NOT NULL, "is_staff" bool NOT NULL, "is_superuser" bool NOT NULL, "is_verified" bool NOT NULL, "last_login" datetime NULL, "last_login_ip" char(39) NULL, "last_name" varchar(150) NOT NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", '' FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field mfa_enabled to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "is_locked" bool NOT NULL, "is_staff" bool NOT NULL, "is_superuser" bool NOT NULL, "is_verified" bool NOT NULL, "last_login" datetime NULL, "last_login_ip" char(39) NULL, "last_name" varchar(150) NOT NULL, "mfa_enabled" bool NOT NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", 0 FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field mfa_secret to user
--
ALTER TABLE "users_user" ADD COLUMN "mfa_secret" varchar(32) NULL;
--
-- Add field password to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "is_locked" bool NOT NULL, "is_staff" bool NOT NULL, "is_superuser" bool NOT NULL, "is_verified" bool NOT NULL, "last_login" datetime NULL, "last_login_ip" char(39) NULL, "last_name" varchar(150) NOT NULL, "mfa_enabled" bool NOT NULL, "mfa_secret" varchar(32) NULL, "password" varchar(128) NOT NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", "password") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", '' FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field phone_number to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "is_locked" bool NOT NULL, "is_staff" bool NOT NULL, "is_superuser" bool NOT NULL, "is_verified" bool NOT NULL, "last_login" datetime NULL, "last_login_ip" char(39) NULL, "last_name" varchar(150) NOT NULL, "mfa_enabled" bool NOT NULL, "mfa_secret" varchar(32) NULL, "password" varchar(128) NOT NULL, "phone_number" varchar(30) NOT NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", "password", "phone_number") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", "password", '' FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field updated_at to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "is_locked" bool NOT NULL, "is_staff" bool NOT NULL, "is_superuser" bool NOT NULL, "is_verified" bool NOT NULL, "last_login" datetime NULL, "last_login_ip" char(39) NULL, "last_name" varchar(150) NOT NULL, "mfa_enabled" bool NOT NULL, "mfa_secret" varchar(32) NULL, "password" varchar(128) NOT NULL, "phone_number" varchar(30) NOT NULL, "updated_at" datetime NULL, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", "password", "phone_number", "updated_at") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", "password", "phone_number", '2026-07-16 21:27:04.242395' FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Add field user_permissions to user
--
CREATE TABLE "users_user_user_permissions" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "user_id" bigint NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Add field username to user
--
CREATE TABLE "new__users_user" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "is_locked" bool NOT NULL, "is_staff" bool NOT NULL, "is_superuser" bool NOT NULL, "is_verified" bool NOT NULL, "last_login" datetime NULL, "last_login_ip" char(39) NULL, "last_name" varchar(150) NOT NULL, "mfa_enabled" bool NOT NULL, "mfa_secret" varchar(32) NULL, "password" varchar(128) NOT NULL, "phone_number" varchar(30) NOT NULL, "updated_at" datetime NULL, "username" varchar(150) NOT NULL UNIQUE, "created_by_id" bigint NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", "password", "phone_number", "updated_at", "username") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", "password", "phone_number", "updated_at", '' FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE UNIQUE INDEX "users_user_user_permissions_user_id_permission_id_43338c45_uniq" ON "users_user_user_permissions" ("user_id", "permission_id");
CREATE INDEX "users_user_user_permissions_user_id_20aca447" ON "users_user_user_permissions" ("user_id");
CREATE INDEX "users_user_user_permissions_permission_id_0b93982e" ON "users_user_user_permissions" ("permission_id");
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Alter field id on user
--
CREATE TABLE "new__users_user" ("created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "is_locked" bool NOT NULL, "is_staff" bool NOT NULL, "is_superuser" bool NOT NULL, "is_verified" bool NOT NULL, "last_login" datetime NULL, "last_login_ip" char(39) NULL, "last_name" varchar(150) NOT NULL, "mfa_enabled" bool NOT NULL, "mfa_secret" varchar(32) NULL, "password" varchar(128) NOT NULL, "phone_number" varchar(30) NOT NULL, "updated_at" datetime NULL, "username" varchar(150) NOT NULL UNIQUE, "id" char(32) NOT NULL PRIMARY KEY, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", "password", "phone_number", "updated_at", "username", "id") SELECT "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", "password", "phone_number", "updated_at", "username", "id" FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
CREATE TABLE "new__users_user" ("id" char(32) NOT NULL PRIMARY KEY, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "is_locked" bool NOT NULL, "is_staff" bool NOT NULL, "is_superuser" bool NOT NULL, "is_verified" bool NOT NULL, "last_login" datetime NULL, "last_login_ip" char(39) NULL, "last_name" varchar(150) NOT NULL, "mfa_enabled" bool NOT NULL, "mfa_secret" varchar(32) NULL, "password" varchar(128) NOT NULL, "phone_number" varchar(30) NOT NULL, "updated_at" datetime NULL, "username" varchar(150) NOT NULL UNIQUE, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", "password", "phone_number", "updated_at", "username") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", "password", "phone_number", "updated_at", "username" FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
CREATE TABLE "new__tenants_tenant" ("id" char(32) NOT NULL PRIMARY KEY, "is_deleted" bool NOT NULL, "created_at" datetime NULL, "updated_at" datetime NULL, "name" varchar(255) NOT NULL, "domain" varchar(255) NOT NULL UNIQUE, "subscription_plan" varchar(100) NOT NULL, "is_active" bool NOT NULL, "allowed_modules" text NOT NULL CHECK ((JSON_VALID("allowed_modules") OR "allowed_modules" IS NULL)), "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "partner_id" char(32) NULL REFERENCES "core_partner" ("id") DEFERRABLE INITIALLY DEFERRED, "logo" varchar(100) NULL);
INSERT INTO "new__tenants_tenant" ("id", "is_deleted", "created_at", "updated_at", "name", "domain", "subscription_plan", "is_active", "allowed_modules", "created_by_id", "partner_id", "logo") SELECT "id", "is_deleted", "created_at", "updated_at", "name", "domain", "subscription_plan", "is_active", "allowed_modules", "created_by_id", "partner_id", "logo" FROM "tenants_tenant";
DROP TABLE "tenants_tenant";
ALTER TABLE "new__tenants_tenant" RENAME TO "tenants_tenant";
CREATE INDEX "tenants_tenant_created_by_id_f3e30a24" ON "tenants_tenant" ("created_by_id");
CREATE INDEX "tenants_tenant_partner_id_3a074b3c" ON "tenants_tenant" ("partner_id");
CREATE TABLE "new__users_user_groups" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "user_id" char(32) NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "group_id" integer NOT NULL REFERENCES "auth_group" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user_groups" ("id", "user_id", "group_id") SELECT "id", "user_id", "group_id" FROM "users_user_groups";
DROP TABLE "users_user_groups";
ALTER TABLE "new__users_user_groups" RENAME TO "users_user_groups";
CREATE UNIQUE INDEX "users_user_groups_user_id_group_id_b88eab82_uniq" ON "users_user_groups" ("user_id", "group_id");
CREATE INDEX "users_user_groups_user_id_5f6f5a90" ON "users_user_groups" ("user_id");
CREATE INDEX "users_user_groups_group_id_9afc8d0e" ON "users_user_groups" ("group_id");
CREATE TABLE "new__users_user_user_permissions" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "user_id" char(32) NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user_user_permissions" ("id", "user_id", "permission_id") SELECT "id", "user_id", "permission_id" FROM "users_user_user_permissions";
DROP TABLE "users_user_user_permissions";
ALTER TABLE "new__users_user_user_permissions" RENAME TO "users_user_user_permissions";
CREATE UNIQUE INDEX "users_user_user_permissions_user_id_permission_id_43338c45_uniq" ON "users_user_user_permissions" ("user_id", "permission_id");
CREATE INDEX "users_user_user_permissions_user_id_20aca447" ON "users_user_user_permissions" ("user_id");
CREATE INDEX "users_user_user_permissions_permission_id_0b93982e" ON "users_user_user_permissions" ("permission_id");
--
-- Create model ApiKey
--
CREATE TABLE "users_apikey" ("id" char(32) NOT NULL PRIMARY KEY, "is_deleted" bool NOT NULL, "created_at" datetime NULL, "updated_at" datetime NULL, "name" varchar(100) NOT NULL, "key" varchar(64) NOT NULL UNIQUE, "last_used" datetime NULL, "is_active" bool NOT NULL, "expires_at" datetime NULL, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "user_id" char(32) NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Create model LoginActivity
--
CREATE TABLE "users_loginactivity" ("id" char(32) NOT NULL PRIMARY KEY, "is_deleted" bool NOT NULL, "created_at" datetime NULL, "updated_at" datetime NULL, "ip_address" char(39) NOT NULL, "user_agent" varchar(255) NOT NULL, "status" varchar(20) NOT NULL, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "tenant_id" char(32) NULL REFERENCES "tenants_tenant" ("id") DEFERRABLE INITIALLY DEFERRED, "user_id" char(32) NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Create model OTP
--
CREATE TABLE "users_otp" ("id" char(32) NOT NULL PRIMARY KEY, "is_deleted" bool NOT NULL, "created_at" datetime NULL, "updated_at" datetime NULL, "code" varchar(10) NOT NULL, "type" varchar(20) NOT NULL, "is_used" bool NOT NULL, "expires_at" datetime NOT NULL, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "tenant_id" char(32) NULL REFERENCES "tenants_tenant" ("id") DEFERRABLE INITIALLY DEFERRED, "user_id" char(32) NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Create model Role
--
CREATE TABLE "users_role" ("id" char(32) NOT NULL PRIMARY KEY, "is_deleted" bool NOT NULL, "created_at" datetime NULL, "updated_at" datetime NULL, "name" varchar(50) NOT NULL UNIQUE, "description" text NOT NULL, "permissions" text NOT NULL CHECK ((JSON_VALID("permissions") OR "permissions" IS NULL)), "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "parent_id" char(32) NULL REFERENCES "users_role" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Create model RecordRule
--
CREATE TABLE "users_recordrule" ("id" char(32) NOT NULL PRIMARY KEY, "is_deleted" bool NOT NULL, "created_at" datetime NULL, "updated_at" datetime NULL, "name" varchar(255) NOT NULL, "domain_filter" text NOT NULL CHECK ((JSON_VALID("domain_filter") OR "domain_filter" IS NULL)), "is_global" bool NOT NULL, "content_type_id" integer NOT NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "tenant_id" char(32) NULL REFERENCES "tenants_tenant" ("id") DEFERRABLE INITIALLY DEFERRED, "role_id" char(32) NOT NULL REFERENCES "users_role" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Create model SecurityPolicy
--
CREATE TABLE "users_securitypolicy" ("id" char(32) NOT NULL PRIMARY KEY, "is_deleted" bool NOT NULL, "created_at" datetime NULL, "updated_at" datetime NULL, "password_complexity" varchar(20) NOT NULL, "session_timeout" integer NOT NULL, "mfa_required" bool NOT NULL, "api_key_rotation" integer NOT NULL, "ip_whitelist" text NOT NULL, "failed_login_lock" integer NOT NULL, "lock_duration" integer NOT NULL, "concurrent_sessions" varchar(20) NOT NULL, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "tenant_id" char(32) NULL UNIQUE REFERENCES "tenants_tenant" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Create model UserProfile
--
CREATE TABLE "users_userprofile" ("id" char(32) NOT NULL PRIMARY KEY, "is_deleted" bool NOT NULL, "created_at" datetime NULL, "updated_at" datetime NULL, "bio" text NOT NULL, "date_of_birth" date NULL, "gender" varchar(10) NULL, "photo" varchar(100) NOT NULL, "city" varchar(100) NULL, "country" varchar(100) NULL, "language" varchar(10) NOT NULL, "password_last_changed" datetime NULL, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "user_id" char(32) NOT NULL UNIQUE REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Create model UserRole
--
CREATE TABLE "users_userrole" ("id" char(32) NOT NULL PRIMARY KEY, "is_deleted" bool NOT NULL, "created_at" datetime NULL, "updated_at" datetime NULL, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "role_id" char(32) NOT NULL REFERENCES "users_role" ("id") DEFERRABLE INITIALLY DEFERRED, "user_id" char(32) NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Add field roles to user
--
CREATE TABLE "new__users_user" ("id" char(32) NOT NULL PRIMARY KEY, "created_at" datetime NULL, "date_joined" datetime NOT NULL, "email" varchar(254) NOT NULL UNIQUE, "failed_login_attempts" integer NOT NULL, "first_name" varchar(150) NOT NULL, "is_active" bool NOT NULL, "is_deleted" bool NOT NULL, "is_locked" bool NOT NULL, "is_staff" bool NOT NULL, "is_superuser" bool NOT NULL, "is_verified" bool NOT NULL, "last_login" datetime NULL, "last_login_ip" char(39) NULL, "last_name" varchar(150) NOT NULL, "mfa_enabled" bool NOT NULL, "mfa_secret" varchar(32) NULL, "password" varchar(128) NOT NULL, "phone_number" varchar(30) NOT NULL, "updated_at" datetime NULL, "username" varchar(150) NOT NULL UNIQUE, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
INSERT INTO "new__users_user" ("id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", "password", "phone_number", "updated_at", "username") SELECT "id", "created_at", "created_by_id", "date_joined", "email", "failed_login_attempts", "first_name", "is_active", "is_deleted", "is_locked", "is_staff", "is_superuser", "is_verified", "last_login", "last_login_ip", "last_name", "mfa_enabled", "mfa_secret", "password", "phone_number", "updated_at", "username" FROM "users_user";
DROP TABLE "users_user";
ALTER TABLE "new__users_user" RENAME TO "users_user";
CREATE INDEX "users_apikey_created_by_id_56e37d4b" ON "users_apikey" ("created_by_id");
CREATE INDEX "users_apikey_user_id_330aa57f" ON "users_apikey" ("user_id");
CREATE INDEX "users_loginactivity_created_by_id_021d7dfd" ON "users_loginactivity" ("created_by_id");
CREATE INDEX "users_loginactivity_tenant_id_b2b28297" ON "users_loginactivity" ("tenant_id");
CREATE INDEX "users_loginactivity_user_id_877e5806" ON "users_loginactivity" ("user_id");
CREATE INDEX "users_otp_created_by_id_457931c8" ON "users_otp" ("created_by_id");
CREATE INDEX "users_otp_tenant_id_5b6394ab" ON "users_otp" ("tenant_id");
CREATE INDEX "users_otp_user_id_cd09ace3" ON "users_otp" ("user_id");
CREATE INDEX "users_role_created_by_id_fef6dc5a" ON "users_role" ("created_by_id");
CREATE INDEX "users_role_parent_id_ef959611" ON "users_role" ("parent_id");
CREATE INDEX "users_recordrule_content_type_id_7a5701fc" ON "users_recordrule" ("content_type_id");
CREATE INDEX "users_recordrule_created_by_id_3c362e68" ON "users_recordrule" ("created_by_id");
CREATE INDEX "users_recordrule_tenant_id_9b174bce" ON "users_recordrule" ("tenant_id");
CREATE INDEX "users_recordrule_role_id_e4241226" ON "users_recordrule" ("role_id");
CREATE INDEX "users_securitypolicy_created_by_id_8133c212" ON "users_securitypolicy" ("created_by_id");
CREATE INDEX "users_userprofile_created_by_id_cd75107c" ON "users_userprofile" ("created_by_id");
CREATE UNIQUE INDEX "users_userrole_user_id_role_id_00746799_uniq" ON "users_userrole" ("user_id", "role_id");
CREATE INDEX "users_userrole_created_by_id_feb18f0e" ON "users_userrole" ("created_by_id");
CREATE INDEX "users_userrole_role_id_ce44f512" ON "users_userrole" ("role_id");
CREATE INDEX "users_userrole_user_id_ac73ddbe" ON "users_userrole" ("user_id");
CREATE INDEX "users_user_created_by_id_ba0dd846" ON "users_user" ("created_by_id");
--
-- Create model Connection
--
CREATE TABLE "users_connection" ("id" char(32) NOT NULL PRIMARY KEY, "is_deleted" bool NOT NULL, "created_at" datetime NULL, "updated_at" datetime NULL, "status" varchar(20) NOT NULL, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "from_user_id" char(32) NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "tenant_id" char(32) NULL REFERENCES "tenants_tenant" ("id") DEFERRABLE INITIALLY DEFERRED, "to_user_id" char(32) NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Create model Device
--
CREATE TABLE "users_device" ("id" char(32) NOT NULL PRIMARY KEY, "is_deleted" bool NOT NULL, "created_at" datetime NULL, "updated_at" datetime NULL, "name" varchar(255) NOT NULL, "fingerprint" varchar(255) NOT NULL, "is_trusted" bool NOT NULL, "last_login" datetime NOT NULL, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "tenant_id" char(32) NULL REFERENCES "tenants_tenant" ("id") DEFERRABLE INITIALLY DEFERRED, "user_id" char(32) NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Create model RolePermission
--
CREATE TABLE "users_rolepermission" ("id" char(32) NOT NULL PRIMARY KEY, "is_deleted" bool NOT NULL, "created_at" datetime NULL, "updated_at" datetime NULL, "can_read" bool NOT NULL, "can_write" bool NOT NULL, "can_create" bool NOT NULL, "can_delete" bool NOT NULL, "content_type_id" integer NOT NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "role_id" char(32) NOT NULL REFERENCES "users_role" ("id") DEFERRABLE INITIALLY DEFERRED, "tenant_id" char(32) NULL REFERENCES "tenants_tenant" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Create model TenantMembership
--
CREATE TABLE "users_tenantmembership" ("id" char(32) NOT NULL PRIMARY KEY, "is_deleted" bool NOT NULL, "created_at" datetime NULL, "updated_at" datetime NULL, "is_active" bool NOT NULL, "created_by_id" char(32) NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED, "tenant_id" char(32) NOT NULL REFERENCES "tenants_tenant" ("id") DEFERRABLE INITIALLY DEFERRED, "user_id" char(32) NOT NULL REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED);
CREATE UNIQUE INDEX "users_connection_from_user_id_to_user_id_ebecea88_uniq" ON "users_connection" ("from_user_id", "to_user_id");
CREATE INDEX "users_connection_created_by_id_8fe9da7b" ON "users_connection" ("created_by_id");
CREATE INDEX "users_connection_from_user_id_9e700e20" ON "users_connection" ("from_user_id");
CREATE INDEX "users_connection_tenant_id_ec43eaf1" ON "users_connection" ("tenant_id");
CREATE INDEX "users_connection_to_user_id_4b11bf64" ON "users_connection" ("to_user_id");
CREATE UNIQUE INDEX "users_device_user_id_fingerprint_f085c3df_uniq" ON "users_device" ("user_id", "fingerprint");
CREATE INDEX "users_device_created_by_id_581585c5" ON "users_device" ("created_by_id");
CREATE INDEX "users_device_tenant_id_c035d132" ON "users_device" ("tenant_id");
CREATE INDEX "users_device_user_id_7f43d271" ON "users_device" ("user_id");
CREATE UNIQUE INDEX "users_rolepermission_role_id_content_type_id_29d412d1_uniq" ON "users_rolepermission" ("role_id", "content_type_id");
CREATE INDEX "users_rolepermission_content_type_id_ede362fb" ON "users_rolepermission" ("content_type_id");
CREATE INDEX "users_rolepermission_created_by_id_c0d12544" ON "users_rolepermission" ("created_by_id");
CREATE INDEX "users_rolepermission_role_id_d36df18a" ON "users_rolepermission" ("role_id");
CREATE INDEX "users_rolepermission_tenant_id_eb163bbb" ON "users_rolepermission" ("tenant_id");
CREATE UNIQUE INDEX "users_tenantmembership_user_id_tenant_id_3d74f908_uniq" ON "users_tenantmembership" ("user_id", "tenant_id");
CREATE INDEX "users_tenantmembership_created_by_id_a6520752" ON "users_tenantmembership" ("created_by_id");
CREATE INDEX "users_tenantmembership_tenant_id_25e88e95" ON "users_tenantmembership" ("tenant_id");
CREATE INDEX "users_tenantmembership_user_id_791916a7" ON "users_tenantmembership" ("user_id");
COMMIT;
