BEGIN;
--
-- Remove field created_by from integrationkey
--
SET CONSTRAINTS "system_integrationkey_created_by_id_a4305ea8_fk_users_user_id" IMMEDIATE; ALTER TABLE "system_integrationkey" DROP CONSTRAINT "system_integrationkey_created_by_id_a4305ea8_fk_users_user_id";
ALTER TABLE "system_integrationkey" DROP COLUMN "created_by_id" CASCADE;
--
-- Remove field tenant from integrationkey
--
SET CONSTRAINTS "system_integrationkey_tenant_id_ede8b8c8_fk_tenants_tenant_id" IMMEDIATE; ALTER TABLE "system_integrationkey" DROP CONSTRAINT "system_integrationkey_tenant_id_ede8b8c8_fk_tenants_tenant_id";
ALTER TABLE "system_integrationkey" DROP COLUMN "tenant_id" CASCADE;
--
-- Alter unique_together for systemsetting (0 constraint(s))
--
ALTER TABLE "system_systemsetting" DROP CONSTRAINT "system_systemsetting_tenant_id_key_0baf4e79_uniq";
--
-- Remove field created_by from systemsetting
--
SET CONSTRAINTS "system_systemsetting_created_by_id_93f1f090_fk_users_user_id" IMMEDIATE; ALTER TABLE "system_systemsetting" DROP CONSTRAINT "system_systemsetting_created_by_id_93f1f090_fk_users_user_id";
ALTER TABLE "system_systemsetting" DROP COLUMN "created_by_id" CASCADE;
--
-- Remove field tenant from systemsetting
--
SET CONSTRAINTS "system_systemsetting_tenant_id_1ec26050_fk_tenants_tenant_id" IMMEDIATE; ALTER TABLE "system_systemsetting" DROP CONSTRAINT "system_systemsetting_tenant_id_1ec26050_fk_tenants_tenant_id";
ALTER TABLE "system_systemsetting" DROP COLUMN "tenant_id" CASCADE;
--
-- Remove field created_by from webhookendpoint
--
SET CONSTRAINTS "system_webhookendpoint_created_by_id_6fefcb41_fk_users_user_id" IMMEDIATE; ALTER TABLE "system_webhookendpoint" DROP CONSTRAINT "system_webhookendpoint_created_by_id_6fefcb41_fk_users_user_id";
ALTER TABLE "system_webhookendpoint" DROP COLUMN "created_by_id" CASCADE;
--
-- Remove field tenant from webhookendpoint
--
SET CONSTRAINTS "system_webhookendpoint_tenant_id_80acb490_fk_tenants_tenant_id" IMMEDIATE; ALTER TABLE "system_webhookendpoint" DROP CONSTRAINT "system_webhookendpoint_tenant_id_80acb490_fk_tenants_tenant_id";
ALTER TABLE "system_webhookendpoint" DROP COLUMN "tenant_id" CASCADE;
--
-- Create model ApiKey
--
CREATE TABLE "base_setup_apikey" ("id" uuid NOT NULL PRIMARY KEY, "is_deleted" boolean NOT NULL, "created_at" timestamp with time zone NULL, "updated_at" timestamp with time zone NULL, "name" varchar(255) NOT NULL, "key_prefix" varchar(10) NOT NULL, "hashed_key" varchar(128) NOT NULL, "is_active" boolean NOT NULL, "last_used_at" timestamp with time zone NULL, "expires_at" timestamp with time zone NULL, "created_by_id" uuid NULL, "tenant_id" uuid NULL);
--
-- Delete model DatabaseBackup
--
DROP TABLE "system_databasebackup" CASCADE;
--
-- Delete model IntegrationKey
--
DROP TABLE "system_integrationkey" CASCADE;
--
-- Delete model SystemSetting
--
DROP TABLE "system_systemsetting" CASCADE;
--
-- Delete model WebhookEndpoint
--
DROP TABLE "system_webhookendpoint" CASCADE;
ALTER TABLE "base_setup_apikey" ADD CONSTRAINT "base_setup_apikey_created_by_id_1f88f32a_fk_users_user_id" FOREIGN KEY ("created_by_id") REFERENCES "users_user" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "base_setup_apikey" ADD CONSTRAINT "base_setup_apikey_tenant_id_cf667bfe_fk_tenants_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants_tenant" ("id") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX "base_setup_apikey_created_by_id_1f88f32a" ON "base_setup_apikey" ("created_by_id");
CREATE INDEX "base_setup_apikey_tenant_id_cf667bfe" ON "base_setup_apikey" ("tenant_id");
COMMIT;
