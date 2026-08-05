begin;

alter table public.exam_attempts
add column if not exists question_ids text[] not null default '{}';

commit;
