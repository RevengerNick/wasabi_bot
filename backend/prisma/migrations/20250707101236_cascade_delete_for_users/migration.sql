-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_user_id_fkey`;

-- DropIndex
DROP INDEX `Order_user_id_fkey` ON `Order`;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
