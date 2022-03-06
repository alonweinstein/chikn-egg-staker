FROM node:16-slim
WORKDIR /tmp
COPY *.js /tmp/
COPY projects /tmp/projects 
COPY package.json /tmp
COPY config.json /tmp
RUN npm install 
COPY launch.sh /tmp
RUN chmod +x /tmp/launch.sh 
ENTRYPOINT [ "/tmp/launch.sh" ]
