-- Solo lectura. Ejecutar en el editor SQL del proyecto Supabase existente.
-- Este archivo inspecciona la configuración: no habilita ni modifica políticas.
select n.nspname as esquema, c.relname as tabla,
       c.relrowsecurity as rls_habilitado, c.relforcerowsecurity as rls_forzado
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in ('reservas', 'restaurantes', 'favoritos', 'perfiles');

select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename in ('reservas', 'restaurantes', 'favoritos', 'perfiles')
order by tablename, policyname;

select table_name, column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name in ('reservas', 'restaurantes', 'favoritos', 'perfiles')
order by table_name, ordinal_position;