---
name: Deploy checklist
about: Шаги для первого деплоя API
labels: docs
---

## До деплоя
- [ ] Создан аккаунт Neon, скопирован DATABASE_URL
- [ ] В GitHub → Secrets добавлены DATABASE_URL, JWT_SECRET
- [ ] Создан проект в Render

## После деплоя
- [ ] Открывается /health
- [ ] Применены миграции (prestart)
- [ ] Проверен /auth/register и /auth/login
