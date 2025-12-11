/*
  Warnings:

  - You are about to drop the column `rating` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Game` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_userId_fkey`;

-- DropIndex
DROP INDEX `Game_userId_fkey` ON `Game`;

-- AlterTable
ALTER TABLE `Game` DROP COLUMN `rating`,
    DROP COLUMN `status`,
    DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `UserGame` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `gameId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NULL,
    `addedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserGame_userId_gameId_key`(`userId`, `gameId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserGame` ADD CONSTRAINT `UserGame_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGame` ADD CONSTRAINT `UserGame_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
