TRUNCATE Session, Files, Users;
ALTER TABLE Files
    DROP CONSTRAINT files_user_id_fkey;
ALTER TABLE Users
    DROP CONSTRAINT users_fullname_key;
DROP TABLE IF EXISTS Session CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Files CASCADE;


CREATE TABLE Session (
	Sid varchar NOT NULL COLLATE "default",
	Sess json NOT NULL,
	Expire timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE Session ADD CONSTRAINT session_pkey PRIMARY KEY (Sid) NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE TABLE Users (
        Id serial NOT NULL PRIMARY KEY,
        FullName varchar(255) UNIQUE,
        EmailAddress varchar(255),
        City varchar(255) DEFAULT NULL,
        Country varchar(255) DEFAULT NULL,
        Password varchar(100),
        Created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        Role varchar(100),
        Deleted_at TIMESTAMPTZ

);


CREATE TABLE Files (
        Id serial NOT NULL PRIMARY KEY,
        User_id INTEGER NOT NULL REFERENCES users(Id) ON DELETE NO ACTION,
        Name varchar(255),
        Image oid,
        Describe varchar(1000),
        Created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        Deleted_at TIMESTAMPTZ

);

CREATE OR REPLACE RULE delete_files AS
  ON DELETE TO files
  -- WHERE old.deleted_at IS NULL
  DO INSTEAD
    UPDATE files SET deleted_at = NOW()
    WHERE files.id = old.id;

INSERT INTO Users (FullName, EmailAddress, Password, Created_at, Role) VALUES ('ppri','pprisn@yandex.ru','$2b$10$i23jnoCZdhAur0OcnCdrGe38xLk5KUZMxyRf4Hwr/ASuNG5pLQAVu',NOW(),'admin');
