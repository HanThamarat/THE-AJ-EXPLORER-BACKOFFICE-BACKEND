-- CreateIndex
CREATE INDEX "Booking_id_idx" ON "Booking"("id");

-- CreateIndex
CREATE INDEX "Booking_bookingId_idx" ON "Booking"("bookingId");

-- CreateIndex
CREATE INDEX "Booking_paymentRef_idx" ON "Booking"("paymentRef");

-- CreateIndex
CREATE INDEX "Booking_bookingStatus_idx" ON "Booking"("bookingStatus");

-- CreateIndex
CREATE INDEX "Booking_paymentStatus_idx" ON "Booking"("paymentStatus");

-- CreateIndex
CREATE INDEX "CancalationBooking_id_idx" ON "CancalationBooking"("id");

-- CreateIndex
CREATE INDEX "CancalationBooking_cancelStatus_idx" ON "CancalationBooking"("cancelStatus");

-- CreateIndex
CREATE INDEX "RefundBooking_id_idx" ON "RefundBooking"("id");

-- CreateIndex
CREATE INDEX "RefundBooking_paymentMethod_idx" ON "RefundBooking"("paymentMethod");

-- CreateIndex
CREATE INDEX "RefundBooking_amount_idx" ON "RefundBooking"("amount");

-- CreateIndex
CREATE INDEX "Review_id_idx" ON "Review"("id");

-- CreateIndex
CREATE INDEX "UserBankAccount_id_idx" ON "UserBankAccount"("id");

-- CreateIndex
CREATE INDEX "administrator_id_idx" ON "administrator"("id");

-- CreateIndex
CREATE INDEX "administrator_email_idx" ON "administrator"("email");

-- CreateIndex
CREATE INDEX "administrator_username_idx" ON "administrator"("username");

-- CreateIndex
CREATE INDEX "administrator_password_idx" ON "administrator"("password");

-- CreateIndex
CREATE INDEX "administrator_status_idx" ON "administrator"("status");

-- CreateIndex
CREATE INDEX "blog_id_idx" ON "blog"("id");

-- CreateIndex
CREATE INDEX "blog_title_idx" ON "blog"("title");

-- CreateIndex
CREATE INDEX "blog_status_idx" ON "blog"("status");

-- CreateIndex
CREATE INDEX "packagePromo_id_idx" ON "packagePromo"("id");

-- CreateIndex
CREATE INDEX "packagePromo_startDate_idx" ON "packagePromo"("startDate");

-- CreateIndex
CREATE INDEX "packagePromo_endDate_idx" ON "packagePromo"("endDate");

-- CreateIndex
CREATE INDEX "packagePromo_status_idx" ON "packagePromo"("status");

-- CreateIndex
CREATE INDEX "packagePromo_promoName_idx" ON "packagePromo"("promoName");

-- CreateIndex
CREATE INDEX "packages_id_idx" ON "packages"("id");

-- CreateIndex
CREATE INDEX "packages_packageName_idx" ON "packages"("packageName");

-- CreateIndex
CREATE INDEX "packages_status_idx" ON "packages"("status");
