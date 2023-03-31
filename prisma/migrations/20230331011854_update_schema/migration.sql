/*
  Warnings:

  - You are about to drop the column `def_id` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `liked` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `definition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `example` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,wordId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `like_status` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wordId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `definition` DROP FOREIGN KEY `Definition_username_fkey`;

-- DropForeignKey
ALTER TABLE `example` DROP FOREIGN KEY `Example_def_id_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `Like_def_id_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `Like_user_id_fkey`;

-- DropIndex
DROP INDEX `Like_user_id_def_id_key` ON `like`;

-- AlterTable
ALTER TABLE `like` DROP COLUMN `def_id`,
    DROP COLUMN `liked`,
    DROP COLUMN `user_id`,
    ADD COLUMN `like_status` BOOLEAN NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD COLUMN `wordId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- DropTable
DROP TABLE `definition`;

-- DropTable
DROP TABLE `example`;

-- CreateTable
CREATE TABLE `Word` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `word` VARCHAR(191) NOT NULL,
    `definition` VARCHAR(191) NOT NULL,
    `example` VARCHAR(191) NOT NULL,
    `registrarId` INTEGER NOT NULL,
    `pending` BOOLEAN NOT NULL,
    `registered_time` DATETIME(3) NULL,

    UNIQUE INDEX `Word_word_key`(`word`),
    INDEX `Word_pending_idx`(`pending`),
    INDEX `Word_registered_time_idx`(`registered_time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bookmark` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `wordId` INTEGER NOT NULL,

    INDEX `Bookmark_userId_idx`(`userId`),
    INDEX `Bookmark_wordId_idx`(`wordId`),
    UNIQUE INDEX `Bookmark_userId_wordId_key`(`userId`, `wordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Like_userId_idx` ON `Like`(`userId`);

-- CreateIndex
CREATE INDEX `Like_wordId_idx` ON `Like`(`wordId`);

-- CreateIndex
CREATE INDEX `Like_like_status_idx` ON `Like`(`like_status`);

-- CreateIndex
CREATE UNIQUE INDEX `Like_userId_wordId_key` ON `Like`(`userId`, `wordId`);

-- AddForeignKey
ALTER TABLE `Word` ADD CONSTRAINT `Word_registrarId_fkey` FOREIGN KEY (`registrarId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Word`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Word`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
