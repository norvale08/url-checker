# Асинхронный сервис проверки списка URL

Проект разделен на две основные части: Бэкенд (Express + TypeScript) и Фронтенд (React + TypeScript + Zustand).

## Требования
- Docker и Docker Compose

## Как быстро запустить проект
Запустите следующую команду в корневой директории:
```bash
docker-compose up --build
```
Фронтенд будет доступен по адресу `http://localhost`, а бэкенд API — `http://localhost:5000`.

## Вариант ручного запуска (без Docker)
1. **Бэкенд**: Перейдите в `backend`, выполните `npm install`, затем `npm run dev`.
2. **Фронтенд**: Перейдите в `frontend`, выполните `npm install`, затем `npm run dev`.
