-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Deliveries" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Orders_id_key" ON "Orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Deliveries_id_key" ON "Deliveries"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");
