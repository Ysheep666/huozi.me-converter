FROM jagregory/pandoc

RUN apt-get install -y nodejs npm git git-core
RUN npm install --silent -g forever

ADD . /opt/src
WORKDIR /opt/src

EXPOSE 3000
RUN touch .foreverignore
CMD forever -w ./index.js
