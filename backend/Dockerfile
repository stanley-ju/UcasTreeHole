FROM golang:1.20.6

ENV GOPROXY https://goproxy.cn,direct
WORKDIR $GOPATH/treehole/backend
COPY . $GOPATH/treehole/backend
RUN go build .

EXPOSE 8080
ENTRYPOINT ["./backend"]