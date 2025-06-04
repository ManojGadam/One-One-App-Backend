-- CreateTable
CREATE TABLE "UserInformation" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "modified_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider_Info" (
    "id" SERIAL NOT NULL,
    "ServiceName" TEXT NOT NULL,

    CONSTRAINT "Provider_Info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" SERIAL NOT NULL,
    "Day" INTEGER NOT NULL,
    "Start_time" TIMESTAMP(3) NOT NULL,
    "End_time" TIMESTAMP(3) NOT NULL,
    "provider_id" INTEGER NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client_Info" (
    "id" SERIAL NOT NULL,
    "EventName" TEXT NOT NULL,
    "Start_time" TIMESTAMP(3) NOT NULL,
    "End_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_Info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInformation_email_key" ON "UserInformation"("email");

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "Provider_Info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
