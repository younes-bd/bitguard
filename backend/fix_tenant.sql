UPDATE website_website SET tenant_id = (SELECT id FROM tenants_tenant WHERE domain='bitguard.tech' LIMIT 1) WHERE tenant_id IS NULL;
UPDATE website_page SET tenant_id = (SELECT id FROM tenants_tenant WHERE domain='bitguard.tech' LIMIT 1) WHERE tenant_id IS NULL;
UPDATE website_websitemenu SET tenant_id = (SELECT id FROM tenants_tenant WHERE domain='bitguard.tech' LIMIT 1) WHERE tenant_id IS NULL;
UPDATE blog_category SET tenant_id = (SELECT id FROM tenants_tenant WHERE domain='bitguard.tech' LIMIT 1) WHERE tenant_id IS NULL;
UPDATE blog_post SET tenant_id = (SELECT id FROM tenants_tenant WHERE domain='bitguard.tech' LIMIT 1) WHERE tenant_id IS NULL;
