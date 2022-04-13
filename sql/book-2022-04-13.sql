/*
 Navicat Premium Data Transfer

 Source Server         : 阿里云
 Source Server Type    : MySQL
 Source Server Version : 80026
 Source Host           : 121.41.122.194:3306
 Source Schema         : book

 Target Server Type    : MySQL
 Target Server Version : 80026
 File Encoding         : 65001

 Date: 13/04/2022 13:34:02
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for attentions
-- ----------------------------
DROP TABLE IF EXISTS `attentions`;
CREATE TABLE `attentions`  (
  `id` int(0) NOT NULL COMMENT '自增Id',
  `from_user_id` char(28) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '关注人',
  `to_user_id` char(28) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '被关注人',
  `time` timestamp(0) NULL DEFAULT NULL COMMENT '关注时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `attentions_from_user_id`(`from_user_id`) USING BTREE,
  INDEX `attentions_to_user_id`(`to_user_id`) USING BTREE,
  CONSTRAINT `attentions_from_user_id` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`open_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `attentions_to_user_id` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`open_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for book_rel_user
-- ----------------------------
DROP TABLE IF EXISTS `book_rel_user`;
CREATE TABLE `book_rel_user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '自增Id',
  `bookrack_rel_book_id` int(0) NOT NULL COMMENT '书架上面书ID',
  `bookrack_rel_user_id` int(0) NOT NULL COMMENT '借书人Id[已加入书架]',
  `status` int(0) NULL DEFAULT 0 COMMENT '当前状态 0 借出中 1 归还',
  `return_time` timestamp(0) NULL DEFAULT NULL COMMENT '归还时间',
  `end_time` timestamp(0) NOT NULL COMMENT '到期时间',
  `time` timestamp(0) NULL DEFAULT NULL COMMENT '借书时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `book_rel_user_bookrack_rel_book_id`(`bookrack_rel_book_id`) USING BTREE,
  INDEX `book_rel_user_bookrack_rel_user_id`(`bookrack_rel_user_id`) USING BTREE,
  CONSTRAINT `book_rel_user_bookrack_rel_book_id` FOREIGN KEY (`bookrack_rel_book_id`) REFERENCES `bookrack_rel_book` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `book_rel_user_bookrack_rel_user_id` FOREIGN KEY (`bookrack_rel_user_id`) REFERENCES `bookrack_rel_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for bookrack_rel_book
-- ----------------------------
DROP TABLE IF EXISTS `bookrack_rel_book`;
CREATE TABLE `bookrack_rel_book`  (
  `id` int(0) NOT NULL COMMENT '自增Id',
  `book_id` int(0) NOT NULL COMMENT '书本信息Id',
  `time` timestamp(0) NOT NULL COMMENT '书本信息',
  `bookrack_rel_user_id` int(0) NOT NULL COMMENT '书本所属用户[加入Id]',
  `status` int(0) NOT NULL COMMENT '0 已下架 1 已上架 2 已出',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `bookrack_rel_book_book_id`(`book_id`) USING BTREE,
  INDEX `bookrack_rel_book_bookrack_rel_user_id`(`bookrack_rel_user_id`) USING BTREE,
  CONSTRAINT `bookrack_rel_book_book_id` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `bookrack_rel_book_bookrack_rel_user_id` FOREIGN KEY (`bookrack_rel_user_id`) REFERENCES `bookrack_rel_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for bookrack_rel_user
-- ----------------------------
DROP TABLE IF EXISTS `bookrack_rel_user`;
CREATE TABLE `bookrack_rel_user`  (
  `id` int(0) NOT NULL COMMENT '自增Id',
  `bookrack_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '书架Id',
  `status` int(0) NULL DEFAULT 1 COMMENT '当前状态 0=>已退出 1=>存在',
  `type` int(0) NULL DEFAULT 0 COMMENT '加入方式 0=>密码 1=>邀请加入 2=>申请加入 默认 0',
  `user_id` char(28) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户Id',
  `time` timestamp(0) NULL DEFAULT NULL COMMENT '加入时间',
  `exit_time` timestamp(0) NULL DEFAULT NULL COMMENT '退出时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `bookrack_rel_user_bookrackId`(`bookrack_id`) USING BTREE,
  INDEX `bookrack_rel_user_userId`(`user_id`) USING BTREE,
  CONSTRAINT `bookrack_rel_user_bookrackId` FOREIGN KEY (`bookrack_id`) REFERENCES `bookracks` (`uuid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `bookrack_rel_user_userId` FOREIGN KEY (`user_id`) REFERENCES `users` (`open_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for bookracks
-- ----------------------------
DROP TABLE IF EXISTS `bookracks`;
CREATE TABLE `bookracks`  (
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '书架UUID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '书架名称',
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '书架简介',
  `passwd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '加入密码，为空说明不用密码',
  `logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '书架logo',
  `manage` int(0) NOT NULL COMMENT '二进制模式：是否可以加入、是否可以借出、是否可以添加图书、是否可以被搜索',
  `author` char(28) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '书架所属用户',
  `time` timestamp(0) NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`uuid`) USING BTREE,
  INDEX `bookracks_author`(`author`) USING BTREE,
  CONSTRAINT `bookracks_author` FOREIGN KEY (`author`) REFERENCES `users` (`open_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for books
-- ----------------------------
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '自增Id',
  `isbn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'ISBN 图书唯一值',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '书本名称',
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '书本简介',
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '作者姓名',
  `publish_house_id` int(0) NULL DEFAULT NULL COMMENT '出版社',
  `publish_date` timestamp(0) NULL DEFAULT NULL COMMENT '出版时间',
  `img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图书照片',
  `time` timestamp(0) NULL DEFAULT NULL COMMENT '插入时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `books_publishHouse_id`(`publish_house_id`) USING BTREE,
  CONSTRAINT `books_publishHouse_id` FOREIGN KEY (`publish_house_id`) REFERENCES `publish_houses` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for publish_houses
-- ----------------------------
DROP TABLE IF EXISTS `publish_houses`;
CREATE TABLE `publish_houses`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '出版社名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `open_id` char(28) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '小程序用户唯一值',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户头像',
  `nick_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '昵称',
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '个人简介',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户邮箱号',
  `passwd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户密码',
  `time` timestamp(0) NULL DEFAULT NULL COMMENT '插入时间',
  PRIMARY KEY (`open_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Triggers structure for table attentions
-- ----------------------------
DROP TRIGGER IF EXISTS `attentions_time`;
delimiter ;;
CREATE TRIGGER `attentions_time` BEFORE INSERT ON `attentions` FOR EACH ROW BEGIN
			set new.time = NOW();
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table book_rel_user
-- ----------------------------
DROP TRIGGER IF EXISTS `book_rel_user_trigger_time`;
delimiter ;;
CREATE TRIGGER `book_rel_user_trigger_time` BEFORE INSERT ON `book_rel_user` FOR EACH ROW BEGIN
			set new.time = NOW();
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table book_rel_user
-- ----------------------------
DROP TRIGGER IF EXISTS `book_rel_user_trigger_return_time`;
delimiter ;;
CREATE TRIGGER `book_rel_user_trigger_return_time` BEFORE UPDATE ON `book_rel_user` FOR EACH ROW BEGIN
			set new.return_time = NOW();
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table bookrack_rel_user
-- ----------------------------
DROP TRIGGER IF EXISTS `bookrack_rel__user_time`;
delimiter ;;
CREATE TRIGGER `bookrack_rel__user_time` BEFORE INSERT ON `bookrack_rel_user` FOR EACH ROW BEGIN
			set new.time = NOW();
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table bookrack_rel_user
-- ----------------------------
DROP TRIGGER IF EXISTS `bookrack_rel__user_exit_time`;
delimiter ;;
CREATE TRIGGER `bookrack_rel__user_exit_time` BEFORE UPDATE ON `bookrack_rel_user` FOR EACH ROW BEGIN
			set new.exit_time = NOW();
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table bookracks
-- ----------------------------
DROP TRIGGER IF EXISTS `bookracks_trigger_before_time`;
delimiter ;;
CREATE TRIGGER `bookracks_trigger_before_time` BEFORE INSERT ON `bookracks` FOR EACH ROW BEGIN
			set new.time = NOW();
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table bookracks
-- ----------------------------
DROP TRIGGER IF EXISTS `bookracks_trigger_before_uuid`;
delimiter ;;
CREATE TRIGGER `bookracks_trigger_before_uuid` BEFORE INSERT ON `bookracks` FOR EACH ROW BEGIN
			set new.uuid = UUID();
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table books
-- ----------------------------
DROP TRIGGER IF EXISTS `books_trigger_insert_before_time`;
delimiter ;;
CREATE TRIGGER `books_trigger_insert_before_time` BEFORE INSERT ON `books` FOR EACH ROW BEGIN
			set new.time = NOW();
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table users
-- ----------------------------
DROP TRIGGER IF EXISTS `users_trigger_insert_before_time`;
delimiter ;;
CREATE TRIGGER `users_trigger_insert_before_time` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
			set new.time = NOW();
    END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
