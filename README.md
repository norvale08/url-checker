# Асинхронный сервис проверки списка URL

Fullstack-приложение для асинхронной проверки доступности веб-ресурсов с отслеживанием прогресса в реальном времени.

## 📋 Возможности

- **Асинхронная проверка URL** - Проверка списка URL с ограничением параллелизма (5 одновременных запросов)
- **Отслеживание прогресса** - Отображение прогресса в реальном времени с автоматическим обновлением
- **Детальная статистика** - HTTP-статус, время ответа, сообщения об ошибках для каждого URL
- **Управление заданиями** - Создание, просмотр списка, детализация и отмена заданий
- **Одновременная обработка** - Поддержка нескольких заданий одновременно
- **Имитация задержки** - Случайная задержка 0-10 секунд перед каждым запросом

## 🛠 Технологический стек

### Бэкенд
- **Node.js** + **TypeScript**
- **Express** - REST API framework
- **Axios** - HTTP-клиент для HEAD-запросов
- **UUID** - Генерация уникальных ID
- **In-memory storage** - Хранение данных без БД

### Фронтенд
- **React 18** + **TypeScript**
- **Vite** - Build tool и dev server
- **Zustand** - State management
- **Axios** - API клиент
- **CSS** - Кастомные стили без UI-библиотек

### DevOps
- **Docker** + **Docker Compose**
- **Nginx** - Reverse proxy для продакшена

## 📁 Структура проекта

```
url-checker/
├── backend/
│   ├── src/
│   │   ├── queue/
│   │   │   └── jobQueue.ts       # Очередь обработки URL
│   │   ├── storage/
│   │   │   └── memoryStorage.ts  # In-memory хранилище
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript типы
│   │   └── server.ts             # Express сервер
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.ts          # API клиент
│   │   ├── components/
│   │   │   ├── JobForm.tsx       # Форма создания задания
│   │   │   ├── JobList.tsx       # Список заданий
│   │   │   └── JobDetails.tsx    # Детали задания
│   │   ├── store/
│   │   │   └── useJobStore.ts    # Zustand store
│   │   ├── styles/
│   │   │   └── luxury.css        # Стили приложения
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
├── docker-compose.yml
├── .editorconfig
├── .gitignore
└── README.md
```

## 🚀 Установка и запуск

### Требования
- Node.js 18+
- npm или yarn
- Docker (опционально)

### Docker (рекомендуется)

```bash
# Клонирование и установка
git clone <repository-url>
cd url-checker

# Запуск
docker-compose up --build
```

Доступ:
- Фронтенд: http://localhost
- Бэкенд: http://localhost:5000

### Ручной запуск

```bash
# Терминал 1 - Бэкенд
cd backend
npm install
npm run dev

# Терминал 2 - Фронтенд
cd frontend
npm install
npm run dev
```

Доступ:
- Фронтенд: http://localhost:5173
- Бэкенд: http://localhost:5000

### Сборка для продакшена

```bash
# Бэкенд
cd backend
npm run build
npm start

# Фронтенд
cd frontend
npm run build
```

## 🔧 Конфигурация

### Бэкенд (.env)
```bash
PORT=5000
NODE_ENV=development
```

### Фронтенд (.env)
```bash
VITE_API_URL=http://localhost:5000/api
```

### Параметры приложения
- **Порт бэкенда:** 5000 (переменная `PORT`)
- **Лимит параллельных запросов:** 5 (константа `CONCURRENCY_LIMIT`)
- **Задержка перед запросом:** 0-10 секунд (рандом)
- **Интервал опроса:** 2 секунды
- **Таймаут HTTP-запроса:** 5 секунд

## 📡 API

### POST /api/jobs
Создать новое задание на проверку URL

**Request:**
```json
{
  "urls": ["https://example.com", "https://google.com"]
}
```

**Response:** `201 Created`
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### GET /api/jobs
Получить список всех заданий (краткая информация)

**Response:** `200 OK`
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "status": "completed",
    "totalUrls": 3,
    "stats": {
      "success": 2,
      "error": 1
    }
  }
]
```

### GET /api/jobs/:id
Получить детальную информацию о задании

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "urls": [
    {
      "url": "https://example.com",
      "status": "success",
      "httpStatus": 200,
      "startTime": "2024-01-15T10:30:01.000Z",
      "endTime": "2024-01-15T10:30:02.500Z",
      "duration": 1500
    }
  ],
  "processedCount": 3
}
```

### DELETE /api/jobs/:id
Отменить задание

**Response:** `200 OK`
```json
{
  "message": "Job cancellation requested",
  "job": { ... }
}
```

## 🎯 Статусы

### Статусы задания
- `pending` - Ожидание обработки
- `in_progress` - В процессе
- `completed` - Завершено успешно
- `failed` - Завершено с ошибками
- `cancelled` - Отменено

### Статусы URL
- `pending` - Ожидание
- `in_progress` - В процессе
- `success` - Успешно
- `error` - Ошибка
- `cancelled` - Отменено

## 🧪 Тестирование

Для тестирования можно использовать:

1. **Веб-интерфейс** - http://localhost:5173
2. **curl:**
```bash
# Создать задание
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"urls":["https://example.com","https://google.com"]}'

# Получить список заданий
curl http://localhost:5000/api/jobs

# Получить детали задания
curl http://localhost:5000/api/jobs/{jobId}

# Отменить задание
curl -X DELETE http://localhost:5000/api/jobs/{jobId}
```

## 📄 Лицензия

MIT
