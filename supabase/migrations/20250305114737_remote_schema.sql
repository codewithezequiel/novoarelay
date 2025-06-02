create schema if not exists "gis";

create extension if not exists "postgis" with schema "gis" version '3.3.7';

-- create type "gis"."geometry_dump" as ("path" integer[], "geom" gis.geometry);

-- create type "gis"."valid_detail" as ("valid" boolean, "reason" character varying, "location" gis.geometry);


create sequence "public"."truck_locations_id_seq";

drop policy "Enable read access for all users" on "public"."events";

create table "public"."truck_locations" (
    "id" integer not null default nextval('truck_locations_id_seq'::regclass),
    "truck_id" uuid not null default gen_random_uuid(),
    "location" gis.geography(Point,4326),
    "last_updated" timestamp without time zone default CURRENT_TIMESTAMP,
    "profile_id" uuid,
    "company_id" uuid,
    "location_source" text default 'phone'::text,
    "status" text default 'active'::text
);


alter table "public"."truck_locations" enable row level security;

create table "public"."trucks" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid,
    "name" text not null,
    "license_plate" text not null,
    "model" text,
    "year" integer,
    "status" text,
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now()
);


alter table "public"."trucks" enable row level security;

alter table "public"."events" drop column "employee_image_url";

alter table "public"."events" drop column "vehicle_license_plates";

alter table "public"."events" drop column "vehicle_model";

alter table "public"."events" drop column "vehicle_number";

alter table "public"."events" drop column "vin_number";

alter table "public"."events" add column "dropoff_location_point" gis.geography(Point,4326);

alter table "public"."events" add column "pickup_location_point" gis.geography(Point,4326);

alter sequence "public"."truck_locations_id_seq" owned by "public"."truck_locations"."id";

CREATE INDEX events_dropoff_location_index ON public.events USING gist (dropoff_location_point);

CREATE INDEX events_pickup_location_index ON public.events USING gist (pickup_location_point);

CREATE INDEX truck_locations_geo_index ON public.truck_locations USING gist (location);

CREATE UNIQUE INDEX truck_locations_pkey ON public.truck_locations USING btree (id);

CREATE INDEX truck_locations_truck_id_idx ON public.truck_locations USING btree (truck_id);

CREATE UNIQUE INDEX trucks_license_plate_key ON public.trucks USING btree (license_plate);

CREATE UNIQUE INDEX trucks_pkey ON public.trucks USING btree (id);

alter table "public"."truck_locations" add constraint "truck_locations_pkey" PRIMARY KEY using index "truck_locations_pkey";

alter table "public"."trucks" add constraint "trucks_pkey" PRIMARY KEY using index "trucks_pkey";

alter table "public"."truck_locations" add constraint "fk_company" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL not valid;

alter table "public"."truck_locations" validate constraint "fk_company";

alter table "public"."truck_locations" add constraint "fk_profile" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL not valid;

alter table "public"."truck_locations" validate constraint "fk_profile";

alter table "public"."truck_locations" add constraint "fk_truck_id" FOREIGN KEY (truck_id) REFERENCES trucks(id) ON DELETE CASCADE not valid;

alter table "public"."truck_locations" validate constraint "fk_truck_id";

alter table "public"."trucks" add constraint "trucks_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."trucks" validate constraint "trucks_company_id_fkey";

alter table "public"."trucks" add constraint "trucks_license_plate_key" UNIQUE using index "trucks_license_plate_key";

alter table "public"."trucks" add constraint "trucks_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'maintenance'::text]))) not valid;

alter table "public"."trucks" validate constraint "trucks_status_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.nearby_events(lat double precision, long double precision)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, user_id uuid, company_id uuid, device_id uuid, status text, pickup_location text, dropoff_location text, current_location text, description text, image_url text, employee_full_name text, date_completed timestamp with time zone, company_name text, date_initiated timestamp with time zone, lat double precision, long double precision, dist_meters double precision, avatar_url text)
 LANGUAGE sql
 SET search_path TO ''
AS $function$
SELECT 
  e.id, 
  e.created_at, 
  e.user_id, 
  e.company_id, 
  e.device_id, 
  e.status, 
  e.pickup_location, 
  e.dropoff_location, 
  e.current_location, 
  e.description, 
  e.image_url, 
  e.employee_full_name, 
  e.date_completed, 
  e.company_name, 
  e.date_initiated, 
  gis.st_y(e.pickup_location_point::gis.geometry) AS lat, 
  gis.st_x(e.pickup_location_point::gis.geometry) AS long, 
  gis.st_distance(e.pickup_location_point, gis.st_point(long, lat)::gis.geography) AS dist_meters,
  p.avatar_url -- ✅ Join column
FROM 
  public.events e
JOIN 
  public.profiles p ON e.user_id = p.id -- Join profiles
ORDER BY 
  e.pickup_location_point operator(gis.<->) gis.st_point(long, lat)::gis.geography;
$function$
;

grant delete on table "public"."truck_locations" to "anon";

grant insert on table "public"."truck_locations" to "anon";

grant references on table "public"."truck_locations" to "anon";

grant select on table "public"."truck_locations" to "anon";

grant trigger on table "public"."truck_locations" to "anon";

grant truncate on table "public"."truck_locations" to "anon";

grant update on table "public"."truck_locations" to "anon";

grant delete on table "public"."truck_locations" to "authenticated";

grant insert on table "public"."truck_locations" to "authenticated";

grant references on table "public"."truck_locations" to "authenticated";

grant select on table "public"."truck_locations" to "authenticated";

grant trigger on table "public"."truck_locations" to "authenticated";

grant truncate on table "public"."truck_locations" to "authenticated";

grant update on table "public"."truck_locations" to "authenticated";

grant delete on table "public"."truck_locations" to "service_role";

grant insert on table "public"."truck_locations" to "service_role";

grant references on table "public"."truck_locations" to "service_role";

grant select on table "public"."truck_locations" to "service_role";

grant trigger on table "public"."truck_locations" to "service_role";

grant truncate on table "public"."truck_locations" to "service_role";

grant update on table "public"."truck_locations" to "service_role";

grant delete on table "public"."trucks" to "anon";

grant insert on table "public"."trucks" to "anon";

grant references on table "public"."trucks" to "anon";

grant select on table "public"."trucks" to "anon";

grant trigger on table "public"."trucks" to "anon";

grant truncate on table "public"."trucks" to "anon";

grant update on table "public"."trucks" to "anon";

grant delete on table "public"."trucks" to "authenticated";

grant insert on table "public"."trucks" to "authenticated";

grant references on table "public"."trucks" to "authenticated";

grant select on table "public"."trucks" to "authenticated";

grant trigger on table "public"."trucks" to "authenticated";

grant truncate on table "public"."trucks" to "authenticated";

grant update on table "public"."trucks" to "authenticated";

grant delete on table "public"."trucks" to "service_role";

grant insert on table "public"."trucks" to "service_role";

grant references on table "public"."trucks" to "service_role";

grant select on table "public"."trucks" to "service_role";

grant trigger on table "public"."trucks" to "service_role";

grant truncate on table "public"."trucks" to "service_role";

grant update on table "public"."trucks" to "service_role";

create policy "Enable insert for users based on user_id"
on "public"."events"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "admin_can_delete_company_events"
on "public"."events"
as permissive
for delete
to public
using (((company_id = ( SELECT profiles.company_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))) AND (( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::text)));


create policy "admin_can_edit_company_events"
on "public"."events"
as permissive
for update
to public
using (((company_id = ( SELECT profiles.company_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))) AND (( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::text)));


create policy "admin_can_view_company_events"
on "public"."events"
as permissive
for select
to public
using (((company_id = ( SELECT profiles.company_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))) AND (( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::text)));


create policy "employee_can_delete_own_events"
on "public"."events"
as permissive
for delete
to public
using (((auth.uid() = user_id) AND (( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'employee'::text)));


create policy "employee_can_edit_own_events"
on "public"."events"
as permissive
for update
to public
using (((auth.uid() = user_id) AND (( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'employee'::text)));


create policy "employee_can_view_own_events"
on "public"."events"
as permissive
for select
to public
using (((auth.uid() = user_id) AND (( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'employee'::text)));


create policy "Allow read access on avatar_url"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Enable insert for authenticated users only"
on "public"."truck_locations"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."trucks"
as permissive
for insert
to authenticated
with check (true);



