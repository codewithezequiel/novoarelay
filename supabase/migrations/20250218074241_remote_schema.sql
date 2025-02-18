alter table "public"."events" drop column "date";

alter table "public"."events" drop column "employee_fullName";

alter table "public"."events" add column "company_name" text;

alter table "public"."events" add column "date_completed" timestamp with time zone;

alter table "public"."events" add column "date_initiated" timestamp with time zone;

alter table "public"."events" add column "employee_full_name" text;

alter table "public"."events" add column "vehicle_license_plates" text;

alter table "public"."events" add column "vehicle_model" text;

alter table "public"."events" add column "vehicle_number" bigint;

alter table "public"."events" add column "vin_number" bigint;

alter table "public"."events" alter column "current_location" drop not null;

alter table "public"."events" alter column "dropoff_location" drop not null;

alter table "public"."events" alter column "image_url" drop not null;

alter table "public"."events" alter column "status" drop not null;

alter table "public"."events" alter column "status" set data type text using "status"::text;

alter table "public"."events" add constraint "events_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."events" validate constraint "events_company_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."events"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow users to delete their own invitation"
on "public"."invitations"
as permissive
for delete
to public
using (((auth.uid() IS NOT NULL) AND (auth.email() = email)));


create policy "Enable insert for authenticated users only"
on "public"."profiles"
as permissive
for insert
to authenticated
with check (true);



