#!/bin/bash

echo "🚀 GitHub'a push ediliyor..."

# Remote ekle
git remote add origin https://github.com/aToom13/portfolyo.git 2>/dev/null || echo "Remote zaten ekli"

# Branch'i main yap
git branch -M main

# Push et
git push -u origin main

echo "✅ Tamamlandı! Şimdi GitHub'da Settings → Pages'e gidin"
echo "📌 Site adresi: https://aToom13.github.io/portfolyo"
