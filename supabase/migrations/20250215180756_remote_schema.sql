drop policy "Employees can read their own invitation" on "public"."invitations";

drop policy "Only invited and registered employees can create a profile" on "public"."profiles";

drop policy "Users can insert their own profile." on "public"."profiles";

create policy "Enable insert for authenticated users only"
on "public"."invitations"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."invitations"
as permissive
for select
to public
using (true);


create policy "Allow company admins and invited employees to create a profile"
on "public"."profiles"
as permissive
for insert
to public
with check (((EXISTS ( SELECT 1
   FROM invitations
  WHERE (invitations.email = auth.email()))) OR (EXISTS ( SELECT 1
   FROM companies
  WHERE (companies.created_by = auth.uid())))));



