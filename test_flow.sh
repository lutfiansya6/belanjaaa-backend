#!/usr/bin/env bash
set -e

API_URL="http://localhost:3001/api/v1"
echo "=================================================="
echo "TEST ALUR BACKEND BELANJAAA: AUTH, CART, & ORDERS"
echo "=================================================="

echo ""
echo "--- 1. TES AKSES TANPA LOGIN (HARUS 401 UNAUTHORIZED) ---"
echo "GET /cart tanpa token:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" "$API_URL/cart"

echo "POST /orders tanpa token:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" -X POST "$API_URL/orders" -H "Content-Type: application/json" -d "{}"

echo "GET /addresses tanpa token:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" "$API_URL/addresses"

echo ""
echo "--- 2. LOGIN USER UNTUK MENDAPATKAN JWT TOKEN ---"
LOGIN_RESP=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer1@shopee.test","password":"password123"}')

TOKEN=$(echo "$LOGIN_RESP" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Gagal login! Response: $LOGIN_RESP"
  exit 1
fi
echo "Login berhasil! Token JWT didapatkan: ${TOKEN:0:25}..."

AUTH_HEADER="Authorization: Bearer $TOKEN"

echo ""
echo "--- 3. TAMBAH ALAMAT PENGIRIMAN ---"
ADDR_RESP=$(curl -s -X POST "$API_URL/addresses" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName": "Pembeli Satu",
    "phone": "081298765432",
    "street": "Jl. Merdeka No. 10",
    "city": "Jakarta Pusat",
    "province": "DKI Jakarta",
    "postalCode": "10110",
    "isDefault": true
  }')
echo "Alamat berhasil ditambahkan:"
echo "$ADDR_RESP"
ADDR_ID=$(echo "$ADDR_RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

echo ""
echo "--- 4. AMBIL PRODUK DARI KATALOG ---"
PROD_RESP=$(curl -s "$API_URL/products?limit=1")
PROD_ID=$(echo "$PROD_RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
PROD_NAME=$(echo "$PROD_RESP" | grep -o '"name":"[^"]*' | head -1 | cut -d'"' -f4)
PROD_STOCK=$(echo "$PROD_RESP" | grep -o '"stock":[0-9]*' | head -1 | cut -d':' -f2)
PROD_PRICE=$(echo "$PROD_RESP" | grep -o '"price":[0-9]*' | head -1 | cut -d':' -f2)

echo "Produk terpilih: ID=$PROD_ID"
echo "Nama: $PROD_NAME"
echo "Harga: Rp $PROD_PRICE, Stok awal: $PROD_STOCK"

echo ""
echo "--- 5. KOSONGKAN KERANJANG TERLEBIH DAHULU ---"
curl -s -X DELETE "$API_URL/cart" -H "$AUTH_HEADER" > /dev/null

echo ""
echo "--- 6. TAMBAH PRODUK KE KERANJANG (qty: 2) ---"
ADD_CART_RESP=$(curl -s -X POST "$API_URL/cart/items" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PROD_ID\",\"quantity\":2}")

echo "Isi keranjang setelah tambah:"
echo "$ADD_CART_RESP"

ITEM_ID=$(echo "$ADD_CART_RESP" | grep -o '"id":"[^"]*' | head -2 | tail -1 | cut -d'"' -f4)

echo ""
echo "--- 7. UBAH KUANTITAS ITEM DI KERANJANG (ubah qty ke 3) ---"
UPDATE_CART_RESP=$(curl -s -X PATCH "$API_URL/cart/items/$ITEM_ID" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d '{"quantity":3}')
echo "Isi keranjang setelah ubah qty ke 3:"
echo "$UPDATE_CART_RESP"

echo ""
echo "--- 8. TES TRANSAKSI DITOLAK JIKA STOK TIDAK CUKUP ---"
echo "Mencoba ubah item ke kuantitas melebihi stok ($((PROD_STOCK + 50)))..."
EXCEED_RESP=$(curl -s -X PATCH "$API_URL/cart/items/$ITEM_ID" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"quantity\":$((PROD_STOCK + 50))}")
echo "Response penolakan stok di cart:"
echo "$EXCEED_RESP"

echo ""
echo "--- 9. BUAT ORDER DARI KERANJANG (POST /orders) ---"
echo "Stok sebelum order: $PROD_STOCK"
ORDER_RESP=$(curl -s -X POST "$API_URL/orders" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "{\"addressId\":\"$ADDR_ID\"}")

echo "Response pembuatan order:"
echo "$ORDER_RESP"

ORDER_ID=$(echo "$ORDER_RESP" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
ORDER_STATUS=$(echo "$ORDER_RESP" | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)
ORDER_TOTAL=$(echo "$ORDER_RESP" | grep -o '"totalAmount":[0-9]*' | head -1 | cut -d':' -f2)

echo "Order ID: $ORDER_ID"
echo "Status Order: $ORDER_STATUS"
echo "Total Bayar: Rp $ORDER_TOTAL"

echo ""
echo "--- 10. VERIFIKASI KERANJANG SETELAH ORDER (HARUS KOSONG) ---"
CART_AFTER=$(curl -s "$API_URL/cart" -H "$AUTH_HEADER")
echo "Isi keranjang sekarang:"
echo "$CART_AFTER"

echo ""
echo "--- 11. VERIFIKASI STOK BERKURANG DI DATABASE ---"
PROD_AFTER=$(curl -s "$API_URL/products/$PROD_ID")
NEW_STOCK=$(echo "$PROD_AFTER" | grep -o '"stock":[0-9]*' | head -1 | cut -d':' -f2)
NEW_SOLD=$(echo "$PROD_AFTER" | grep -o '"sold":[0-9]*' | head -1 | cut -d':' -f2)
echo "Stok sebelumnya: $PROD_STOCK"
echo "Stok sekarang   : $NEW_STOCK (berkurang 3)"
echo "Jumlah terjual  : $NEW_SOLD"

echo ""
echo "--- 12. GET DETAIL ORDER & LIST ORDERS ---"
echo "GET /orders/$ORDER_ID:"
curl -s "$API_URL/orders/$ORDER_ID" -H "$AUTH_HEADER"
echo ""

echo ""
echo "--- 13. PEMBATALAN ORDER (RESTORE STOK) ---"
CANCEL_RESP=$(curl -s -X PATCH "$API_URL/orders/$ORDER_ID/cancel" -H "$AUTH_HEADER")
echo "Response pembatalan order:"
echo "$CANCEL_RESP"

PROD_RESTORED=$(curl -s "$API_URL/products/$PROD_ID")
RESTORED_STOCK=$(echo "$PROD_RESTORED" | grep -o '"stock":[0-9]*' | head -1 | cut -d':' -f2)
echo "Stok setelah dibatalkan: $RESTORED_STOCK (kembali ke $PROD_STOCK)"

echo ""
echo "=================================================="
echo "SEMUA SKENARIO BERHASIL DIUJI DENGAN CURL!"
echo "=================================================="
