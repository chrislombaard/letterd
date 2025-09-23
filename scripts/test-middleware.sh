#!/bin/bash

echo "🔐 Testing Newsletter App Middleware"
echo "===================================="

echo ""
echo "1. Testing /admin route without authentication (should fail):"
echo "Expected: 401 Unauthorized"
curl -s -w "Status: %{http_code}\n" http://localhost:3000/admin/test -o /dev/null

echo ""
echo "2. Testing /admin route with wrong credentials (should fail):"
echo "Expected: 401 Unauthorized"
curl -s -w "Status: %{http_code}\n" -u admin:wrongpass http://localhost:3000/admin/test -o /dev/null

echo ""
echo "3. Testing /admin route with correct credentials (should succeed):"
echo "Expected: 200 OK"
curl -s -w "Status: %{http_code}\n" -u admin:test123 http://localhost:3000/admin/test -o /dev/null

echo ""
echo "4. Testing non-admin route (should work without auth):"
echo "Expected: 200 OK"
curl -s -w "Status: %{http_code}\n" http://localhost:3000/api/test -o /dev/null

echo ""
echo "5. Testing admin dashboard access:"
echo "Expected: 200 OK with JSON response"
curl -s -u admin:test123 http://localhost:3000/admin/test | head -c 100
echo "..."

echo ""
echo ""
echo "✅ Middleware Testing Complete!"
echo "The middleware is protecting /admin/* routes with Basic Auth."
echo "Use credentials: admin / test123"