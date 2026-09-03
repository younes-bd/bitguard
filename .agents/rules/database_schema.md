---
name: Core Database Schema
description: Provides the foundational Django ORM models and multi-tenancy rules.
trigger: always_on
---

# Core Database & Security Schema

This document outlines the core database models and security mechanisms.

## The Prime Law: Multi-Tenancy
*   This is a Micro-SaaS architecture. **EVERY** business model must inherit from `TenantAwareModel` (found in `core.models` or `system.domain.models`).
*   When writing Django ORM queries, you must ALWAYS filter by the active tenant: `Model.objects.filter(tenant=request.user.tenant)`.
*   Failing to filter by `tenant` will cause catastrophic data bleed between companies.

## Core Models Reference

### 1. User Model (`apps.users.domain.models.User`)
*   Extends Django's `AbstractUser`.
*   **Crucial Fields:** `tenant` (ForeignKey), `role` (String/Enum), `mfa_enabled` (Boolean).
*   **Auth:** Login operates across tenants, but once logged in, a user's session is strictly bound to their `tenant`.

### 2. Tenant Model (`apps.tenants.domain.models.Tenant`)
*   Represents a distinct company or organization using the ERP.
*   **Crucial Fields:** `name`, `subdomain`, `is_active`.

### 3. Module Registry (`apps.system.domain.models.InstalledModule`)
*   Tracks which apps are installed for which tenant.
*   **Crucial Fields:** `technical_name` (String, e.g., 'sales', 'accounting'), `is_installed` (Boolean), `version`.

## Record Rules (Row-Level Security)
*   The system uses `RecordRule` models to define domain-level security (similar to Odoo's `ir.rule`).
*   Even if a ViewSet is exposed, the base QuerySet must evaluate `RecordRules` to ensure the user has mathematical permission to read/write the row.
