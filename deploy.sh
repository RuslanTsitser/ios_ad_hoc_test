#!/bin/bash

# Скрипт для загрузки iOS Ad Hoc на GitHub Pages

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Начинаем загрузку на GitHub Pages...${NC}"

# Проверяем наличие .ipa файла
if [ ! -f "app.ipa" ]; then
    echo -e "${RED}❌ Файл app.ipa не найден!${NC}"
    echo -e "${YELLOW}Пожалуйста, поместите ваш .ipa файл в корень проекта и переименуйте его в app.ipa${NC}"
    exit 1
fi

# Проверяем, инициализирован ли git
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Инициализируем git репозиторий...${NC}"
    git init
fi

# Добавляем все файлы
echo -e "${GREEN}Добавляем файлы в git...${NC}"
git add .

# Коммитим изменения
echo -e "${GREEN}Создаем коммит...${NC}"
git commit -m "Update iOS Ad Hoc app $(date +%Y-%m-%d)"

# Проверяем, есть ли удаленный репозиторий
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${YELLOW}Удаленный репозиторий не настроен.${NC}"
    echo -e "${YELLOW}Пожалуйста, выполните следующие команды:${NC}"
    echo -e "${YELLOW}git remote add origin https://github.com/YOUR_USERNAME/ios-ad-hoc.git${NC}"
    echo -e "${YELLOW}git branch -M main${NC}"
    echo -e "${YELLOW}git push -u origin main${NC}"
    exit 1
fi

# Пушим изменения
echo -e "${GREEN}Загружаем на GitHub...${NC}"
git push origin main

echo -e "${GREEN}✅ Загрузка завершена!${NC}"
echo -e "${YELLOW}Не забудьте включить GitHub Pages в настройках репозитория:${NC}"
echo -e "${YELLOW}Settings > Pages > Source: Deploy from a branch > main${NC}" 