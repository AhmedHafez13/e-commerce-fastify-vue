-- DropIndex
DROP INDEX `Category_name_key` ON `Category`;

-- DropIndex
DROP INDEX `Product_name_key` ON `Product`;

-- AlterTable
ALTER TABLE `Category` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `picture` VARCHAR(512) NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `picture` VARCHAR(512) NULL;
