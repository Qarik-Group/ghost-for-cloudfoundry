FROM ubuntu:15.10

ADD https://cli.run.pivotal.io/stable?release=linux64-binary&version=6.20.0 /tmp/cf.tgz
RUN

RUN tar xzf /tmp/cf.tgz -C /usr/bin && rm /tmp/cf.tgz \
    && apt-get update \
    && apt-get -y install git zip unzip tree file curl wget bzr jq \
    && apt-get clean
