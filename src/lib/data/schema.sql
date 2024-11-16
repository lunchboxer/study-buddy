CREATE TABLE assignment (
	id TEXT PRIMARY KEY NOT NULL,
	title TEXT NOT NULL,
	description TEXT,
	type TEXT DEFAULT 'homework' NOT NULL,
	subject_id TEXT NOT NULL,
	student_group_id TEXT NOT NULL,
	assigned_date TEXT NOT NULL,
	due_date TEXT,
	created TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (subject_id) REFERENCES subject(id) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (student_group_id) REFERENCES student_group(id) ON UPDATE no action ON DELETE no action
);


CREATE TABLE school_year (
	id TEXT PRIMARY KEY NOT NULL,
	name TEXT NOT NULL,
	start_date TEXT NOT NULL,
	end_date TEXT NOT NULL,
	created TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- CREATE TABLE student (
-- 	id TEXT PRIMARY KEY NOT NULL,
-- 	name TEXT NOT NULL,
-- 	archived integer DEFAULT 0 NOT NULL,
-- 	created TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
-- );

CREATE TABLE student_to_group (
	student_id TEXT NOT NULL,
	student_group_id TEXT NOT NULL,
	PRIMARY KEY(student_group_id, student_id),
	FOREIGN KEY (student_id) REFERENCES user(id) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (student_group_id) REFERENCES student_group(id) ON UPDATE no action ON DELETE cascade 
);

CREATE TABLE student_group (
	id TEXT PRIMARY KEY NOT NULL,
	name TEXT NOT NULL,
	grade TEXT NOT NULL,
	school_year_id TEXT NOT NULL,
	created TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (school_year_id) REFERENCES school_year(id) ON UPDATE no action ON DELETE no action
);

CREATE INDEX student_group_school_year_index ON student_group (school_year_id);

CREATE TABLE subject (
	id TEXT PRIMARY KEY NOT NULL,
	name TEXT NOT NULL
);

CREATE TABLE submission (
	id TEXT PRIMARY KEY NOT NULL,
	assignment_id TEXT NOT NULL,
	student_id TEXT NOT NULL,
	status TEXT,
	created TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (assignment_id) REFERENCES assignment(id) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (student_id) REFERENCES student(id) ON UPDATE no action ON DELETE no action
);

CREATE TABLE teacher_to_group (
	teacher_id TEXT NOT NULL,
	student_group_id TEXT NOT NULL,
	PRIMARY KEY(student_group_id, teacher_id),
	FOREIGN KEY (teacher_id) REFERENCES user(id) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (student_group_id) REFERENCES student_group(id) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE user (
	id TEXT PRIMARY KEY NOT NULL,
	username TEXT NOT NULL,
	name TEXT,
  email TEXT,
	password TEXT NOT NULL,
	active_school_year TEXT,
  archived INTEGER DEFAULT 0 NOT NULL,
	created TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX subject_name_unique ON subject (name);
CREATE UNIQUE INDEX user_username_unique ON user (username);
CREATE UNIQUE INDEX user_email_unique ON user (email);

CREATE TABLE role (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE user_role (
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  PRIMARY KEY(role_id, user_id),
  FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (role_id) REFERENCES role(id) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE word (
  id TEXT PRIMARY KEY NOT NULL,
  word TEXT NOT NULL UNIQUE,
  created TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE word_tag (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL UNIQUE,
  parent_tag_id TEXT,   -- Optional, for hierarchical relationships, like sublists and levels
  created TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (parent_tag_id) REFERENCES word_tag(id) ON UPDATE no action ON DELETE no action
);

CREATE TABLE word_tag_to_word (
  word_tag_id TEXT NOT NULL,
  word_id TEXT NOT NULL,
  PRIMARY KEY(word_tag_id, word_id),
  FOREIGN KEY (word_tag_id) REFERENCES word_tag(id) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (word_id) REFERENCES word(id) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX word_tag_to_word_word_tag_id_index ON word_tag_to_word (word_tag_id);
CREATE INDEX word_tag_to_word_word_id_index ON word_tag_to_word (word_id);
CREATE INDEX parent_tag_id_index ON word_tag (parent_tag_id);

CREATE TABLE running_record_text (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  source TEXT,
  'text' TEXT NOT NULL,
  lexile INTEGER,
  created TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE running_record (
  id TEXT PRIMARY KEY NOT NULL,
  text_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  created TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  audio_url TEXT,
  marked_text TEXT,
  marked_by TEXT,
  comments TEXT,
  FOREIGN KEY (text_id) REFERENCES running_record_text(id) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (student_id) REFERENCES user(id) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (marked_by) REFERENCES user(id) ON UPDATE no action ON DELETE no action
);
