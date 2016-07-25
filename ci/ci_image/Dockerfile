FROM ubuntu:15.10

ADD https://cli.run.pivotal.io/stable?release=linux64-binary&version=6.20.0 /tmp/cf.tgz

RUN tar xzf /tmp/cf.tgz -C /usr/bin && rm /tmp/cf.tgz \
    && apt-get update \
    && apt-get -y install git zip unzip tree file curl wget bzr jq \
    && apt-get clean && rm /var/lib/apt/lists/*_*

RUN mkdir /nodejs && curl https://nodejs.org/dist/v6.3.1/node-v6.3.1-linux-x64.tar.gz | tar xvzf - -C /nodejs --strip-components=1

ENV PATH $PATH:/nodejs/bin
ENV NODE_ENV production
