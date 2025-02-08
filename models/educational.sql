/*
 Navicat Premium Dump SQL

 Source Server         : fristWeb
 Source Server Type    : MySQL
 Source Server Version : 80039 (8.0.39)
 Source Host           : localhost:3306
 Source Schema         : educational

 Target Server Type    : MySQL
 Target Server Version : 80039 (8.0.39)
 File Encoding         : 65001

 Date: 07/02/2025 21:53:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses`  (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `course_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `credits` int NOT NULL,
  `hours` int NOT NULL,
  `syllabus` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`course_id`) USING BTREE,
  UNIQUE INDEX `course_code`(`course_code` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of courses
-- ----------------------------

-- ----------------------------
-- Table structure for exams
-- ----------------------------
DROP TABLE IF EXISTS `exams`;
CREATE TABLE `exams`  (
  `exam_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `exam_time` datetime NOT NULL,
  `exam_location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `invigilator_id` int NOT NULL,
  PRIMARY KEY (`exam_id`) USING BTREE,
  INDEX `course_id`(`course_id` ASC) USING BTREE,
  INDEX `invigilator_id`(`invigilator_id` ASC) USING BTREE,
  CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `exams_ibfk_2` FOREIGN KEY (`invigilator_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of exams
-- ----------------------------

-- ----------------------------
-- Table structure for grades
-- ----------------------------
DROP TABLE IF EXISTS `grades`;
CREATE TABLE `grades`  (
  `grade_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `usual_grade` decimal(5, 2) NULL DEFAULT NULL,
  `exam_grade` decimal(5, 2) NULL DEFAULT NULL,
  `total_grade` decimal(5, 2) NULL DEFAULT NULL,
  `gpa` decimal(3, 2) NULL DEFAULT NULL,
  PRIMARY KEY (`grade_id`) USING BTREE,
  INDEX `student_id`(`student_id` ASC) USING BTREE,
  INDEX `course_id`(`course_id` ASC) USING BTREE,
  CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `grades_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of grades
-- ----------------------------

-- ----------------------------
-- Table structure for lab_reservations
-- ----------------------------
DROP TABLE IF EXISTS `lab_reservations`;
CREATE TABLE `lab_reservations`  (
  `reservation_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `lab_id` int NOT NULL,
  `reservation_time` datetime NOT NULL,
  PRIMARY KEY (`reservation_id`) USING BTREE,
  INDEX `student_id`(`student_id` ASC) USING BTREE,
  INDEX `lab_id`(`lab_id` ASC) USING BTREE,
  CONSTRAINT `lab_reservations_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `lab_reservations_ibfk_2` FOREIGN KEY (`lab_id`) REFERENCES `labs` (`lab_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lab_reservations
-- ----------------------------

-- ----------------------------
-- Table structure for labs
-- ----------------------------
DROP TABLE IF EXISTS `labs`;
CREATE TABLE `labs`  (
  `lab_id` int NOT NULL AUTO_INCREMENT,
  `lab_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`lab_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of labs
-- ----------------------------

-- ----------------------------
-- Table structure for logs
-- ----------------------------
DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of logs
-- ----------------------------

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students`  (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gender` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `birth_date` date NOT NULL,
  `id_card` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `contact` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`student_id`) USING BTREE,
  UNIQUE INDEX `id_card`(`id_card` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of students
-- ----------------------------

-- ----------------------------
-- Table structure for teachers
-- ----------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers`  (
  `teacher_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `teaching_experience` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `research_achievements` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`teacher_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teachers
-- ----------------------------

-- ----------------------------
-- Table structure for teaching_materials
-- ----------------------------
DROP TABLE IF EXISTS `teaching_materials`;
CREATE TABLE `teaching_materials`  (
  `material_id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int NOT NULL,
  `course_id` int NOT NULL,
  `material_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `file_path` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`material_id`) USING BTREE,
  INDEX `teacher_id`(`teacher_id` ASC) USING BTREE,
  INDEX `course_id`(`course_id` ASC) USING BTREE,
  CONSTRAINT `teaching_materials_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `teaching_materials_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teaching_materials
-- ----------------------------

-- ----------------------------
-- Table structure for teaching_tasks
-- ----------------------------
DROP TABLE IF EXISTS `teaching_tasks`;
CREATE TABLE `teaching_tasks`  (
  `task_id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int NOT NULL,
  `course_id` int NOT NULL,
  PRIMARY KEY (`task_id`) USING BTREE,
  INDEX `teacher_id`(`teacher_id` ASC) USING BTREE,
  INDEX `course_id`(`course_id` ASC) USING BTREE,
  CONSTRAINT `teaching_tasks_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `teaching_tasks_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teaching_tasks
-- ----------------------------

-- ----------------------------
-- Table structure for textbooks
-- ----------------------------
DROP TABLE IF EXISTS `textbooks`;
CREATE TABLE `textbooks`  (
  `textbook_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `textbook_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `selection_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `order_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `distribution_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`textbook_id`) USING BTREE,
  INDEX `course_id`(`course_id` ASC) USING BTREE,
  CONSTRAINT `textbooks_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of textbooks
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
