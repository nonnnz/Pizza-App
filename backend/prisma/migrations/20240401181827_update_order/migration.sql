-- AlterEnum
ALTER TYPE "PayMethod" ADD VALUE 'PROMTPAY';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "order_id" DROP DEFAULT;
DROP SEQUENCE "Order_order_id_seq";
