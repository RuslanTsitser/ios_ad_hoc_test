# Страница скачивания iOS Ad Hoc

Страница для скачивания iOS приложений в формате Ad Hoc.

## Структура проекта

```schema
ios-ad-hoc/
├── index.html                    # Главная страница с динамической загрузкой приложений
├── apps/                         # Директория с приложениями
│   └── {app_name}/              # Поддиректория для каждого приложения
│       ├── app.ipa              # iOS приложение
│       └── manifest.plist       # Файл для OTA установки
└── README.md                    # Этот файл
```

## Добавление нового приложения

1. Создайте новую директорию в `apps/{app_name}/`
2. Поместите файлы `app.ipa` и `manifest.plist` в эту директорию
3. Обновите массив `apps` в `index.html` с информацией о новом приложении
4. Убедитесь, что в `manifest.plist` указан правильный путь к `app.ipa`

## Настройка GitHub Pages

### 1. Создайте репозиторий на GitHub

1. Перейдите на [GitHub](https://github.com)
2. Создайте новый репозиторий с названием `ios-ad-hoc` (или любым другим)
3. Сделайте репозиторий публичным

### 2. Клонируйте репозиторий

```bash
# Клонируйте репозиторий
git clone https://github.com/YOUR_USERNAME/ios-ad-hoc.git
cd ios-ad-hoc
```

### 3. Добавьте необходимые файлы и загрузите в репозиторий

```bash
# Добавьте файлы в git
git add .
git commit -m "Initial commit"
git push origin main
```

### 4. Включите GitHub Pages

1. Перейдите в настройки репозитория (Settings)
2. Прокрутите вниз до раздела "Pages"
3. В разделе "Source" выберите "Deploy from a branch"
4. Выберите ветку "main" и папку "/ (root)"
5. Нажмите "Save"

### 5. Получите ссылку

После настройки ваша страница будет доступна по адресу:
`https://YOUR_USERNAME.github.io/ios-ad-hoc/`

## Развертывание функции в облаке

### Подготовка функции

Функция находится в директории `functions/` и содержит:

- `index.js` - основной код функции
- `package.json` - зависимости
- `function.zip` - архив для развертывания (автоматически исключен из git)

### Загрузка в Google Cloud Functions

#### Установка Google Cloud CLI и настройка проекта (Шаги могут отличаться)

```bash
# macOS
brew install google-cloud-sdk
gcloud auth login
gcloud config set project blottery
```

#### Развертывание функции

```bash
cd functions
zip -r function.zip .
gcloud functions deploy getApps \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1 \
  --source .
```

#### Проверка функции

```bash
gcloud functions describe getApps
curl -X GET "https://us-central1-blottery.cloudfunctions.net/getApps" -H "Content-Type: application/json"
```

## Особенности

- **Динамическая загрузка**: Страница автоматически проверяет наличие файлов приложений и отображает только доступные
- **Адаптивный дизайн**: Страница корректно отображается на всех устройствах
- **Простота добавления**: Для добавления нового приложения достаточно создать директорию и обновить конфигурацию
- **Два способа установки**: Прямое скачивание .ipa файла и OTA установка через Safari
