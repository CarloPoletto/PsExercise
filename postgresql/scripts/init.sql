CREATE EXTENSION IF NOT EXISTS pgcrypto;

----------------------------------------------------
-- CREATE TABLE
----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    "id" SERIAL PRIMARY KEY,
    "creation_time" TIMESTAMPTZ DEFAULT NOW(),
    "email" VARCHAR(50) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    "id" SERIAL PRIMARY KEY,
    "creation_time" TIMESTAMPTZ DEFAULT NOW(),
    "expiration_date" DATE NOT NULL,
    "user_id" INT4 NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "completed" BOOL NOT NULL,
    "priority" INT4 NOT NULL,
	CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
);

----------------------------------------------------
-- APPLICATION USER
----------------------------------------------------
CREATE USER psuser WITH PASSWORD 'psuser';

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM psuser;

GRANT SELECT ON TABLE public.users TO psuser;
GRANT INSERT ON TABLE public.users TO psuser;
GRANT UPDATE ON TABLE public.users TO psuser;
GRANT DELETE ON TABLE public.users TO psuser;

GRANT SELECT ON TABLE public.tasks TO psuser;
GRANT INSERT ON TABLE public.tasks TO psuser;
GRANT UPDATE ON TABLE public.tasks TO psuser;
GRANT DELETE ON TABLE public.tasks TO psuser;

----------------------------------------------------
-- DEFAULT DATA
----------------------------------------------------
INSERT INTO users 
    ("email", "password") 
VALUES 
    ('user1@email.com', crypt('pass', gen_salt('bf'))),
    ('user2@email.com', crypt('pass', gen_salt('bf'))),
    ('user3@email.com', crypt('pass', gen_salt('bf')))
;

INSERT INTO tasks 
    ("user_id", "expiration_date", "completed", "priority", "title", "description") 
VALUES 
    (1, '2025-01-01', false, 0, 'Task 1', 'Description Task 1'),
    (1, '2025-01-01', false, 1, 'Task 2', 'Description Task 2'),
    (2, '2025-01-01', false, 0, 'Task 1', 'Description Task 1'),
    (2, '2025-01-01', false, 1, 'Task 2', 'Description Task 2'),
    (3, '2025-01-01', false, 0, 'Task 1', 'Description Task 1'),
    (3, '2025-01-01', false, 1, 'Task 2', 'Description Task 2')
;