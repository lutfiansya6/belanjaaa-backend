#!/usr/bin/env bash
set -e

API_URL="http://localhost:3001/api/v1"
BASE_URL="http://localhost:3001"

echo "================================================================="
echo "TES INTEGRASI MIDTRANS SNAP SANDBOX & WEBHOOK BELANJAAA"
echo "================================================================="

# Baca MIDTRANS_SERVER_KEY dari .env
SERVER_KEY=$(grep '^MIDTRANS_SERVER_KEY=' .env | cut -d '=' -f2- | tr -d '\r' | tr -d '"')
echo "Midtrans Server Key dari .env: ${SERVER_KEY:0:15}..."

echo ""
echo "--- 1. TES AKSES POST /orders/:id/pay TANPA TOKEN (HARUS 401 UNAUTHORIZED) ---"
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/orders/random-id/pay" -H "Content-Type: application/json")
echo "HTTP Status (Direct /orders/:id/pay): $STATUS_CODE"
if [ "$STATUS_CODE" -ne 401 ]; then
  echo "FAILED: Ekspektasi 401 Unauthorized, tapi dapat $STATUS_CODE"
  exit 1
fi

STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/orders/random-id/pay" -H "Content-Type: application/json")
echo "HTTP Status (Prefixed /api/v1/orders/:id/pay): $STATUS_CODE"
if [ "$STATUS_CODE" -ne 401 ]; then
  echo "FAILED: Ekspektasi 401 Unauthorized, tapi dapat $STATUS_CODE"
  exit 1
fi
echo "PASSED: Akses tanpa token berhasil ditolak dengan 401."

echo ""
echo "--- 2. LOGIN SEBAGAI BUYER 1 & BUYER 2 ---"
BUYER1_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer1@shopee.test","password":"password123"}')
TOKEN1=$(echo "$BUYER1_LOGIN" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

BUYER2_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer2@shopee.test","password":"password123"}')
TOKEN2=$(echo "$BUYER2_LOGIN" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN1" ] || [ -z "$TOKEN2" ]; then
  echo "Gagal login buyer!"
  exit 1
fi
echo "Buyer 1 Token: ${TOKEN1:0:20}..."
echo "Buyer 2 Token: ${TOKEN2:0:20}..."

echo ""
echo "--- 3. PERSIAPKAN ALAMAT & PRODUK UNTUK ORDER 1 ---"
# Tambah alamat untuk Buyer 1 jika belum ada
ADDR_RESP=$(curl -s -X POST "$API_URL/addresses" \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName": "Buyer Satu",
    "phone": "081299887766",
    "street": "Jl. MH Thamrin No. 1",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "10310",
    "isDefault": true
  }')
ADDR_ID=$(echo "$ADDR_RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

# Ambil produk pertama
PROD_RESP=$(curl -s "$API_URL/products?limit=1")
PROD_ID=$(echo "$PROD_RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
PROD_STOCK_BEFORE=$(echo "$PROD_RESP" | grep -o '"stock":[0-9]*' | head -1 | cut -d':' -f2)
echo "Produk ID: $PROD_ID, Stok Sebelum Order: $PROD_STOCK_BEFORE"

# Kosongkan keranjang & tambah produk
curl -s -X DELETE "$API_URL/cart" -H "Authorization: Bearer $TOKEN1" > /dev/null
curl -s -X POST "$API_URL/cart/items" \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PROD_ID\",\"quantity\":1}" > /dev/null

# Buat order 1
ORDER1_RESP=$(curl -s -X POST "$API_URL/orders" \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d "{\"addressId\":\"$ADDR_ID\"}")

ORDER1_ID=$(echo "$ORDER1_RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
ORDER1_STATUS=$(echo "$ORDER1_RESP" | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)
ORDER1_TOTAL=$(echo "$ORDER1_RESP" | grep -o '"totalAmount":[0-9]*' | head -1 | cut -d':' -f2)

echo "Order 1 Berhasil Dibuat: ID=$ORDER1_ID, Status=$ORDER1_STATUS, TotalAmount=$ORDER1_TOTAL"
if [ "$ORDER1_STATUS" != "PENDING" ]; then
  echo "FAILED: Order baru harus berstatus PENDING"
  exit 1
fi

echo ""
echo "--- 4. TES PEMBAYARAN OLEH BUKAN PEMILIK ORDER (HARUS 403 FORBIDDEN) ---"
FORBIDDEN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/orders/$ORDER1_ID/pay" \
  -H "Authorization: Bearer $TOKEN2" \
  -H "Content-Type: application/json")
echo "HTTP Status Buyer 2 mencoba membayar Order Buyer 1: $FORBIDDEN_STATUS"
if [ "$FORBIDDEN_STATUS" -ne 403 ]; then
  echo "FAILED: Ekspektasi 403 Forbidden, tapi dapat $FORBIDDEN_STATUS"
  exit 1
fi
echo "PASSED: Bukan pemilik ditolak dengan 403 Forbidden."

echo ""
echo "--- 5. TES POST /orders/:id/pay OLEH PEMILIK ORDER (MENGEMBALIKAN SNAP TOKEN & REDIRECT URL) ---"
PAY_RESP=$(curl -s -X POST "$API_URL/orders/$ORDER1_ID/pay" \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json")
echo "Response POST /orders/$ORDER1_ID/pay:"
echo "$PAY_RESP"

SNAP_TOKEN=$(echo "$PAY_RESP" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
REDIRECT_URL=$(echo "$PAY_RESP" | grep -o '"redirectUrl":"[^"]*' | cut -d'"' -f4)
MIDTRANS_ORDER_ID=$(echo "$PAY_RESP" | grep -o '"midtransOrderId":"[^"]*' | cut -d'"' -f4)

if [ -z "$SNAP_TOKEN" ] || [ -z "$REDIRECT_URL" ]; then
  echo "FAILED: snap token atau redirectUrl tidak ditemukan dalam response"
  exit 1
fi
echo "PASSED: Snap token didapatkan: $SNAP_TOKEN"
echo "PASSED: Redirect URL didapatkan: $REDIRECT_URL"
echo "Midtrans Order ID: $MIDTRANS_ORDER_ID"

echo ""
echo "--- 6. TES WEBHOOK PALSU DENGAN SIGNATURE SALAH (HARUS DITOLAK 400) ---"
FAKE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/payments/webhook" \
  -H "Content-Type: application/json" \
  -d "{
    \"order_id\": \"$MIDTRANS_ORDER_ID\",
    \"status_code\": \"200\",
    \"gross_amount\": \"${ORDER1_TOTAL}.00\",
    \"signature_key\": \"signature_palsu_yang_salah_total_1234567890\",
    \"transaction_status\": \"settlement\"
  }")
echo "HTTP Status Webhook Palsu: $FAKE_STATUS"
if [ "$FAKE_STATUS" -ne 400 ]; then
  echo "FAILED: Ekspektasi 400 Bad Request, tapi dapat $FAKE_STATUS"
  exit 1
fi
echo "PASSED: Webhook palsu dengan signature salah berhasil ditolak!"

echo ""
echo "--- 7. HITUNG SIGNATURE ASLI & KIRIM WEBHOOK SETTLEMENT RESMI ---"
GROSS_STR="${ORDER1_TOTAL}.00"
VALID_SIG=$(node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha512').update('${MIDTRANS_ORDER_ID}200${GROSS_STR}${SERVER_KEY}').digest('hex'))")
echo "Valid SHA512 Signature: $VALID_SIG"

WEBHOOK_RESP=$(curl -s -X POST "$BASE_URL/payments/webhook" \
  -H "Content-Type: application/json" \
  -d "{
    \"order_id\": \"$MIDTRANS_ORDER_ID\",
    \"status_code\": \"200\",
    \"gross_amount\": \"$GROSS_STR\",
    \"signature_key\": \"$VALID_SIG\",
    \"transaction_status\": \"settlement\",
    \"payment_type\": \"qris\"
  }")
echo "Response Webhook Settlement:"
echo "$WEBHOOK_RESP"

# Verifikasi status order di backend berubah menjadi PAID
ORDER1_AFTER=$(curl -s "$API_URL/orders/$ORDER1_ID" -H "Authorization: Bearer $TOKEN1")
ORDER1_STATUS_AFTER=$(echo "$ORDER1_AFTER" | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Status Order 1 Setelah Settlement: $ORDER1_STATUS_AFTER"
if [ "$ORDER1_STATUS_AFTER" != "PAID" ]; then
  echo "FAILED: Status order harus menjadi PAID setelah webhook settlement"
  exit 1
fi
echo "PASSED: Order 1 berhasil berubah menjadi PAID!"

echo ""
echo "--- 8. TES IDEMPOTENSI: KIRIM ULANG WEBHOOK SETTLEMENT (DUPLIKAT) ---"
WEBHOOK_DUP_RESP=$(curl -s -X POST "$BASE_URL/payments/webhook" \
  -H "Content-Type: application/json" \
  -d "{
    \"order_id\": \"$MIDTRANS_ORDER_ID\",
    \"status_code\": \"200\",
    \"gross_amount\": \"$GROSS_STR\",
    \"signature_key\": \"$VALID_SIG\",
    \"transaction_status\": \"settlement\",
    \"payment_type\": \"qris\"
  }")
echo "Response Webhook Settlement Duplikat (Kedua Kali):"
echo "$WEBHOOK_DUP_RESP"

if [[ "$WEBHOOK_DUP_RESP" != *"idempotent"* ]]; then
  echo "FAILED: Webhook duplikat harus mengembalikan pesan idempoten!"
  exit 1
fi
echo "PASSED: Webhook duplikat berhasil ditangani secara idempoten tanpa error."

echo ""
echo "--- 9. TES BAYAR ORDER YANG SUDAH PAID (HARUS DITOLAK 400) ---"
PAID_PAY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/orders/$ORDER1_ID/pay" \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json")
echo "HTTP Status Bayar Order yang sudah PAID: $PAID_PAY_STATUS"
if [ "$PAID_PAY_STATUS" -ne 400 ]; then
  echo "FAILED: Order yang sudah PAID harus ditolak saat dipanggil /pay (dapat $PAID_PAY_STATUS)"
  exit 1
fi
echo "PASSED: Order yang sudah PAID tidak dapat dibayar kembali."

echo ""
echo "--- 10. TES ORDER 2: EXPIRE/CANCEL/DENY & RESTORE STOK PRODUK ---"
# Ambil stok produk sebelum Order 2
PROD_BEFORE2=$(curl -s "$API_URL/products/$PROD_ID")
STOCK_BEFORE2=$(echo "$PROD_BEFORE2" | grep -o '"stock":[0-9]*' | head -1 | cut -d':' -f2)
echo "Stok produk sebelum Order 2: $STOCK_BEFORE2"

# Tambah produk ke keranjang & buat Order 2 (qty: 2)
curl -s -X DELETE "$API_URL/cart" -H "Authorization: Bearer $TOKEN1" > /dev/null
curl -s -X POST "$API_URL/cart/items" \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PROD_ID\",\"quantity\":2}" > /dev/null

ORDER2_RESP=$(curl -s -X POST "$API_URL/orders" \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d "{\"addressId\":\"$ADDR_ID\"}")

ORDER2_ID=$(echo "$ORDER2_RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
ORDER2_TOTAL=$(echo "$ORDER2_RESP" | grep -o '"totalAmount":[0-9]*' | head -1 | cut -d':' -f2)

PROD_AFTER2=$(curl -s "$API_URL/products/$PROD_ID")
STOCK_AFTER2=$(echo "$PROD_AFTER2" | grep -o '"stock":[0-9]*' | head -1 | cut -d':' -f2)
echo "Order 2 dibuat: ID=$ORDER2_ID. Stok terpotong 2 menjadi: $STOCK_AFTER2"

# Lakukan pay untuk mengenerate Payment record
ORDER2_PAY=$(curl -s -X POST "$API_URL/orders/$ORDER2_ID/pay" \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json")
ORDER2_MIDTRANS_ID=$(echo "$ORDER2_PAY" | grep -o '"midtransOrderId":"[^"]*' | cut -d'"' -f4)
echo "Midtrans Order ID 2: $ORDER2_MIDTRANS_ID"

# Kirim Webhook 'expire'
GROSS2_STR="${ORDER2_TOTAL}.00"
VALID_SIG2=$(node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha512').update('${ORDER2_MIDTRANS_ID}200${GROSS2_STR}${SERVER_KEY}').digest('hex'))")

EXPIRE_RESP=$(curl -s -X POST "$BASE_URL/payments/webhook" \
  -H "Content-Type: application/json" \
  -d "{
    \"order_id\": \"$ORDER2_MIDTRANS_ID\",
    \"status_code\": \"200\",
    \"gross_amount\": \"$GROSS2_STR\",
    \"signature_key\": \"$VALID_SIG2\",
    \"transaction_status\": \"expire\",
    \"payment_type\": \"bank_transfer\"
  }")
echo "Response Webhook Expire:"
echo "$EXPIRE_RESP"

# Cek status Order 2 (harus CANCELLED)
ORDER2_CHECK=$(curl -s "$API_URL/orders/$ORDER2_ID" -H "Authorization: Bearer $TOKEN1")
ORDER2_STATUS_CHECK=$(echo "$ORDER2_CHECK" | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Status Order 2 Setelah Expire Webhook: $ORDER2_STATUS_CHECK"
if [ "$ORDER2_STATUS_CHECK" != "CANCELLED" ]; then
  echo "FAILED: Status Order 2 harus CANCELLED"
  exit 1
fi

# Cek stok produk (harus kembali bertambah 2)
PROD_RESTORED=$(curl -s "$API_URL/products/$PROD_ID")
STOCK_RESTORED=$(echo "$PROD_RESTORED" | grep -o '"stock":[0-9]*' | head -1 | cut -d':' -f2)
echo "Stok produk setelah expire (restored): $STOCK_RESTORED (kembali ke $STOCK_BEFORE2)"
if [ "$STOCK_RESTORED" -ne "$STOCK_BEFORE2" ]; then
  echo "FAILED: Stok produk tidak terestore dengan benar! Ekspektasi $STOCK_BEFORE2 tapi $STOCK_RESTORED"
  exit 1
fi
echo "PASSED: Stok produk berhasil dikembalikan setelah status expire!"

echo ""
echo "--- 11. TES IDEMPOTENSI EXPIRE KEDUA KALI (STOK TIDAK BOLEH DIKEMBALIKAN DUA KALI) ---"
EXPIRE_DUP_RESP=$(curl -s -X POST "$BASE_URL/payments/webhook" \
  -H "Content-Type: application/json" \
  -d "{
    \"order_id\": \"$ORDER2_MIDTRANS_ID\",
    \"status_code\": \"200\",
    \"gross_amount\": \"$GROSS2_STR\",
    \"signature_key\": \"$VALID_SIG2\",
    \"transaction_status\": \"expire\",
    \"payment_type\": \"bank_transfer\"
  }")
echo "Response Webhook Expire Duplikat:"
echo "$EXPIRE_DUP_RESP"

PROD_STILL_SAME=$(curl -s "$API_URL/products/$PROD_ID")
STOCK_STILL_SAME=$(echo "$PROD_STILL_SAME" | grep -o '"stock":[0-9]*' | head -1 | cut -d':' -f2)
echo "Stok setelah expire kedua kali: $STOCK_STILL_SAME"
if [ "$STOCK_STILL_SAME" -ne "$STOCK_BEFORE2" ]; then
  echo "FAILED: Stok bertambah lagi saat notifikasi duplikat! Tidak idempoten!"
  exit 1
fi
echo "PASSED: Idempotensi expire berhasil, stok tidak bertambah ganda."

echo ""
echo "--- 12. VERIFIKASI DATA TABEL PAYMENT DI DATABASE ---"
PAYMENT_ROWS=$(node -e "
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  prisma.payment.findMany({ select: { id: true, orderId: true, midtransOrderId: true, status: true, paymentType: true, rawPayload: true } })
    .then(rows => {
      console.log('Total payment records in DB:', rows.length);
      rows.forEach(r => {
        console.log({
          orderId: r.orderId,
          midtransOrderId: r.midtransOrderId,
          status: r.status,
          hasRawPayload: !!r.rawPayload,
          payloadSample: r.rawPayload ? r.rawPayload.slice(0, 60) + '...' : null
        });
      });
      process.exit(0);
    });
")
echo "$PAYMENT_ROWS"

echo ""
echo "================================================================="
echo "SEMUA SKENARIO MIDTRANS SNAP & WEBHOOK BERHASIL DIUJI DENGAN CURL!"
echo "================================================================="
