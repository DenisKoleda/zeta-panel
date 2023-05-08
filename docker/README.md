# Как запустить свой докер контейнер

## Подготовка к запуску

Создайте свой docker-compose.yaml
Пример конфигурации вы можете найти в папке docker

Скопируйте папку config в папку с docker-compose.yaml
```
./config
--/cert.pem
--/privkey.pem
--/nginx.conf
./docker-compose.yaml
```
Добавьте свои ключи SSL в cert и privkey
И измените конфиг nginx.conf по вашему усмотрению

### Для windows путь оносительный
Пример:
```
SQLALCHEMY_DATABASE_URI=sqlite:///I:\\git\\zeta-panel\\data\\app.db
```

## Запуск контейнера

Изменив конфиги под ваши задачи запустите контейнер командой
```
docker-compose up
```

Контейнер автоматически будет обновлять базу данных при любых изменениях при перезапуске контейнера

## Обновление образа
```
docker-compose down
docker-compose pull
```
И запустите новый контейнер

Чтобы удалить все образа воспользуйтесь командой
```
docker rmi $(docker images -a -q)
```

## Полезные команды
```
Подключить к контейнеру 
docker exec -it zeta-panel_app_1 bash
Посмотреть логи
docker logs zeta-panel_app_1 -f
Посмотреть последние 10 строк
docker logs zeta-panel_app_1 -n 10
```