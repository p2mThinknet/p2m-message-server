FROM colinhan/p2m-node6

RUN npm set registry https://registry.npm.taobao.org/

ADD ./package.json /package.json
ADD ./yarn.lock /yarn.lock
RUN yarn install --prod

ADD ./bin /bin
ADD ./build /build
ADD ./config /config

ENV NODE_ENV production
EXPOSE 80

CMD /bin/wait-for-it.sh -t 120 mysql:3306 -- /bin/start.sh 2>&1 | tee ${LOG_DIR}/message-server.log
