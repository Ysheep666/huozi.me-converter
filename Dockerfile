FROM jagregory/pandoc

ENV LANG en_US.UTF-8

RUN apt-get update && apt-get -y install git-core curl build-essential openssl libssl-dev
RUN apt-get -y install python

RUN git clone https://github.com/joyent/node.git
WORKDIR node
RUN git checkout v0.10.28
RUN ./configure --openssl-libpath=/usr/lib/ssl
RUN make
RUN make install
RUN npm install --silent -g forever

ADD . /opt/src
WORKDIR /opt/src

RUN npm install

EXPOSE 3000
RUN touch .foreverignore
CMD forever -w ./index.js
