FROM node:22-alpine

WORKDIR /app

COPY . .
COPY entry_point.sh /usr/local/bin/entry_point.sh

RUN chmod +x /usr/local/bin/entry_point.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/entry_point.sh"]
CMD ["npm", "run", "start"]
