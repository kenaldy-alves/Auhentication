# ORACLE INSTANT CLIENT INSTALATION
FROM oraclelinux:7-slim

RUN yum -y install oracle-nodejs-release-el7 oracle-instantclient-release-el7 && \
    yum -y install nodejs node-oracledb-node14 && \
    rm -rf /var/cache/yum/*

ENV NODE_PATH=/usr/lib/node_modules/

#CMD ["/bin/node", "-v"]
# END ORACLE INSTANT CLIENT INSTALATION

# Create app directory
WORKDIR /usr/src/app

# Adiciona env vars
ENV TZ=America/Sao_Paulo
ENV TYPEORM_SYNCHRONIZE=false
ENV TYPEORM_ENTITIES="build/src/models/*.js"
ENV TYPEORM_MIGRATIONS="build/migrations/*.js"
ENV TYPEORM_MIGRATIONS_RUN=true
ENV TYPEORM_ENTITIES_DIR="build/src/models"
ENV TYPEORM_MIGRATIONS_DIR="build/migrations"
ENV TYPEORM_MIGRATIONS_TABLE_NAME="migrations"
ENV TYPEORM_CACHE=false
ENV TYPEORM_LOGGING=true

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install -g typescript
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8000

RUN npm run compile

CMD npm start

LABEL test=true
RUN npm test --coverage
