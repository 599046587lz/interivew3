FROM node:12.7.0-alpine
LABEL description="Redhome Interview System"
EXPOSE 30013
ENV PORT=30013 MONGO_HOST="mongo-1:27017"
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm config set registry 'https://registry.npm.taobao.org' && \
    npm install --production \
    && npm cache clean

COPY . ./

CMD ["npm", "start"]