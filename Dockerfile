FROM colinhan/p2m-node6

ENV NODE_ENV production
RUN npm set registry https://registry.npm.taobao.org/ && \
    yarn config set registry  https://registry.npm.taobao.org/

ADD ./bin /bin
ADD ./src /src
ADD ./config /config
ADD ./tools /tools
ADD ./package.json /package.json
ADD ./yarn.lock /yarn.lock
ADD ./.babelrc /.babelrc

RUN NODE_ENV= yarn install && \
    yarn build && \
    rm -rf src && \
    rm -rf node_modules && \
    yarn install --prod

EXPOSE 80

CMD /bin/wait-for-it.sh -t 120 ${DB_HOST}:3306 -- /bin/start.sh 2>&1 | tee ${LOG_DIR}/message-server.log
