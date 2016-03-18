FROM ubuntu:14.04

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -y
RUN apt-get install -y texlive-latex-base texlive-xetex latex-xcolor texlive-math-extra texlive-latex-extra texlive-fonts-extra biblatex curl wget git fontconfig make build-essential openssl libssl-dev

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

ENTRYPOINT ["/.cabal/bin/pandoc"]

EXPOSE 3000
RUN touch .foreverignore
CMD forever -w ./index.js
