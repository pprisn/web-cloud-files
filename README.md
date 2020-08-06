 Файловый менеджер WEB-Cloud-Files
 =============
 Хранение файлов пользователей в облачном сервисе
----------------------------------------------------

### Технологический стек реализации 
 nodejs
 express
 multer
 passport-local
 postgres 11.7+

### Развертывание приложения
Откорректировать в файле 
./sql/init.bat 
имя вашего пользователя для подключения к терминалу postgresql 

```
#!/bin/sh
createdb filescloud
psql -U ??postgres??  -d filescloud -a -f init.sql
```
Запустить на выполнение 
sql$./init.bat

В результате будет создана БД filescloud
Добавленая первая запись пользователя системы
Логин E-mail pprisn@yandex.ru
Пароль 12345678


Откорректировать файл
.env
```
DB_TYPE=postgres

DB_USER=??postgres??
DB_PASSWORD=??postgres???
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=filescloud
DB_MAXPOOL=5

SESSION_SECRET=secret
```

### Запуск серверной части приложения 

./node ./bin/www

###
Начальная страница запуска приложения
http://127.0.0.1:3000/
