FROM golang:1.19-alpine
WORKDIR /app
COPY . .
RUN go build -o main .
CMD ["/app/main"]
EXPOSE 8080