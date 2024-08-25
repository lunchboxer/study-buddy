CREATE TABLE `assignment` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`type` text DEFAULT 'homework' NOT NULL,
	`subject_id` text NOT NULL,
	`student_group_id` text NOT NULL,
	`assigned_date` text NOT NULL,
	`due_date` text,
	`created` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_group_id`) REFERENCES `student_group`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE `student_group` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`grade` text NOT NULL,
	`school_year_id` text NOT NULL,
	`created` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`school_year_id`) REFERENCES `school_year`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE INDEX `student_group_school_year_index` ON `student_group` (`school_year_id`);
CREATE TABLE `school_year` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`created` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE `student` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`archived` integer DEFAULT 0 NOT NULL,
	`created` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE `student_to_group` (
	`student_id` text NOT NULL,
	`student_group_id` text NOT NULL,
	PRIMARY KEY(`student_group_id`, `student_id`),
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_group_id`) REFERENCES `student_group`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE `subject` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
CREATE TABLE `submission` (
	`id` text PRIMARY KEY NOT NULL,
	`assignment_id` text NOT NULL,
	`student_id` text NOT NULL,
	`status` text,
	`created` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`assignment_id`) REFERENCES `assignment`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE `teacher_to_group` (
	`teacher_id` text NOT NULL,
	`student_group_id` text NOT NULL,
	PRIMARY KEY(`student_group_id`, `teacher_id`),
	FOREIGN KEY (`teacher_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_group_id`) REFERENCES `student_group`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`name` text,
  `email` text,
	`password` text NOT NULL,
	`active_school_year` text,
	`created` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX `subject_name_unique` ON `subject` (`name`);
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);

CREATE TABLE `role` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL
);
CREATE UNIQUE INDEX `role_name_unique` ON `role` (`name`);

CREATE TABLE `user_role` (
  `user_id` text NOT NULL,
  `role_id` text NOT NULL,
  PRIMARY KEY(`role_id`, `user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE `word` (
  `id` text PRIMARY KEY NOT NULL,
  `word` text NOT NULL,
  `definition` text,
  `sentence` text,
  `audio` text,
  `level` integer,
  `list` integer,
  `phonics` boolean DEFAULT 0 NOT NULL,
  `created` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX `word_word_unique` ON `word` (`word`);

CREATE TABLE `word_tag` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `created` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `word_tag_to_word` (
  `word_tag_id` text NOT NULL,
  `word_id` text NOT NULL,
  PRIMARY KEY(`word_tag_id`, `word_id`),
  FOREIGN KEY (`word_tag_id`) REFERENCES `word_tag`(`id`) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (`word_id`) REFERENCES `word`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `running_record_text` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `source` text,
  `text` text NOT NULL,
  `lexile` integer,
  `created` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `running_record` (
  `id` text PRIMARY KEY NOT NULL,
  `text_id` text NOT NULL,
  `student_id` text NOT NULL,
  `created` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `audio_url` text,
  `marked_text` text,
  `marked_by` text,
  `comments` text,
  FOREIGN KEY (`text_id`) REFERENCES `running_record_text`(`id`) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (`marked_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);

