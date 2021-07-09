
FROM node:12.18.1
ENV NODE_ENV=production

WORKDIR /app

COPY ["lib", "index.js", "klasik.xml", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "upload.js" ]

EXPOSE 5000