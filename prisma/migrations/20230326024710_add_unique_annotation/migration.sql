/*
  Warnings:

  - A unique constraint covering the columns `[word]` on the table `Definition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Definition_word_key` ON `Definition`(`word`);
