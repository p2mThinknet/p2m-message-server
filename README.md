# Start local service for development
1. Ensure MySql server is running in localhost
2. Create database `dev_p2m_message_server`.
3. Run following command to initialize database
```bash
yarn run migration
```
4. Start service
```bash
yarn start
```

# Start a message service as docker
``` bash
docker run -d \
    --restart always \
    -p <port>:80 \
    -e SERVER_PATH=<service path, default is /messages> \
    -e DB_HOST=<mysql container name, default is mysql> \
    -e DB_DATABASE=<mysql database name, default is p2m_message_server> \
    -e DB_USERNAME=<mysql user name, default is root> \
    -e DB_PASSWORD=<mysql password, default is aaaaaaaa> \
    -e JPUSH_APPKEY=<your jpush appKey> \
    -e JPUSH_MASTER=<your jpush masterSecret> \
    colinhan/p2m-message-server
```

